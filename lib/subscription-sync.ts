import type Stripe from 'stripe'
import { getStripePlan, type StripePlan } from '@/lib/stripe-config'

export type AppSubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled'

export function mapStripeStatusToAppStatus(status: Stripe.Subscription.Status): AppSubscriptionStatus {
  if (status === 'active' || status === 'trialing' || status === 'past_due') {
    return 'active'
  }

  if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired') {
    return 'cancelled'
  }

  return 'pending'
}

export function detectPlanFromStripeSubscription(subscription: Stripe.Subscription): StripePlan {
  const metadataPlan = subscription.metadata?.plan_type

  if (metadataPlan === 'standard' || metadataPlan === 'pro') {
    return metadataPlan
  }

  const unitAmount = subscription.items.data[0]?.price?.unit_amount ?? 0
  return unitAmount <= 500 ? 'standard' : 'pro'
}

export async function syncStripeSubscriptionForUser({
  supabase,
  userId,
  subscription,
  checkoutSessionId,
  stripeCustomerId,
}: {
  supabase: any
  userId: string
  subscription: Stripe.Subscription
  checkoutSessionId?: string | null
  stripeCustomerId?: string | null
}) {
  const planType = detectPlanFromStripeSubscription(subscription)
  const plan = getStripePlan(planType)
  const item = subscription.items.data[0]
  const priceAmount = item?.price?.unit_amount ?? plan.amount
  const currency = (item?.price?.currency ?? plan.currency).toLowerCase()
  const interval = item?.price?.recurring?.interval ?? plan.interval
  const mappedStatus = mapStripeStatusToAppStatus(subscription.status)
  const periodStart = subscription.items.data[0]?.current_period_start ?? subscription.start_date
  const periodEnd = subscription.items.data[0]?.current_period_end ?? subscription.cancel_at ?? subscription.start_date

  await supabase
    .from('subscriptions')
    .update({
      status: 'expired',
    })
    .eq('user_id', userId)
    .eq('status', 'active')
    .eq('plan_type', 'free')

  await supabase
    .from('subscriptions')
    .update({
      status: mappedStatus === 'active' ? 'cancelled' : mappedStatus,
    })
    .eq('user_id', userId)
    .eq('status', 'active')
    .neq('stripe_subscription_id', subscription.id)

  const payload = {
    user_id: userId,
    plan_type: planType,
    status: mappedStatus,
    price: priceAmount / 100,
    start_date: new Date(periodStart * 1000).toISOString(),
    end_date: new Date(periodEnd * 1000).toISOString(),
    stripe_customer_id: stripeCustomerId ?? (typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id ?? null),
    stripe_subscription_id: subscription.id,
    stripe_checkout_session_id: checkoutSessionId ?? null,
    stripe_status: subscription.status,
    currency,
    billing_interval: interval,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_start: new Date(periodStart * 1000).toISOString(),
    current_period_end: new Date(periodEnd * 1000).toISOString(),
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(payload, {
      onConflict: 'stripe_subscription_id',
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
