import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureDefaultFreeSubscription, FREE_TRIAL_DURATION_DAYS } from '@/lib/subscription-helpers'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    const { data: existingSubscription, error: existingSubscriptionError } = await supabase
      .from('subscriptions')
      .select('id, plan_type, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingSubscriptionError) {
      return NextResponse.json({ error: existingSubscriptionError.message }, { status: 400 })
    }

    if (existingSubscription?.plan_type === 'free' && existingSubscription.status === 'active') {
      return NextResponse.json({
        success: true,
        created: false,
        message: `الخطة المجانية مفعلة بالفعل لمدة ${FREE_TRIAL_DURATION_DAYS} يوم`,
      })
    }

    if (existingSubscription) {
      return NextResponse.json({
        success: true,
        created: false,
        message: 'هذا الحساب لديه اشتراك سابق بالفعل',
      })
    }

    const result = await ensureDefaultFreeSubscription(supabase, user.id)

    return NextResponse.json({
      success: true,
      created: result.created,
      message: `تم تفعيل الخطة المجانية لمدة ${FREE_TRIAL_DURATION_DAYS} يوم بنجاح`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
