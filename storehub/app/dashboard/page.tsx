import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Store, ShoppingBag, Eye, TrendingUp, Plus, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store?.id || '')

  const hasActiveSubscription = subscription?.status === 'active'
  const hasStore = !!store

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مرحباً، {profile?.full_name || 'مستخدم'}</h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة تحكم متجرك الإلكتروني</p>
      </div>

      {!hasActiveSubscription && (
        <Card className="mb-6 border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium">لا يوجد اشتراك نشط</p>
              <p className="text-sm text-muted-foreground">اشترك الآن للحصول على قوالب متجر احترافية ومميزات حصرية</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/subscription">
                اشترك الآن
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">المتجر</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasStore ? store.name : 'لم يتم إنشاء المتجر'}</div>
            {hasStore && (
              <Badge variant={store.is_published ? 'default' : 'secondary'} className="mt-2">
                {store.is_published ? 'منشور' : 'غير منشور'}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">المنتجات</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">منتج في متجرك</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">الاشتراك</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription?.plan_type === 'pro'
                ? 'Pro'
                : subscription?.plan_type === 'standard'
                  ? 'Standard'
                  : subscription?.plan_type === 'free'
                    ? 'مجاني'
                    : 'بدون اشتراك'}
            </div>
            {subscription?.end_date && (
              <p className="text-xs text-muted-foreground mt-1">
                ينتهي في {new Date(subscription.end_date).toLocaleDateString('ar-SA')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">المشاهدات</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <TrendingUp className="h-3 w-3" />
              قريباً
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {!hasStore ? (
          <Card className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                أنشئ متجرك الأول
              </CardTitle>
              <CardDescription>ابدأ بإنشاء متجرك الإلكتروني واختر القالب المناسب لك</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild disabled={!hasActiveSubscription}>
                <Link href="/dashboard/store">
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء متجر
                </Link>
              </Button>
              {!hasActiveSubscription && (
                <p className="text-xs text-muted-foreground mt-2">يجب أن يكون لديك اشتراك نشط لإنشاء متجر</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                إدارة متجرك
              </CardTitle>
              <CardDescription>قم بتعديل إعدادات متجرك وتحديث المعلومات</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild>
                <Link href="/dashboard/store">إدارة المتجر</Link>
              </Button>
              {store.is_published && (
                <Button variant="outline" asChild>
                  <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 ml-2" />
                    معاينة
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
