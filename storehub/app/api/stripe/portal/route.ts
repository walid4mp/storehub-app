import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, getAppBaseUrl } from '@/lib/stripe'

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle()

    const { data: activeSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .in('plan_type', ['standard', 'pro'])
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const customerId = profile?.stripe_customer_id || activeSubscription?.stripe_customer_id

    if (!customerId) {
      return NextResponse.json({ error: 'لا يوجد عميل Stripe مرتبط بهذا الحساب بعد.' }, { status: 400 })
    }

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getAppBaseUrl(request)}/dashboard/subscription`,
    })

    return NextResponse.json({
      success: true,
      url: session.url,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'تعذر فتح بوابة إدارة الفوترة'
    return NextResponse.json({
      error:
        message.includes('configuration') || message.includes('No configuration provided')
          ? 'لازم تفعّل Customer Portal من إعدادات Stripe Dashboard أولاً.'
          : message,
    }, { status: 500 })
  }
}
