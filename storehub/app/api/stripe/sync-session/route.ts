import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { syncStripeSubscriptionForUser } from '@/lib/subscription-sync'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const body = await request.json()
    const sessionId = body?.sessionId as string | undefined

    if (!sessionId) {
      return NextResponse.json({ error: 'معرّف جلسة الدفع غير موجود' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const sessionUserId = session.metadata?.user_id
    if (sessionUserId && sessionUserId !== user.id) {
      return NextResponse.json({ error: 'هذه الجلسة لا تخص هذا المستخدم' }, { status: 403 })
    }

    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

    if (!subscriptionId) {
      return NextResponse.json({ error: 'لم يتم العثور على اشتراك مرتبط بعملية الدفع' }, { status: 400 })
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })

    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

    if (stripeCustomerId) {
      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: stripeCustomerId,
        })
        .eq('id', user.id)
    }

    const syncedSubscription = await syncStripeSubscriptionForUser({
      supabase,
      userId: user.id,
      subscription: stripeSubscription,
      checkoutSessionId: session.id,
      stripeCustomerId,
    })

    return NextResponse.json({
      success: true,
      subscription: syncedSubscription,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر مزامنة الاشتراك بعد الدفع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
