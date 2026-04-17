import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient()
  const { data: subscriptions } = await supabase.from('subscriptions').select('id, user_id, plan_type, status, price, end_date, stripe_status, created_at').order('created_at', { ascending: false }).limit(30)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إدارة الاشتراكات</h1>
        <p className="text-muted-foreground mt-2">متابعة الخطط المجانية، Basic، وPro مع حالة الدفع والتجديد.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>آخر 30 اشتراك</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {(subscriptions || []).map((subscription) => (
            <div key={subscription.id} className="rounded-xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <p className="font-medium">{subscription.plan_type === 'standard' ? 'Basic' : subscription.plan_type === 'pro' ? 'Pro' : 'Free'}</p>
                <p className="text-sm text-muted-foreground">المستخدم: {subscription.user_id} • السعر: ${subscription.price}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{subscription.status}</Badge>
                {subscription.stripe_status && <Badge variant="secondary">{subscription.stripe_status}</Badge>}
                {subscription.end_date && <Badge variant="outline">حتى {new Date(subscription.end_date).toLocaleDateString('ar-SA')}</Badge>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
