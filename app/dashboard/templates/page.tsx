import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LayoutTemplate, Crown, CheckCircle2 } from 'lucide-react'
import { getAllowedTemplates, MARKETPLACE_TEMPLATES, PLAN_DETAILS } from '@/lib/platform-config'

export default async function TemplatesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const currentPlan = (subscription?.plan_type || 'free') as 'free' | 'standard' | 'pro'
  const allowedTemplates = getAllowedTemplates(currentPlan)

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><LayoutTemplate className="h-8 w-8 text-primary" /> القوالب</h1>
        <p className="text-muted-foreground mt-2">اختر من مكتبة قوالب StoreHub الحديثة. خطتك الحالية {PLAN_DETAILS[currentPlan].label} وتسمح لك بـ {PLAN_DETAILS[currentPlan].templateLimit} قالب.</p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold">القوالب المتاحة الآن: {allowedTemplates.length}</p>
            <p className="text-sm text-muted-foreground">يمكنك إنشاء متجرك وتبديل القالب من صفحة المتجر في أي وقت.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/store">إدارة المتجر</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {MARKETPLACE_TEMPLATES.map((template) => {
          const allowed = allowedTemplates.some((item) => item.id === template.id)
          return (
            <Card key={template.id} className={allowed ? 'border-primary/20' : 'opacity-75'}>
              <CardHeader>
                <div className="h-28 rounded-xl" style={{ background: `linear-gradient(135deg, ${template.color}, #111827)` }} />
                <div className="flex items-center justify-between gap-2 pt-3">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {allowed ? <Badge>متاح</Badge> : <Badge variant="outline">يتطلب ترقية</Badge>}
                </div>
                <CardDescription>{template.nameEn} • {template.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {template.plans.map((plan) => (
                    <Badge key={plan} variant={plan === currentPlan ? 'default' : 'secondary'}>{PLAN_DETAILS[plan].label}</Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  {allowed ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Crown className="h-4 w-4 text-warning" />}
                  {allowed ? 'هذا القالب متاح داخل خطتك الحالية' : 'رقّ خطتك لفتح هذا القالب'}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
