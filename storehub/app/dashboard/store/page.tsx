'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Store,
  Copy,
  Check,
  ExternalLink,
  Palette,
  Globe,
  Save,
  Loader2,
  Gift,
  Crown,
  Zap,
} from 'lucide-react'
import type { SubscriptionPlan } from '@/lib/subscription-config'

interface StoreData {
  id: string
  slug: string
  name: string
  description: string | null
  template_id: string
  primary_color: string
  secondary_color: string
  is_published: boolean
}

interface Subscription {
  id: string
  plan_type: SubscriptionPlan
  status: string
  end_date: string
}

type TemplateDefinition = {
  id: string
  name: string
  nameEn: string
  color: string
  plans: SubscriptionPlan[]
}

const TEMPLATES: TemplateDefinition[] = [
  { id: 'modern', name: 'عصري', nameEn: 'Modern', color: '#10b981', plans: ['free', 'standard', 'pro'] },
  { id: 'elegant', name: 'أنيق', nameEn: 'Elegant', color: '#8b5cf6', plans: ['standard', 'pro'] },
  { id: 'minimal', name: 'بسيط', nameEn: 'Minimal', color: '#64748b', plans: ['standard', 'pro'] },
  { id: 'bold', name: 'جريء', nameEn: 'Bold', color: '#ef4444', plans: ['pro'] },
  { id: 'classic', name: 'كلاسيكي', nameEn: 'Classic', color: '#f59e0b', plans: ['pro'] },
  { id: 'tech', name: 'تقني', nameEn: 'Tech', color: '#3b82f6', plans: ['pro'] },
]

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  free: 'مجاني',
  standard: 'Standard',
  pro: 'Pro',
}

function getAllowedTemplates(plan: SubscriptionPlan | null) {
  if (!plan) return []
  return TEMPLATES.filter((template) => template.plans.includes(plan))
}

function getPlanIcon(plan: SubscriptionPlan | null) {
  if (plan === 'pro') return Crown
  if (plan === 'standard') return Zap
  return Gift
}

