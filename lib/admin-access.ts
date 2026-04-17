import 'server-only'

export async function ensureAdminAccess(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('يجب تسجيل الدخول أولاً')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!profile?.is_admin && user.user_metadata?.is_admin !== true) {
    throw new Error('غير مصرح لك بتنفيذ هذا الإجراء')
  }

  return user
}
