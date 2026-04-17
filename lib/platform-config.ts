export type SubscriptionPlan = 'free' | 'standard' | 'pro'

export type TemplateDefinition = {
  id: string
  name: string
  nameEn: string
  color: string
  category: string
  plans: SubscriptionPlan[]
}

export const STOREHUB_CONTACT = {
  whatsapp: '077910990',
  email: 'ww608352@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61570663858487',
  instagram: 'https://www.instagram.com/wh.s.8',
} as const

export const PLAN_DETAILS = {
  free: {
    label: 'Free',
    priceLabel: '$0',
    billingLabel: '20 يوم',
    templateLimit: 3,
    features: ['3 قوالب جاهزة', 'متجر واحد', 'منتجات غير محدودة', 'رابط متجر مخصص'],
  },
  standard: {
    label: 'Basic',
    priceLabel: '$5',
    billingLabel: 'شهريًا',
    templateLimit: 8,
    features: ['8 قوالب جاهزة', 'طلبات وعملاء', 'إحصائيات أساسية', 'دعم الدفع بالكود أو Stripe'],
  },
  pro: {
    label: 'Pro',
    priceLabel: '$8 / شهرين',
    billingLabel: 'ثم $10 شهريًا',
    templateLimit: 20,
    features: ['20 قالب احترافي', 'إحصائيات متقدمة', 'دردشة وتفاوض', 'إدارة متعددة اللغات'],
  },
} as const

export const TEMPLATE_LIMITS: Record<SubscriptionPlan, number> = {
  free: 3,
  standard: 8,
  pro: 20,
}

export const MARKETPLACE_TEMPLATES: TemplateDefinition[] = [
  { id: 'modern', name: 'عصري', nameEn: 'Modern', color: '#10b981', category: 'fashion', plans: ['free', 'standard', 'pro'] },
  { id: 'minimal', name: 'بسيط', nameEn: 'Minimal', color: '#64748b', category: 'general', plans: ['free', 'standard', 'pro'] },
  { id: 'catalog', name: 'كتالوج', nameEn: 'Catalog', color: '#0f766e', category: 'general', plans: ['free', 'standard', 'pro'] },
  { id: 'elegant', name: 'أنيق', nameEn: 'Elegant', color: '#8b5cf6', category: 'fashion', plans: ['standard', 'pro'] },
  { id: 'clean-shop', name: 'متجر نظيف', nameEn: 'Clean Shop', color: '#2563eb', category: 'general', plans: ['standard', 'pro'] },
  { id: 'craft', name: 'حِرفي', nameEn: 'Craft', color: '#c2410c', category: 'handmade', plans: ['standard', 'pro'] },
  { id: 'beauty', name: 'الجمال', nameEn: 'Beauty', color: '#db2777', category: 'beauty', plans: ['standard', 'pro'] },
  { id: 'electronics', name: 'إلكترونيات', nameEn: 'Electronics', color: '#1d4ed8', category: 'electronics', plans: ['standard', 'pro'] },
  { id: 'bold', name: 'جريء', nameEn: 'Bold', color: '#ef4444', category: 'fashion', plans: ['pro'] },
  { id: 'classic', name: 'كلاسيكي', nameEn: 'Classic', color: '#f59e0b', category: 'luxury', plans: ['pro'] },
  { id: 'tech', name: 'تقني', nameEn: 'Tech', color: '#3b82f6', category: 'electronics', plans: ['pro'] },
  { id: 'luxury', name: 'فاخر', nameEn: 'Luxury', color: '#7c3aed', category: 'luxury', plans: ['pro'] },
  { id: 'organic', name: 'طبيعي', nameEn: 'Organic', color: '#16a34a', category: 'food', plans: ['pro'] },
  { id: 'bookverse', name: 'مكتبة', nameEn: 'BookVerse', color: '#7c2d12', category: 'digital', plans: ['pro'] },
  { id: 'creator', name: 'المبدع', nameEn: 'Creator', color: '#9333ea', category: 'digital', plans: ['pro'] },
  { id: 'furniture', name: 'أثاث', nameEn: 'Furniture', color: '#78716c', category: 'home', plans: ['pro'] },
  { id: 'market-plus', name: 'ماركت بلس', nameEn: 'Market Plus', color: '#059669', category: 'general', plans: ['pro'] },
  { id: 'foodie', name: 'مطاعم', nameEn: 'Foodie', color: '#ea580c', category: 'food', plans: ['pro'] },
  { id: 'kids', name: 'أطفال', nameEn: 'Kids', color: '#ec4899', category: 'kids', plans: ['pro'] },
  { id: 'premium-dark', name: 'ليلي', nameEn: 'Premium Dark', color: '#111827', category: 'luxury', plans: ['pro'] },
]

export function getAllowedTemplates(plan: SubscriptionPlan | null) {
  if (!plan) return []
  return MARKETPLACE_TEMPLATES.filter((template) => template.plans.includes(plan))
}
