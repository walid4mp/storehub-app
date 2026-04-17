'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Store, AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-destructive/5">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Store className="h-6 w-6" />
          <span>StoreHub</span>
        </Link>
      </header>

      {/* Error Message */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">حدث خطأ</CardTitle>
              <CardDescription className="text-base">
                عذراً، حدث خطأ أثناء عملية المصادقة. يرجى المحاولة مرة أخرى.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full h-11">
                  <Link href="/auth/login">إعادة تسجيل الدخول</Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-11">
                  <Link href="/">العودة للرئيسية</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
