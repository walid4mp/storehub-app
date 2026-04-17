export type StripePlan = 'standard' | 'pro'

export const STRIPE_PLANS: Record<
  StripePlan,
  {
    label: string
    amount: number
    currency: 'usd'
    interval: 'month'
    productName: string
    description: string
  }
> = {
  standard: {
    label: 'Standard',
    amount: 500,
    currency: 'usd',
    interval: 'month',
    productName: 'StoreHub Standard',
    description: 'اشتراك شهري تلقائي لخطة Standard في منصة StoreHub',
  },
  pro: {
    label: 'Pro',
    amount: 800,
    currency: 'usd',
    interval: 'month',
    productName: 'StoreHub Pro',
    description: 'اشتراك شهري تلقائي لخطة Pro في منصة StoreHub',
  },
}

export function getStripePlan(planType: string) {
  if (planType !== 'standard' && planType !== 'pro') {
    throw new Error('الخطة غير صالحة')
  }

  return STRIPE_PLANS[planType]
}

export function formatPlanAmount(amount: number) {
  return amount / 100
}
