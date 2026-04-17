import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildWhatsAppLink } from '@/lib/subscription-config'
import { isValidSubscriptionCode, normalizeSubscriptionCode, type PaidPlan } from '@/lib/subscription-codes'

const PLAN_LABELS: Record<PaidPlan, string> = {
  standard: 'Standard',
  pro: 'Pro',
}

const PLAN_PRICES: Record<PaidPlan, number> = {
  standard: 5,
  pro: 8,
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const body = await request.json()
    const planType = body?.planType as PaidPlan
    const subscriptionCode = normalizeSubscriptionCode(body?.subscriptionCode || '')

    if (!planType || !['standard', 'pro'].includes(planType)) {
      return NextResponse.json({ error: 'الخطة غير صالحة' }, { status: 400 })
    }

    if (!subscriptionCode) {
      return NextResponse.json({ error: 'يرجى إدخال كود الاشتراك' }, { status: 400 })
    }

    if (!isValidSubscriptionCode(planType, subscriptionCode)) {
      return NextResponse.json({ error: 'كود الاشتراك غير صحيح لهذه الخطة' }, { status: 400 })
    }

    const { data: activeSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    if (activeSubscription) {
      return NextResponse.json({ error: 'لديك اشتراك نشط بالفعل' }, { status: 400 })
    }

    const { data: pendingRequest } = await supabase
      .from('subscription_requests')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .maybeSingle()

    if (pendingRequest) {
      return NextResponse.json({ error: 'لديك طلب اشتراك قيد المراجعة بالفعل' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()

    const requestMessage = `كود الاشتراك: ${subscriptionCode}`

    const { error } = await supabase
      .from('subscription_requests')
      .insert({
        user_id: user.id,
        plan_type: planType,
        status: 'pending',
        message: requestMessage,
        subscription_code: subscriptionCode,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const whatsappMessage = [
      'مرحباً، أريد شراء اشتراك.',
      `الخطة: ${PLAN_LABELS[planType]}`,
      `السعر: $${PLAN_PRICES[planType]}/شهر`,
      `الكود: ${subscriptionCode}`,
      `الاسم: ${profile?.full_name || user.email || 'مستخدم جديد'}`,
      `البريد: ${user.email || '-'}`,
    ].join('\n')

    return NextResponse.json({
      success: true,
      whatsappUrl: buildWhatsAppLink(whatsappMessage),
      message: 'تم إرسال طلب الاشتراك بنجاح',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
