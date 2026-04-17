import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error('يرجى إضافة STRIPE_SECRET_KEY داخل ملف البيئة أولاً.')
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey)
  }

  return stripeInstance
}

export function getAppBaseUrl(request: Request) {
  const origin = request.headers.get('origin')
  if (origin) return origin

  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  const host = request.headers.get('host')
  if (host) {
    const protocol = host.includes('localhost') ? 'http' : 'https'
    return `${protocol}://${host}`
  }

  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}
