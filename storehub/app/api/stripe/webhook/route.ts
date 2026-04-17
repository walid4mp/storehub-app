import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import { syncStripeSubscriptionForUser } from '@/lib/subscription-sync'

export const runtime = 'nodejs'

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const admin = createAdminClient()
  const userId = subscription.metadata?.user_id

  if (!userId) {
    return
  }

  await syncStripeSubscriptionForUser({
    supabase: admin,
    userId,
    subscription,
    stripeCustomerId:
      typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id,
  })
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET غير مضبوط.' }, { status: 500 })
    }

    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Stripe signature غير موجود.' }, { status: 400 })
    }

    const stripe = getStripe()
    const body = await request.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
      const userId = session.metadata?.user_id

      if (subscriptionId && userId) {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items.data.price.product'],
        })

        await syncStripeSubscriptionForUser({
          supabase: createAdminClient(),
          userId,
          subscription: stripeSubscription,
          checkoutSessionId: session.id,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
        })
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await handleSubscriptionChange(event.data.object as Stripe.Subscription)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook processing failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
