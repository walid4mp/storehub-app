import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminCodeGenerator } from '@/components/admin/code-generator'

export default async function AdminCodesPage() {
  const supabase = await createClient()
  const { data: codes } = await supabase.from('subscription_codes').select('code, plan_type, duration_days, max_redemptions, current_redemptions, is_active, created_at').order('created_at', { ascending: false }).limit(30)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">أكواد الاشتراك</h1>
        <p className="text-muted-foreground mt-2">إنشاء وإدارة أكواد 12 حرف/رقم مع عدد استخدامات ومدة مختلفة.</p>
      </div>

      <AdminCodeGenerator />

      <Card>
        <CardHeader><CardTitle>آخر 30 كود</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(codes || []).map((code) => (
            <div key={`${code.code}-${code.created_at}`} className="rounded-xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <p className="font-mono text-base font-semibold">{code.code}</p>
                <p className="text-sm text-muted-foreground">{code.plan_type === 'standard' ? 'Basic' : 'Pro'} • {code.duration_days} يوم</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge>{code.is_active ? 'نشط' : 'متوقف'}</Badge>
                <Badge variant="secondary">{code.current_redemptions}/{code.max_redemptions}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
