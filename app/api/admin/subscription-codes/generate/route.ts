import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureAdminAccess } from '@/lib/admin-access'
import { generateRandomSubscriptionCode } from '@/lib/subscription-codes'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const adminUser = await ensureAdminAccess(supabase)
    const body = await request.json()

    const planType = body?.planType as 'standard' | 'pro'
    const durationDays = Number(body?.durationDays || 30)
    const maxRedemptions = Number(body?.maxRedemptions || 1)
    const quantity = Math.min(Math.max(Number(body?.quantity || 1), 1), 100)

    if (!['standard', 'pro'].includes(planType)) {
      return NextResponse.json({ error: 'نوع الخطة غير صالح' }, { status: 400 })
    }

    const generatedCodes: Array<{ code: string; plan_type: 'standard' | 'pro'; duration_days: number; max_redemptions: number; created_by: string }> = []
    const usedCodes = new Set<string>()

    while (generatedCodes.length < quantity) {
      const code = generateRandomSubscriptionCode(12)
      if (usedCodes.has(code)) continue
      usedCodes.add(code)
      generatedCodes.push({
        code,
        plan_type: planType,
        duration_days: durationDays,
        max_redemptions: maxRedemptions,
        created_by: adminUser.id,
      })
    }

    const { data, error } = await supabase
      .from('subscription_codes')
      .insert(generatedCodes)
      .select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      codes: data,
      message: `تم إنشاء ${data.length} كود بنجاح`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
