import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseEnv } from '@/lib/supabase/env'

export function createClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv()

  if (!isConfigured) {
    throw new Error('Supabase environment variables are missing. Please configure .env.local first.')
  }

  return createBrowserClient(url!, anonKey!)
}
