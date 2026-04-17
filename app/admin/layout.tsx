import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureAdminAccess } from '@/lib/admin-access'
import { LayoutDashboard, Users, CreditCard, LayoutTemplate, Ticket, Shield } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/admin/users', label: 'المستخدمون', icon: Users },
  { href: '/admin/subscriptions', label: 'الاشتراكات', icon: CreditCard },
  { href: '/admin/templates', label: 'القوالب', icon: LayoutTemplate },
  { href: '/admin/codes', label: 'الأكواد', icon: Ticket },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  try {
    await ensureAdminAccess(supabase)
  } catch {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-72 border-l bg-card p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black">WH</div>
          <div>
            <div className="font-bold text-lg">StoreHub</div>
            <div className="text-xs text-muted-foreground">Admin Console</div>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-primary hover:bg-primary/10 transition-colors">
            <Shield className="h-4 w-4" /> الرجوع للوحة التاجر
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
