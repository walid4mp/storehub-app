import 'server-only'

export const FREE_TRIAL_DURATION_DAYS = 20

function addDays(baseDate: Date, days: number) {
  const nextDate = new Date(baseDate)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

export function buildSubscriptionPeriod(days: number) {
  const startDate = new Date()
  const endDate = addDays(startDate, days)

  return {
    startDate,
    endDate,
  }
}

export async function ensureDefaultFreeSubscription(supabase: any, userId: string) {
  const { data: existingSubscriptions, error: existingSubscriptionsError } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (existingSubscriptionsError) {
    throw existingSubscriptionsError
  }

  if (existingSubscriptions && existingSubscriptions.length > 0) {
    return {
      created: false,
      durationDays: FREE_TRIAL_DURATION_DAYS,
    }
  }

  const { startDate, endDate } = buildSubscriptionPeriod(FREE_TRIAL_DURATION_DAYS)

  const { error } = await supabase
    .from('subscriptions')
    .insert({
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

  if (error) {
    throw error
  }

  return {
    created: true,
    durationDays: FREE_TRIAL_DURATION_DAYS,
  }
}

export async function redeemSubscriptionCodeForUser({
  supabase,
  userId,
  planType,
  code,
  price,
  durationDays,
}: {
  supabase: any
  userId: string
  planType: 'standard' | 'pro'
  code: string
  price: number
  durationDays: number
}) {
  const { data: alreadyRedeemed, error: alreadyRedeemedError } = await supabase
    .from('subscription_code_redemptions')
    .select('id, user_id')
    .eq('code', code)
    .maybeSingle()

  if (alreadyRedeemedError) {
    throw alreadyRedeemedError
  }

  if (alreadyRedeemed) {
    throw new Error('هذا الكود تم استخدامه بالفعل')
  }

  const { data: activeSubscriptions, error: activeSubscriptionsError } = await supabase
    .from('subscriptions')
    .select('id, plan_type')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (activeSubscriptionsError) {
    throw activeSubscriptionsError
  }

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
      .update({
        status: 'expired',
        end_date: now,
        current_period_end: now,
      })
      .eq('user_id', userId)
      .eq('status', 'active')

    if (expireActiveSubscriptionsError) {
      throw expireActiveSubscriptionsError
    }
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
      stripe_status: 'code_redeemed',
    })
    .select('*')
    .single()

  if (insertedSubscriptionError) {
    throw insertedSubscriptionError
  }

  const { error: redemptionInsertError } = await supabase
    .from('subscription_code_redemptions')
    .insert({
      user_id: userId,
      code,
      plan_type: planType,
      duration_days: durationDays,
    })

  if (redemptionInsertError) {
    const now = new Date().toISOString()

    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        end_date: now,
        current_period_end: now,
      })
      .eq('id', insertedSubscription.id)

    throw new Error(redemptionInsertError.code === '23505' ? 'هذا الكود تم استخدامه بالفعل' : redemptionInsertError.message)
  }

  return insertedSubscription
}
