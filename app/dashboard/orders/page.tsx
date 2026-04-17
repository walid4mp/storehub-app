import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PackageCheck, ShoppingCart, Users, TrendingUp } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase.from('stores').select('id, name').eq('user_id', user.id).maybeSingle()

  if (!store) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>أنشئ متجر أولاً</CardTitle>
            <CardDescription>بعد إنشاء المتجر، الطلبات هتظهر هنا بشكل مباشر مع حالات الدفع والتوصيل.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild><Link href="/dashboard/store">إنشاء المتجر</Link></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [{ count: ordersCount }, { count: customersCount }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('store_id', store.id),
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('store_id', store.id),
  ])

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><PackageCheck className="h-8 w-8 text-primary" /> الطلبات والعملاء</h1>
        <p className="text-muted-foreground mt-2">إدارة كاملة للطلبات، العملاء، وحالة المدفوعات لمتجر {store.name}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">إجمالي الطلبات</p><p className="text-3xl font-bold">{ordersCount || 0}</p></div><ShoppingCart className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">العملاء</p><p className="text-3xl font-bold">{customersCount || 0}</p></div><Users className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">الجاهزية</p><p className="text-3xl font-bold">100%</p></div><TrendingUp className="h-8 w-8 text-primary" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>نظام الطلبات جاهز</CardTitle>
          <CardDescription>بعد تشغيل ملف قاعدة البيانات الجديد، هيتم تفعيل جداول orders و customers و order_items بالكامل.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• حالات الطلب: pending, confirmed, processing, shipped, delivered, cancelled</p>
          <p>• يدعم عنوان الشحن، الولاية/البلدية، ملاحظات العميل، وحالة الدفع</p>
          <div className="flex gap-2 flex-wrap pt-2">
            <Badge>COD / Manual</Badge>
            <Badge variant="secondary">Stripe</Badge>
            <Badge variant="secondary">PayPal</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