export default function StorePage() {
  const [store, setStore] = useState<StoreData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [templateId, setTemplateId] = useState('modern')
  const [primaryColor, setPrimaryColor] = useState('#10b981')

  const activePlan = subscription?.plan_type ?? null
  const allowedTemplates = getAllowedTemplates(activePlan)
  const PlanIcon = getPlanIcon(activePlan)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!allowedTemplates.length) return

    if (!allowedTemplates.some((template) => template.id === templateId)) {
      setTemplateId(allowedTemplates[0].id)
      setPrimaryColor(allowedTemplates[0].color)
    }
  }, [activePlan, templateId, allowedTemplates])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

      setSubscription(subscriptionData)

      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (storeData) {
        const allowedForCurrentPlan = getAllowedTemplates(subscriptionData?.plan_type ?? null)
        const fallbackTemplate = allowedForCurrentPlan[0]
        const selectedTemplate = allowedForCurrentPlan.find((template) => template.id === storeData.template_id)

        setStore(storeData)
        setName(storeData.name)
        setSlug(storeData.slug)
        setDescription(storeData.description || '')
        setTemplateId(selectedTemplate?.id || fallbackTemplate?.id || 'modern')
        setPrimaryColor(selectedTemplate?.color || fallbackTemplate?.color || storeData.primary_color || '#10b981')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (storeName: string) => {
    return storeName
      .toLowerCase()
      .replace(/[^a-z0-9؀-ۿ]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 7)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('يرجى إدخال اسم المتجر')
      return
    }

    if (!subscription) {
      toast.error('يجب أن يكون لديك اشتراك نشط أولاً')
      return
    }

    const selectedTemplate = allowedTemplates.find((template) => template.id === templateId)
    if (!selectedTemplate) {
      toast.error('هذا القالب غير متاح ضمن خطتك الحالية')
      return
    }

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const storeSlug = slug || generateSlug(name)

      if (store) {
        const { error } = await supabase
          .from('stores')
          .update({
            name,
            slug: storeSlug,
            description,
            template_id: selectedTemplate.id,
            primary_color: primaryColor,
          })
          .eq('id', store.id)

        if (error) throw error
        toast.success('تم حفظ التغييرات بنجاح')
      } else {
        const { data, error } = await supabase
          .from('stores')
          .insert({
            user_id: user.id,
            name,
            slug: storeSlug,
            description,
            template_id: selectedTemplate.id,
            primary_color: primaryColor,
          })
          .select()
          .single()

        if (error) throw error
        setStore(data)
        setSlug(data.slug)
        toast.success('تم إنشاء المتجر بنجاح')
      }

      await loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setIsSaving(false)
    }
  }

  const togglePublish = async () => {
    if (!store) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('stores')
        .update({ is_published: !store.is_published })
        .eq('id', store.id)

      if (error) throw error
      toast.success(store.is_published ? 'تم إلغاء نشر المتجر' : 'تم نشر المتجر بنجاح')
      await loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setIsSaving(false)
    }
  }

  const copyLink = () => {
    if (!store) return
    const link = `${window.location.origin}/store/${store.slug}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('تم نسخ الرابط')
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="text-center">
            <Store className="h-12 w-12 mx-auto text-warning mb-4" />
            <CardTitle>يجب أن يكون لديك اشتراك نشط</CardTitle>
            <CardDescription>
              يمكنك الآن تفعيل نسخة مجانية لمدة شهر بقالب واحد، أو شراء خطة مدفوعة من صفحة الاشتراك.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/dashboard/subscription">الانتقال إلى صفحة الاشتراك</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          {store ? 'إدارة المتجر' : 'إنشاء متجر جديد'}
        </h1>
        <p className="text-muted-foreground">
          {store ? 'قم بتعديل إعدادات متجرك' : 'أنشئ متجرك الإلكتروني الخاص'}
        </p>
      </div>

      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
              <PlanIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">الخطة الحالية: {PLAN_LABELS[subscription.plan_type]}</p>
              <p className="text-sm text-muted-foreground">
                القوالب المتاحة لك الآن: {allowedTemplates.length} من أصل {TEMPLATES.length}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            ينتهي الاشتراك في {new Date(subscription.end_date).toLocaleDateString('ar-SA')}
          </Badge>
        </CardContent>
      </Card>

      {store && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="flex items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Globe className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">رابط متجرك</p>
                <p className="text-sm text-muted-foreground truncate">
                  {typeof window !== 'undefined' && `${window.location.origin}/store/${store.slug}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              {store.is_published && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات المتجر</CardTitle>
            <CardDescription>المعلومات الأساسية لمتجرك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المتجر</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: متجر الأناقة"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف المتجر</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف قصير عن متجرك ومنتجاتك..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              قالب المتجر
            </CardTitle>
            <CardDescription>
              الخطة {PLAN_LABELS[subscription.plan_type]} تسمح لك باستخدام {allowedTemplates.length} قالب فقط.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => {
                const isAllowed = allowedTemplates.some((item) => item.id === template.id)
                const isSelected = templateId === template.id

                return (
                  <button
                    key={template.id}
                    type="button"
                    disabled={!isAllowed}
                    onClick={() => {
                      if (!isAllowed) return
                      setTemplateId(template.id)
                      setPrimaryColor(template.color)
                    }}
                    className={`relative p-4 rounded-xl border-2 transition-all text-right ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : isAllowed
                          ? 'border-border hover:border-primary/50'
                          : 'border-border opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded-lg mb-3"
                      style={{ backgroundColor: template.color }}
                    />
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-sm">{template.name}</p>
                      {!isAllowed && <Badge variant="outline">غير متاح</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{template.nameEn}</p>
                    {isSelected && isAllowed && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3" />
                        </Badge>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تخصيص الألوان</CardTitle>
            <CardDescription>اختر اللون الرئيسي لمتجرك</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label>اللون الرئيسي</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none">
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <Save className="h-4 w-4 ml-2" />
            )}
            {store ? 'حفظ التغييرات' : 'إنشاء المتجر'}
          </Button>

          {store && (
            <Button
              variant={store.is_published ? 'outline' : 'default'}
              onClick={togglePublish}
              disabled={isSaving}
            >
              {store.is_published ? 'إلغاء النشر' : 'نشر المتجر'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
