import 'server-only'

export const CODE_SUBSCRIPTION_DURATION_DAYS = 30

export const SUBSCRIPTION_CODES = {
  standard: [
    'STD-7F2K-MART',
    'STD-4Q8L-SHOP',
    'STD-9M3X-BASE',
    'STD-6R1P-DEAL',
    'STD-2T7V-NEXT',
    'STD-8C4N-SALE',
    'STD-5H9D-PLUS',
    'STD-3J6B-GROW',
    'STD-1W8Z-FAST',
    'STD-4N2Y-LITE',
    'STD-7P5Q-SMRT',
    'STD-6K3M-EASY',
    'STD-2X9R-MOVE',
    'STD-8V1C-OPEN',
    'STD-5L4T-WAVE',
    'STD-9B7H-MINT',
    'STD-3F6N-CORE',
    'STD-1R8K-BIRD',
    'STD-4D2P-SOFT',
    'STD-7Y5J-GRID',
  ],
  pro: [
    'PRO-9X4K-ELIT',
    'PRO-7M2V-GOLD',
    'PRO-5Q8N-ULTR',
    'PRO-3T6R-MAXX',
    'PRO-1P9C-PRME',
    'PRO-8L4B-PLUS',
    'PRO-6H7Y-SUIT',
    'PRO-2N5D-BOSS',
    'PRO-4R1W-EDGE',
    'PRO-9C3F-VIPR',
    'PRO-7K8T-AURA',
    'PRO-5V2M-NOVA',
    'PRO-3B6P-ATOM',
    'PRO-1D9L-PEAK',
    'PRO-8Y4Q-FLOW',
    'PRO-6J7X-RISE',
    'PRO-2F5H-STAR',
    'PRO-4P1N-ZOOM',
    'PRO-9T3C-MEGA',
    'PRO-7W8R-KING',
  ],
} as const

export type PaidPlan = keyof typeof SUBSCRIPTION_CODES

export function normalizeSubscriptionCode(code: string) {
  return code.trim().toUpperCase()
}

export function isValidSubscriptionCode(plan: PaidPlan, code: string) {
  return SUBSCRIPTION_CODES[plan].includes(normalizeSubscriptionCode(code) as never)
}

export function findSubscriptionCode(code: string): { code: string; planType: PaidPlan; durationDays: number } | null {
  const normalizedCode = normalizeSubscriptionCode(code)

  if (isValidSubscriptionCode('standard', normalizedCode)) {
    return {
      code: normalizedCode,
      planType: 'standard',
      durationDays: CODE_SUBSCRIPTION_DURATION_DAYS,
    }
  }

  if (isValidSubscriptionCode('pro', normalizedCode)) {
    return {
      code: normalizedCode,
      planType: 'pro',
      durationDays: CODE_SUBSCRIPTION_DURATION_DAYS,
    }
  }

  return null
}
