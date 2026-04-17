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
import { Store, Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Store className="h-6 w-6" />
          <span>StoreHub</span>
        </Link>
      </header>

      {/* Success Message */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold">تم إنشاء الحساب بنجاح!</CardTitle>
              <CardDescription className="text-base">
                تم إرسال رابط التأكيد إلى بريدك الإلكتروني
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50 flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد لتفعيل حسابك
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full h-11">
                  <Link href="/auth/login">تسجيل الدخول</Link>
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
