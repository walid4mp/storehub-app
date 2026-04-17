'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Store, Globe, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const router = useRouter()
  const isSupabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const t = {
    ar: {
      title: 'تسجيل الدخول',
      desc: 'أدخل بياناتك للوصول إلى حسابك',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      loggingIn: 'جاري تسجيل الدخول...',
      noAccount: 'ليس لديك حساب؟',
      signup: 'إنشاء حساب',
      backToHome: 'العودة للرئيسية',
    },
    en: {
      title: 'Login',
      desc: 'Enter your credentials to access your account',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      loggingIn: 'Logging in...',
      noAccount: "Don't have an account?",
      signup: 'Sign up',
      backToHome: 'Back to Home',
    }
  }

  const text = t[language]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Store className="h-6 w-6" />
          <span>StoreHub</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === 'ar' ? 'EN' : 'عربي'}
        </Button>
      </header>

      {/* Login Form */}
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
              <form onSubmit={handleLogin} className="space-y-4">
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
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    dir="ltr"
                  />
                </div>
                {!isSupabaseConfigured && (
                  <div className="p-3 rounded-lg bg-warning/10 text-warning text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>لازم تضيف بيانات Supabase في ملف .env.local قبل ما تسجيل الدخول يشتغل.</span>
                  </div>
                )}
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-medium" 
                  disabled={isLoading || !isSupabaseConfigured}
                >
                  {isLoading ? text.loggingIn : text.login}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  {text.noAccount}{' '}
                  <Link
                    href="/auth/signup"
                    className="text-primary font-medium hover:underline"
                  >
                    {text.signup}
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
