import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { getAppBaseUrl } from '@/lib/stripe'
import { getStripePlan, type StripePlan } from '@/lib/stripe-config'

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
    const planType = body?.planType as StripePlan

    if (planType !== 'standard' && planType !== 'pro') {
      return NextResponse.json({ error: 'الخطة غير صالحة' }, { status: 400 })
    }

    const { data: existingPaidSubscription } = await supabase
      .from('subscriptions')
      .select('id, plan_type, stripe_subscription_id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .in('plan_type', ['standard', 'pro'])
      .limit(1)
      .maybeSingle()

    if (existingPaidSubscription) {
      return NextResponse.json(
        { error: 'لديك اشتراك مدفوع نشط بالفعل. يمكنك إدارة الفوترة من داخل لوحة الاشتراك.' },
        { status: 400 },
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone, stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle()

    const stripe = getStripe()
    const plan = getStripePlan(planType)

    let customerId = profile?.stripe_customer_id || null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: profile?.full_name || undefined,
        phone: profile?.phone || undefined,
        metadata: {
          user_id: user.id,
        },
      })

      customerId = customer.id

      await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
        })
        .eq('id', user.id)
    }

    const baseUrl = getAppBaseUrl(request)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      allow_promotion_codes: true,
      locale: 'auto',
      client_reference_id: user.id,
      success_url: `${baseUrl}/dashboard/subscription?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard/subscription?checkout=cancelled`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_type: planType,
        },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: plan.currency,
            unit_amount: plan.amount,
            recurring: {
              interval: plan.interval,
            },
            product_data: {
              name: plan.productName,
              description: plan.description,
            },
          },
        },
      ],
    })

    if (!session.url) {
      return NextResponse.json({ error: 'تعذر إنشاء رابط الدفع' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: session.url,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء إنشاء جلسة الدفع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
