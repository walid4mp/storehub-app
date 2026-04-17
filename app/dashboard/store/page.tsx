'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Store, Copy, Check, ExternalLink, Palette, Globe, Save, Loader2 } from 'lucide-react'
import { getAllowedTemplates, MARKETPLACE_TEMPLATES, PLAN_DETAILS, type SubscriptionPlan } from '@/lib/platform-config'

interface StoreData {
  id: string
  slug: string
  name: string
  description: string | null
  template_id: string
  primary_color: string
  is_published: boolean
}

interface Subscription {
  id: string
  plan_type: SubscriptionPlan
  status: string
  end_date: string
}

export default function StorePage() {
  const [store, setStore] = useState<StoreData | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [templateId, setTemplateId] = useState('modern')
  const [primaryColor, setPrimaryColor] = useState('#10b981')
  const router = useRouter()
  const supabase = createClient()

  const activePlan = subscription?.plan_type ?? 'free'
  const allowedTemplates = getAllowedTemplates(activePlan)

  useEffect(() => {
    void loadData()
  }, [])

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
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      setSubscription(subscriptionData)

      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (storeData) {
        setStore(storeData)
        setName(storeData.name)
        setSlug(storeData.slug)
        setDescription(storeData.description || '')
        setTemplateId(storeData.template_id || 'modern')
        setPrimaryColor(storeData.primary_color || '#10b981')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (storeName: string) => `${storeName.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 40)}-${Math.random().toString(36).slice(2, 7)}`

  const handleSave = async () => {
    if (!name.trim()) return toast.error('يرجى كتابة اسم المتجر')

    const selectedTemplate = allowedTemplates.find((template) => template.id === templateId)
    if (!selectedTemplate) return toast.error('القالب غير متاح داخل خطتك الحالية')

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const storeSlug = slug || generateSlug(name)
      const payload = {
        name,
        slug: storeSlug,
        description,
        template_id: selectedTemplate.id,
        primary_color: primaryColor,
      }

      if (store) {
        const { error } = await supabase.from('stores').update(payload).eq('id', store.id)
        if (error) throw error
        toast.success('تم حفظ المتجر بنجاح')
      } else {
        const { error } = await supabase.from('stores').insert({ ...payload, user_id: user.id })
        if (error) throw error
        toast.success('تم إنشاء المتجر بنجاح')
      }

      await loadData()
      router.refresh()
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
      const { error } = await supabase.from('stores').update({ is_published: !store.is_published }).eq('id', store.id)
      if (error) throw error
      toast.success(store.is_published ? 'تم إلغاء نشر المتجر' : 'تم نشر المتجر')
      await loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setIsSaving(false)
    }
  }

  const copyLink = () => {
    if (!store) return
    navigator.clipboard.writeText(`${window.location.origin}/store/${store.slug}`)
    setCopied(true)
    toast.success('تم نسخ الرابط')
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><Store className="h-8 w-8 text-primary" /> {store ? 'إدارة المتجر' : 'إنشاء متجر جديد'}</h1>
        <p className="text-muted-foreground mt-2">بناء متجر احترافي مع قوالب جاهزة، ألوان مخصصة، ورابط فريد لمتجرك.</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold">الخطة الحالية: {PLAN_DETAILS[activePlan].label}</p>
            <p className="text-sm text-muted-foreground">القوالب المسموحة: {allowedTemplates.length} / {MARKETPLACE_TEMPLATES.length}</p>
          </div>
          <Badge>{PLAN_DETAILS[activePlan].billingLabel}</Badge>
        </CardContent>
      </Card>

      {store && (
        <Card>
          <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> رابط المتجر</p>
              <p className="text-sm text-muted-foreground truncate">{typeof window !== 'undefined' ? `${window.location.origin}/store/${store.slug}` : store.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyLink}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
              {store.is_published && <Button variant="outline" size="sm" asChild><a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a></Button>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>بيانات المتجر</CardTitle><CardDescription>اسم المتجر والوصف والرابط الفريد.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>اسم المتجر</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: StoreHub Fashion" /></div>
              <div className="space-y-2"><Label>الرابط المختصر</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="storehub-fashion" dir="ltr" /></div>
              <div className="space-y-2"><Label>وصف المتجر</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="متجر إلكتروني احترافي لبيع المنتجات أو الملفات الرقمية" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> تخصيص الألوان</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-14 h-14 rounded-xl border-0" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} dir="ltr" className="w-40 font-mono" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>اختيار القالب</CardTitle><CardDescription>حرّك مشروعك بسرعة باستخدام قالب مناسب لفئتك.</CardDescription></CardHeader>
          <CardContent className="space-y-4 max-h-[720px] overflow-auto">
            {MARKETPLACE_TEMPLATES.map((template) => {
              const allowed = allowedTemplates.some((item) => item.id === template.id)
              const selected = template.id === templateId
              return (
                <button key={template.id} type="button" disabled={!allowed} onClick={() => { if (!allowed) return; setTemplateId(template.id); setPrimaryColor(template.color) }} className={`w-full rounded-2xl border p-4 text-right transition-all ${selected ? 'border-primary bg-primary/5' : 'border-border'} ${!allowed ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/40'}`}>
                  <div className="h-20 rounded-xl mb-3" style={{ background: `linear-gradient(135deg, ${template.color}, #0f172a)` }} />
                  <div className="flex items-center justify-between gap-2 mb-1"><span className="font-medium">{template.name}</span>{allowed ? <Badge>متاح</Badge> : <Badge variant="outline">يتطلب ترقية</Badge>}</div>
                  <p className="text-xs text-muted-foreground">{template.nameEn} • {template.category}</p>
                </button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />} حفظ المتجر</Button>
        {store && <Button variant="outline" onClick={togglePublish} disabled={isSaving}>{store.is_published ? 'إلغاء النشر' : 'نشر المتجر'}</Button>}
      </div>
    </div>
  )
}
