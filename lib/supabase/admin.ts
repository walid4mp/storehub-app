import { createClient } from '@supabase/supabase-js'
import { getSupabaseEnv } from '@/lib/supabase/env'

export function createAdminClient() {
  const { url, serviceRoleKey, isConfigured } = getSupabaseEnv()

  if (!isConfigured || !serviceRoleKey) {
    throw new Error('يلزم ضبط SUPABASE_SERVICE_ROLE_KEY لتشغيل Webhook الخاص بـ Stripe.')
  }

  return createClient(url!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
