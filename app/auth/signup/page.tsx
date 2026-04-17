'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Store, Globe, AlertCircle } from 'lucide-react'

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const router = useRouter()
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const t = {
    ar: {
      title: 'إنشاء حساب جديد',
      desc: 'أنشئ حسابك وابدأ ببناء متجرك الإلكتروني',
      fullName: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      signup: 'إنشاء حساب',
      signingUp: 'جاري إنشاء الحساب...',
      hasAccount: 'لديك حساب بالفعل؟',
      login: 'تسجيل الدخول',
      backToHome: 'العودة للرئيسية',
      passwordsNotMatch: 'كلمات المرور غير متطابقة',
    },
    en: {
      title: 'Create New Account',
      desc: 'Create your account and start building your online store',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signup: 'Sign Up',
      signingUp: 'Creating account...',
      hasAccount: 'Already have an account?',
      login: 'Login',
      backToHome: 'Back to Home',
      passwordsNotMatch: 'Passwords do not match',
    },
  }

  const text = t[language]

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError(text.passwordsNotMatch)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      if (data.session) {
        await fetch('/api/subscription/free-trial', {
          method: 'POST',
        })

        router.push('/dashboard')
        return
      }

      router.push('/auth/signup-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Store className="h-6 w-6" />
          <span>StoreHub</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="gap-2">
          <Globe className="h-4 w-4" />
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{text.title}</CardTitle>
              <CardDescription>{text.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{text.fullName}</Label>
                  <Input id="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{text.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{text.password}</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{text.confirmPassword}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11"
                    dir="ltr"
                  />
                </div>
                {!isSupabaseConfigured && (
                  <div className="p-3 rounded-lg bg-warning/10 text-warning text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>لازم تضيف بيانات Supabase في ملف .env.local قبل ما إنشاء الحساب يشتغل.</span>
                  </div>
                )}
                {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
                <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading || !isSupabaseConfigured}>
                  {isLoading ? text.signingUp : text.signup}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {text.hasAccount}{' '}
                  <Link href="/auth/login" className="text-primary font-medium hover:underline">
                    {text.login}
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
          <p className="text-center mt-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              {text.backToHome}
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
