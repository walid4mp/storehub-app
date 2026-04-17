import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessagesSquare, HandCoins, MessageCircleMore } from 'lucide-react'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: store } = await supabase.from('stores').select('id, name').eq('user_id', user.id).maybeSingle()
  const { count: conversationsCount } = store ? await supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('store_id', store.id) : { count: 0 }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><MessagesSquare className="h-8 w-8 text-primary" /> الدردشة والتفاوض</h1>
        <p className="text-muted-foreground mt-2">نظام تفاوض داخل التطبيق لإرسال عروض الأسعار، قبولها أو رفضها، ومتابعة الحوار مع العملاء.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">المحادثات</p><p className="text-3xl font-bold mt-2">{conversationsCount || 0}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">عروض السعر</p><p className="text-3xl font-bold mt-2">0</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">الحالة</p><p className="text-3xl font-bold mt-2">جاهز</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آلية التفاوض</CardTitle>
          <CardDescription>تم تجهيز بنية conversations و messages لدعم الرسائل والعروض السعرية.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4"><MessageCircleMore className="h-5 w-5 text-primary mb-3" /><h3 className="font-semibold mb-2">رسائل فورية</h3><p className="text-sm text-muted-foreground">دردشة مباشرة بين التاجر والعميل داخل التطبيق.</p></div>
          <div className="rounded-xl border p-4"><HandCoins className="h-5 w-5 text-primary mb-3" /><h3 className="font-semibold mb-2">عرض سعر</h3><p className="text-sm text-muted-foreground">إرسال Offer وقبوله أو رفضه مع حالة واضحة.</p></div>
          <div className="rounded-xl border p-4"><Badge>Realtime Ready</Badge><h3 className="font-semibold my-2">قابل للربط بـ Supabase Realtime</h3><p className="text-sm text-muted-foreground">لو حبيت، نقدر في المرحلة الجاية نربطه بتحديث فوري كامل.</p></div>
        </CardContent>
      </Card>
    </div>
  )
}
