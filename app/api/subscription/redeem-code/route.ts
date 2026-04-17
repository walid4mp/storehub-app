import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redeemSubscriptionCodeForUser, resolveSubscriptionCode } from '@/lib/subscription-helpers'

const PLAN_LABELS = {
  standard: 'Basic',
  pro: 'Pro',
} as const

const PLAN_PRICES = {
  standard: 5,
  pro: 10,
} as const

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
    const matchedCode = await resolveSubscriptionCode(supabase, body?.subscriptionCode || '')

    if (!matchedCode) {
      return NextResponse.json({ error: 'كود الاشتراك غير صحيح' }, { status: 400 })
    }

    const subscription = await redeemSubscriptionCodeForUser({
      supabase,
      userId: user.id,
      planType: matchedCode.planType,
      code: matchedCode.code,
      price: PLAN_PRICES[matchedCode.planType],
      durationDays: matchedCode.durationDays,
      codeSource: matchedCode.source,
      databaseCodeId: matchedCode.id,
    })

    return NextResponse.json({
      success: true,
      planType: matchedCode.planType,
      subscription,
      message: `تم تفعيل خطة ${PLAN_LABELS[matchedCode.planType]} بنجاح`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
