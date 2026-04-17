'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, TicketPlus } from 'lucide-react'

export function AdminCodeGenerator() {
  const [planType, setPlanType] = useState<'standard' | 'pro'>('standard')
  const [quantity, setQuantity] = useState(20)
  const [durationDays, setDurationDays] = useState(30)
  const [maxRedemptions, setMaxRedemptions] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])

  const generateCodes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/subscription-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, quantity, durationDays, maxRedemptions }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'فشل إنشاء الأكواد')

      setGeneratedCodes(result.codes.map((item: { code: string }) => item.code))
      toast.success(result.message || 'تم إنشاء الأكواد بنجاح')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TicketPlus className="h-5 w-5 text-primary" /> إنشاء أكواد اشتراك</CardTitle>
        <CardDescription>أكواد 12 حرف/رقم مع تحديد الخطة، المدة، وعدد الاستخدامات.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2"><Label>الخطة</Label><select className="h-9 rounded-md border bg-background px-3 text-sm" value={planType} onChange={(e) => setPlanType(e.target.value as 'standard' | 'pro')}><option value="standard">Basic</option><option value="pro">Pro</option></select></div>
          <div className="space-y-2"><Label>الكمية</Label><Input type="number" min={1} max={100} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>المدة بالأيام</Label><Input type="number" min={1} value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} /></div>
          <div className="space-y-2"><Label>عدد الاستخدامات</Label><Input type="number" min={1} value={maxRedemptions} onChange={(e) => setMaxRedemptions(Number(e.target.value))} /></div>
        </div>

        <Button onClick={generateCodes} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <TicketPlus className="h-4 w-4 ml-2" />}
          إنشاء الأكواد
        </Button>

        {generatedCodes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">آخر الأكواد المنشأة</p>
            <div className="flex flex-wrap gap-2">
              {generatedCodes.map((code) => <Badge key={code} variant="secondary">{code}</Badge>)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
