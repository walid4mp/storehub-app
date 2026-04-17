import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gift, Link2, Rocket, TimerReset } from 'lucide-react'

export default async function ReferralPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('id, referral_code, full_name').eq('id', user.id).maybeSingle()
  const { count: referralsCount } = await supabase.from('referrals').select('*', { count: 'exact', head: true }).eq('inviter_user_id', user.id)
  const { data: latestReward } = await supabase.from('referral_rewards').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle()

  const referralLink = profile?.referral_code ? `https://storehub.app/signup?ref=${profile.referral_code}` : 'سيُنشأ بعد تفعيل ميزة الإحالة على قاعدة البيانات'

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><Gift className="h-8 w-8 text-primary" /> برنامج الإحالة</h1>
        <p className="text-muted-foreground mt-2">كل مستخدم له رابط إحالة خاص. عند دعوة 50 شخص تحصل على Pro مجاني 10 أيام، مرة كل 3 أشهر.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">عدد الإحالات</p><p className="text-3xl font-bold mt-2">{referralsCount || 0}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">المطلوب للمكافأة</p><p className="text-3xl font-bold mt-2">50</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">المكافأة</p><p className="text-3xl font-bold mt-2">10 أيام Pro</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" /> رابط الإحالة</CardTitle>
          <CardDescription>انسخ الرابط وشاركه مع أصدقائك.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-muted/30 p-4 text-sm break-all">{referralLink}</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> كيف تعمل</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1) لكل مستخدم كود إحالة خاص.</p>
            <p>2) كل تسجيل جديد عبر الرابط يُسجل في جدول referrals.</p>
            <p>3) عند الوصول لـ 50 إحالة مؤهلة، يتم إضافة مكافأة Pro لمدة 10 أيام.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TimerReset className="h-5 w-5 text-primary" /> آخر مكافأة</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {latestReward ? (
              <>
                <Badge>تم صرف مكافأة</Badge>
                <p>تنتهي فترة التبريد: {latestReward.cooldown_ends_at ? new Date(latestReward.cooldown_ends_at).toLocaleDateString('ar-SA') : 'غير محدد'}</p>
              </>
            ) : (
              <p>لا توجد مكافآت مصروفة حتى الآن.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
