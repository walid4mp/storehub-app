import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { syncStripeSubscriptionForUser } from '@/lib/subscription-sync'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { data: latestSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .not('stripe_subscription_id', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!latestSubscription?.stripe_subscription_id) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const stripe = getStripe()
    const stripeSubscription = await stripe.subscriptions.retrieve(latestSubscription.stripe_subscription_id, {
      expand: ['items.data.price.product'],
    })

    const syncedSubscription = await syncStripeSubscriptionForUser({
      supabase,
      userId: user.id,
      subscription: stripeSubscription,
      checkoutSessionId: latestSubscription.stripe_checkout_session_id,
      stripeCustomerId:
        latestSubscription.stripe_customer_id ||
        (typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer?.id),
    })

    return NextResponse.json({
      success: true,
      subscription: syncedSubscription,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر تحديث حالة الاشتراك من Stripe'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
