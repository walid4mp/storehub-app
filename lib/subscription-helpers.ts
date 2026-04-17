import 'server-only'

import { CODE_SUBSCRIPTION_DURATION_DAYS, findDemoSubscriptionCode, normalizeSubscriptionCode } from '@/lib/subscription-codes'

export const FREE_TRIAL_DURATION_DAYS = 20

function addDays(baseDate: Date, days: number) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

export function buildSubscriptionPeriod(days: number) {
  const startDate = new Date()
  const endDate = addDays(startDate, days)

  return { startDate, endDate }
}

export async function ensureDefaultFreeSubscription(supabase: any, userId: string) {
  const { data: existingSubscriptions, error: existingSubscriptionsError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (existingSubscriptionsError) throw existingSubscriptionsError

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    return { created: false, durationDays: FREE_TRIAL_DURATION_DAYS }
  }

  const { startDate, endDate } = buildSubscriptionPeriod(FREE_TRIAL_DURATION_DAYS)

  const { error } = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan_type: 'free',
    status: 'active',
    price: 0,
    currency: 'usd',
    billing_interval: 'trial',
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    current_period_start: startDate.toISOString(),
    current_period_end: endDate.toISOString(),
  })

  if (error) throw error

  return { created: true, durationDays: FREE_TRIAL_DURATION_DAYS }
}

export async function resolveSubscriptionCode(supabase: any, code: string) {
  const normalizedCode = normalizeSubscriptionCode(code)

  try {
    const { data: subscriptionCode, error } = await supabase
      .from('subscription_codes')
      .select('id, code, plan_type, duration_days, max_redemptions, current_redemptions, is_active')
      .eq('code', normalizedCode)
      .maybeSingle()

    if (!error && subscriptionCode) {
      if (!subscriptionCode.is_active) {
        throw new Error('هذا الكود غير نشط حالياً')
      }

      if (subscriptionCode.current_redemptions >= subscriptionCode.max_redemptions) {
        throw new Error('تم استهلاك عدد الاستخدامات المسموح لهذا الكود')
      }

      return {
        source: 'database' as const,
        id: subscriptionCode.id,
        code: subscriptionCode.code,
        planType: subscriptionCode.plan_type as 'standard' | 'pro',
        durationDays: subscriptionCode.duration_days || CODE_SUBSCRIPTION_DURATION_DAYS,
        maxRedemptions: subscriptionCode.max_redemptions || 1,
        currentRedemptions: subscriptionCode.current_redemptions || 0,
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message !== 'هذا الكود غير نشط حالياً' && error.message !== 'تم استهلاك عدد الاستخدامات المسموح لهذا الكود') {
      // ignore and fallback to demo codes
    } else {
      throw error
    }
  }

  const demoCode = findDemoSubscriptionCode(normalizedCode)

  if (demoCode) {
    return {
      source: 'demo' as const,
      id: null,
      code: demoCode.code,
      planType: demoCode.planType,
      durationDays: demoCode.durationDays,
      maxRedemptions: 1,
      currentRedemptions: 0,
    }
  }

  return null
}

export async function redeemSubscriptionCodeForUser({
  supabase,
  userId,
  planType,
  code,
  price,
  durationDays,
  codeSource,
  databaseCodeId,
}: {
  supabase: any
  userId: string
  planType: 'standard' | 'pro'
  code: string
  price: number
  durationDays: number
  codeSource: 'database' | 'demo'
  databaseCodeId: string | null
}) {
  const { data: userRedemption, error: userRedemptionError } = await supabase
    .from('subscription_code_redemptions')
    .select('id')
    .eq('user_id', userId)
    .eq('code', code)
    .maybeSingle()

  if (userRedemptionError) throw userRedemptionError
  if (userRedemption) throw new Error('لقد استخدمت هذا الكود من قبل')

  const { data: activeSubscriptions, error: activeSubscriptionsError } = await supabase
    .from('subscriptions')
    .select('id, plan_type')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (activeSubscriptionsError) throw activeSubscriptionsError

  const hasActivePaidSubscription = activeSubscriptions?.some(
    (subscription: { plan_type: string }) => subscription.plan_type === 'standard' || subscription.plan_type === 'pro',
  )

  if (hasActivePaidSubscription) {
    throw new Error('لديك اشتراك مدفوع نشط بالفعل')
  }

  if (activeSubscriptions && activeSubscriptions.length > 0) {
    const now = new Date().toISOString()
    const { error: expireActiveSubscriptionsError } = await supabase
      .from('subscriptions')
      .update({ status: 'expired', end_date: now, current_period_end: now })
      .eq('user_id', userId)
      .eq('status', 'active')

    if (expireActiveSubscriptionsError) throw expireActiveSubscriptionsError
  }

  const { startDate, endDate } = buildSubscriptionPeriod(durationDays)

  const { data: insertedSubscription, error: insertedSubscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      status: 'active',
      price,
      currency: 'usd',
      billing_interval: 'month',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      current_period_start: startDate.toISOString(),
      current_period_end: endDate.toISOString(),
      stripe_status: codeSource === 'database' ? 'admin_code' : 'demo_code',
    })
    .select('*')
    .single()

  if (insertedSubscriptionError) throw insertedSubscriptionError

  const { error: redemptionInsertError } = await supabase.from('subscription_code_redemptions').insert({
    user_id: userId,
    code,
    plan_type: planType,
    duration_days: durationDays,
    subscription_code_id: databaseCodeId,
  })

  if (redemptionInsertError) throw new Error(redemptionInsertError.message)

  if (codeSource === 'database' && databaseCodeId) {
    const { error: incrementError } = await supabase.rpc('increment_subscription_code_redemptions', {
      p_code_id: databaseCodeId,
    })

    if (incrementError) {
      throw new Error(incrementError.message)
    }
  }

  return insertedSubscription
}
