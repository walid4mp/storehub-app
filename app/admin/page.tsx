import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Store, CreditCard, Ticket } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ count: usersCount }, { count: storesCount }, { count: subscriptionsCount }, { count: codesCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('stores').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('subscription_codes').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">لوحة إدارة StoreHub</h1>
        <p className="text-muted-foreground mt-2">إدارة المستخدمين، القوالب، الاشتراكات، وأكواد التفعيل من مكان واحد.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">المستخدمون</CardTitle></CardHeader><CardContent className="flex items-center justify-between"><p className="text-3xl font-bold">{usersCount || 0}</p><Users className="h-8 w-8 text-primary" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">المتاجر</CardTitle></CardHeader><CardContent className="flex items-center justify-between"><p className="text-3xl font-bold">{storesCount || 0}</p><Store className="h-8 w-8 text-primary" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">الاشتراكات</CardTitle></CardHeader><CardContent className="flex items-center justify-between"><p className="text-3xl font-bold">{subscriptionsCount || 0}</p><CreditCard className="h-8 w-8 text-primary" /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">الأكواد</CardTitle></CardHeader><CardContent className="flex items-center justify-between"><p className="text-3xl font-bold">{codesCount || 0}</p><Ticket className="h-8 w-8 text-primary" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>جاهزية المنصة</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Marketplace Builder</Badge>
          <Badge variant="secondary">Subscription Codes</Badge>
          <Badge variant="secondary">Referral System</Badge>
          <Badge variant="secondary">Chat & Negotiation</Badge>
          <Badge variant="secondary">Templates Management</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
