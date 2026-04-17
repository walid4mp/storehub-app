import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { SUPABASE_SETUP_MESSAGE, getSupabaseEnv } from '@/lib/supabase/env'
import { ensureDefaultFreeSubscription } from '@/lib/subscription-helpers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!getSupabaseEnv().isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-xl rounded-2xl border bg-card p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold mb-3">إعداد Supabase مطلوب</h1>
          <p className="text-muted-foreground">{SUPABASE_SETUP_MESSAGE}</p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  await ensureDefaultFreeSubscription(supabase, user.id)

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

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={user} profile={profile} subscription={subscription} store={store} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
