import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MARKETPLACE_TEMPLATES, PLAN_DETAILS } from '@/lib/platform-config'

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إدارة القوالب</h1>
        <p className="text-muted-foreground mt-2">20 قالب احترافي جاهزين للتوسعة، مع توزيع حسب الخطط.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MARKETPLACE_TEMPLATES.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="h-24 rounded-xl" style={{ background: `linear-gradient(135deg, ${template.color}, #0f172a)` }} />
              <CardTitle className="text-lg pt-3">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{template.nameEn} • {template.category}</p>
              <div className="flex flex-wrap gap-2">
                {template.plans.map((plan) => <Badge key={plan} variant="secondary">{PLAN_DETAILS[plan].label}</Badge>)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
