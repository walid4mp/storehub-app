'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  CreditCard,
  Crown,
  Check,
  Loader2,
  Calendar,
  Sparkles,
  Zap,
  Gift,
  ShieldCheck,
  RefreshCcw,
  Receipt,
  Tag,
} from 'lucide-react'

interface Subscription {
  id: string
  plan_type: 'free' | 'standard' | 'pro'
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  price: number
  start_date: string | null
  end_date: string | null
  stripe_status?: string | null
  stripe_subscription_id?: string | null
  stripe_customer_id?: string | null
  cancel_at_period_end?: boolean | null
  currency?: string | null
  billing_interval?: string | null
  current_period_end?: string | null
}

const PLAN_PRICE_LABELS = {
  free: '$0',
  standard: '$5',
  pro: '$8 / شهرين',
} as const

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<'standard' | 'pro' | null>(null)
  const [isOpeningPortal, setIsOpeningPortal] = useState(false)
  const [isRefreshingStripe, setIsRefreshingStripe] = useState(false)
  const [subscriptionCode, setSubscriptionCode] = useState('')
  const [isRedeemingCode, setIsRedeemingCode] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return null
    }

    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setSubscription(subscriptionData)

    return {
      subscription: subscriptionData as Subscription | null,
    }
  }

  const syncCheckoutSession = async (sessionId: string) => {
    const response = await fetch('/api/stripe/sync-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'تعذر تأكيد الاشتراك بعد الدفع')
    }

    return result
  }

  const refreshStripeSubscription = async (showToast = false) => {
    const response = await fetch('/api/stripe/refresh', {
      method: 'POST',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'تعذر تحديث بيانات الاشتراك من Stripe')
    }

    if (showToast && !result.skipped) {
      toast.success('تم تحديث بيانات الفوترة من Stripe')
    }

    return result
  }

  useEffect(() => {
    let cancelled = false

    const initialize = async () => {
      try {
        setIsLoading(true)
        const data = await loadData()
        if (cancelled) return

        const checkoutStatus = searchParams.get('checkout')
        const sessionId = searchParams.get('session_id')

        if (checkoutStatus === 'success' && sessionId) {
          await syncCheckoutSession(sessionId)
          await loadData()
          toast.success('تم تأكيد الاشتراك والدفع التلقائي بنجاح')
          router.replace('/dashboard/subscription')
          return
        }

        if (checkoutStatus === 'cancelled') {
          toast.info('تم إلغاء عملية الدفع قبل الإتمام')
          router.replace('/dashboard/subscription')
          return
        }

        if (data?.subscription?.stripe_subscription_id) {
          await refreshStripeSubscription(false)
          await loadData()
        }
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل الاشتراك')
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void initialize()

    return () => {
      cancelled = true
    }
  }, [router, searchParams, supabase])

  const startCheckout = async (planType: 'standard' | 'pro') => {
    setActionLoading(planType)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'تعذر بدء الدفع')
      }

      window.location.href = result.url
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setActionLoading(null)
    }
  }

  const redeemCode = async () => {
    const trimmedCode = subscriptionCode.trim().toUpperCase()

    if (!trimmedCode) {
      toast.error('اكتب كود الاشتراك أولاً')
      return
    }

    setIsRedeemingCode(true)
    try {
      const response = await fetch('/api/subscription/redeem-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionCode: trimmedCode }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'تعذر تفعيل الكود')
      }

      toast.success(result.message || 'تم تفعيل الاشتراك بنجاح')
      setSubscriptionCode('')
      await loadData()
      router.refresh()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تفعيل الكود')
    } finally {
      setIsRedeemingCode(false)
    }
  }

  const openBillingPortal = async () => {
    setIsOpeningPortal(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'تعذر فتح بوابة الفوترة')
      }

      window.location.href = result.url
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setIsOpeningPortal(false)
    }
  }

  const handleManualRefresh = async () => {
    setIsRefreshingStripe(true)
    try {
      await refreshStripeSubscription(true)
      await loadData()
      router.refresh()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'تعذر تحديث الاشتراك')
    } finally {
      setIsRefreshingStripe(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentPlanLabel =
    subscription?.plan_type === 'pro'
      ? 'Pro'
      : subscription?.plan_type === 'standard'
        ? 'Basic'
        : subscription?.plan_type === 'free'
          ? 'مجاني'
          : null

  const statusLabel =
    subscription?.status === 'active'
      ? 'نشط'
      : subscription?.status === 'cancelled'
        ? 'ملغي'
        : subscription?.status === 'expired'
          ? 'منتهي'
          : subscription?.status === 'pending'
            ? 'قيد المعالجة'
            : null

  const freeFeatures = ['20 يوم مجانًا تلقائيًا عند إنشاء الحساب', 'قالب واحد', 'منتجات غير محدودة', 'رابط فريد للمتجر']
  const standardFeatures = ['8 قوالب متجر', 'منتجات غير محدودة', 'تجديد شهري تلقائي عبر Stripe', 'يمكن التفعيل أيضًا بكود اشتراك مخصص']
  const proFeatures = ['20 قالب احترافي', 'تحليلات ومظهر احترافي', 'العرض الحالي: $8 لمدة شهرين ثم $10 شهريًا', 'يمكن التفعيل أيضًا بكود اشتراك مخصص']

  const hasPaidSubscription = Boolean(
    subscription && subscription.status === 'active' && (subscription.plan_type === 'standard' || subscription.plan_type === 'pro'),
  )

  const renewalDate = subscription?.current_period_end || subscription?.end_date
  const currentPlanIntervalLabel =
    subscription?.plan_type === 'free'
      ? '20 يوم'
      : subscription?.billing_interval === 'month'
        ? 'شهر'
        : subscription?.billing_interval || 'شهر'

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            إدارة الاشتراك والفوترة
          </h1>
          <p className="text-muted-foreground">
            أي حساب جديد يحصل تلقائيًا على خطة مجانية لمدة 20 يوم، وبعدها تقدر تفعّل Standard أو Pro بالدفع عبر Stripe أو بكود اشتراك.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleManualRefresh} disabled={isRefreshingStripe}>
            {isRefreshingStripe ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <RefreshCcw className="h-4 w-4 ml-2" />}
            تحديث من Stripe
          </Button>
          {hasPaidSubscription && (
            <Button onClick={openBillingPortal} disabled={isOpeningPortal}>
              {isOpeningPortal ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Receipt className="h-4 w-4 ml-2" />}
              إدارة الفوترة
            </Button>
          )}
        </div>
      </div>

      {subscription && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {subscription.plan_type === 'pro' ? (
                    <Crown className="h-6 w-6 text-primary" />
                  ) : subscription.plan_type === 'standard' ? (
                    <Zap className="h-6 w-6 text-primary" />
                  ) : (
                    <Gift className="h-6 w-6 text-primary" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-lg">الخطة الحالية: {currentPlanLabel}</h3>
                    {statusLabel && <Badge>{statusLabel}</Badge>}
                    {subscription.cancel_at_period_end && <Badge variant="secondary">سيتوقف بنهاية الفترة</Badge>}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {renewalDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        التجديد / الانتهاء: {new Date(renewalDate).toLocaleDateString('ar-SA')}
                      </span>
                    )}
                    {subscription.stripe_status && (
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" />
                        حالة Stripe: {subscription.stripe_status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold">{PLAN_PRICE_LABELS[subscription.plan_type]}</p>
                <p className="text-sm text-muted-foreground">/{currentPlanIntervalLabel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed border-primary/40 bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-primary" />
            تفعيل الاشتراك بكود
          </CardTitle>
          <CardDescription>
            اكتب أي كود من أكواد Standard أو Pro، واضغط تفعيل وسيتم تحديد الخطة المناسبة تلقائيًا بشكل فوري. كل كود يُستخدم مرة واحدة.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row">
          <Input
            value={subscriptionCode}
            onChange={(e) => setSubscriptionCode(e.target.value.toUpperCase())}
            placeholder="مثال: STD-7F2K-MART أو PRO-9X4K-ELIT"
            className="md:flex-1"
            dir="ltr"
            disabled={isRedeemingCode || hasPaidSubscription}
          />
          <Button onClick={redeemCode} disabled={isRedeemingCode || hasPaidSubscription || actionLoading !== null}>
            {isRedeemingCode ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Tag className="h-4 w-4 ml-2" />}
            تفعيل الآن
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className={`border-2 ${subscription?.plan_type === 'free' && subscription.status === 'active' ? 'border-primary' : 'border-border'}`}>
          <CardHeader className="text-center pb-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">مجاني</CardTitle>
            <CardDescription>تتفعّل تلقائيًا لمدة 20 يوم عند إنشاء الحساب</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/20 يوم</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription?.plan_type === 'free' && subscription.status === 'active' ? (
              <Button className="w-full" disabled>
                <Check className="h-4 w-4 ml-2" />
                الخطة الحالية
              </Button>
            ) : (
              <Button className="w-full" variant="secondary" disabled>
                الخطة المجانية تُمنح مرة واحدة تلقائيًا
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className={`border-2 ${subscription?.plan_type === 'standard' && subscription.status === 'active' ? 'border-primary' : 'border-border'}`}>
          <CardHeader className="text-center pb-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl">Basic</CardTitle>
            <CardDescription>الخطة الأساسية للمتاجر الجديدة</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-muted-foreground">/شهر</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {standardFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription?.plan_type === 'standard' && subscription.status === 'active' ? (
              <Button className="w-full" disabled>
                <Check className="h-4 w-4 ml-2" />
                الخطة الحالية
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => startCheckout('standard')} disabled={hasPaidSubscription || isRedeemingCode || actionLoading !== null}>
                {actionLoading === 'standard' ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <CreditCard className="h-4 w-4 ml-2" />}
                اشترك عبر Stripe
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className={`border-2 relative overflow-hidden ${subscription?.plan_type === 'pro' && subscription.status === 'active' ? 'border-primary' : 'border-primary/50'}`}>
          <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 inline-block ml-2" />
            الأكثر شعبية
          </div>
          <CardHeader className="text-center pb-8 pt-12">
            <Badge variant="secondary" className="mx-auto mb-4">
يدعم الدفع المباشر أو التفعيل بكود
            </Badge>
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription>أفضل اختيار للمتاجر الاحترافية</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold text-primary">$8</span>
              <span className="text-muted-foreground">/شهرين</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {subscription?.plan_type === 'pro' && subscription.status === 'active' ? (
              <Button className="w-full" disabled>
                <Check className="h-4 w-4 ml-2" />
                الخطة الحالية
              </Button>
            ) : (
              <Button className="w-full" onClick={() => startCheckout('pro')} disabled={hasPaidSubscription || isRedeemingCode || actionLoading !== null}>
                {actionLoading === 'pro' ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <CreditCard className="h-4 w-4 ml-2" />}
                اشترك عبر Stripe
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
