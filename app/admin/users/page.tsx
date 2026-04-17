import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase.from('profiles').select('id, full_name, phone, is_admin, is_blocked, created_at').order('created_at', { ascending: false }).limit(20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        <p className="text-muted-foreground mt-2">آخر المستخدمين المسجلين مع حالة الإدارة والحظر وأرقام واتساب.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>آخر 20 مستخدم</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(users || []).map((user) => (
            <div key={user.id} className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="font-medium">{user.full_name || 'بدون اسم'}</p>
                <p className="text-sm text-muted-foreground">{user.phone || 'لا يوجد رقم هاتف'} • {new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {user.is_admin && <Badge>Admin</Badge>}
                {user.is_blocked ? <Badge variant="destructive">محظور</Badge> : <Badge variant="secondary">نشط</Badge>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
