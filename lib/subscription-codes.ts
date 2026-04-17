import 'server-only'

export const CODE_SUBSCRIPTION_DURATION_DAYS = 30

export const DEMO_SUBSCRIPTION_CODES = {
  standard: [
    'BSC4K8M2L9QP',
    'BSC7N3T5W1ZX',
    'BSC9R2V6D4LM',
    'BSC5Y8P1Q7KR',
    'BSC2H6J9N3TW',
    'BSC8M4C7L2XF',
    'BSC1Q9V5P6DN',
    'BSC6T3K8R4YM',
    'BSC3W7L2H9QF',
    'BSC4D1N8V6TP',
    'BSC7P5X3M2LK',
    'BSC9F4R1T8QW',
    'BSC2V7C5N6YP',
    'BSC8L3D9M1KR',
    'BSC5Q2T7W4XF',
    'BSC1M8P6V3DN',
    'BSC6R4K2L9YT',
    'BSC3N7H5Q1XP',
    'BSC4V9M2T8LK',
    'BSC7D1P6R5QW',
  ],
  pro: [
    'PRO4K8M2L9QP',
    'PRO7N3T5W1ZX',
    'PRO9R2V6D4LM',
    'PRO5Y8P1Q7KR',
    'PRO2H6J9N3TW',
    'PRO8M4C7L2XF',
    'PRO1Q9V5P6DN',
    'PRO6T3K8R4YM',
    'PRO3W7L2H9QF',
    'PRO4D1N8V6TP',
    'PRO7P5X3M2LK',
    'PRO9F4R1T8QW',
    'PRO2V7C5N6YP',
    'PRO8L3D9M1KR',
    'PRO5Q2T7W4XF',
    'PRO1M8P6V3DN',
    'PRO6R4K2L9YT',
    'PRO3N7H5Q1XP',
    'PRO4V9M2T8LK',
    'PRO7D1P6R5QW',
  ],
} as const

export type PaidPlan = keyof typeof DEMO_SUBSCRIPTION_CODES

export function normalizeSubscriptionCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function isValidDemoSubscriptionCode(plan: PaidPlan, code: string) {
  return DEMO_SUBSCRIPTION_CODES[plan].includes(normalizeSubscriptionCode(code) as never)
}

export const isValidSubscriptionCode = isValidDemoSubscriptionCode

export function findDemoSubscriptionCode(code: string): { code: string; planType: PaidPlan; durationDays: number } | null {
  const normalizedCode = normalizeSubscriptionCode(code)

  if (isValidDemoSubscriptionCode('standard', normalizedCode)) {
    return { code: normalizedCode, planType: 'standard', durationDays: CODE_SUBSCRIPTION_DURATION_DAYS }
  }

  if (isValidDemoSubscriptionCode('pro', normalizedCode)) {
    return { code: normalizedCode, planType: 'pro', durationDays: CODE_SUBSCRIPTION_DURATION_DAYS }
  }

  return null
}

export function generateRandomSubscriptionCode(length = 12) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''

  for (let index = 0; index < length; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return code
}
