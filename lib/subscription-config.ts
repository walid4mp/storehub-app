export const WHATSAPP_NUMBER = '+213779109990'
export const WHATSAPP_NUMBER_DIGITS = WHATSAPP_NUMBER.replace(/\D/g, '')

export type SubscriptionPlan = 'free' | 'standard' | 'pro'

export function buildWhatsAppLink(message?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER_DIGITS}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

export const TEMPLATE_LIMITS: Record<SubscriptionPlan, number> = {
  free: 3,
  standard: 8,
  pro: 20,
}
