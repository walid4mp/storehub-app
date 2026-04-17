'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LayoutDashboard, ShoppingBag, CreditCard, Settings, LogOut, Globe, Crown, ExternalLink, Menu, X, Store, LayoutTemplate, PackageCheck, MessagesSquare, Gift, Shield } from 'lucide-react'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface SidebarProps {
  user: User
  profile: { full_name: string | null; is_admin: boolean } | null
  subscription: { plan_type: string; status: string } | null
  store: { slug: string; name: string; is_published: boolean } | null
}

export function DashboardSidebar({ user, profile, subscription, store }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
    { href: '/dashboard/store', icon: Store, label: 'المتجر' },
    { href: '/dashboard/templates', icon: LayoutTemplate, label: 'القوالب' },
    { href: '/dashboard/products', icon: ShoppingBag, label: 'المنتجات' },
    { href: '/dashboard/orders', icon: PackageCheck, label: 'الطلبات' },
    { href: '/dashboard/chat', icon: MessagesSquare, label: 'الدردشة' },
    { href: '/dashboard/referral', icon: Gift, label: 'الإحالة' },
    { href: '/dashboard/subscription', icon: CreditCard, label: 'الاشتراك' },
    { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات' },
  ]

  const userInitials = profile?.full_name ? profile.full_name.split(' ').map((name) => name[0]).join('').toUpperCase() : user.email?.[0].toUpperCase() || 'U'
  const planLabel = subscription?.plan_type === 'pro' ? 'Pro' : subscription?.plan_type === 'standard' ? 'Basic' : subscription?.plan_type === 'free' ? 'Free' : 'بدون خطة'

  return (
    <>
      <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 md:hidden" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />}

      <aside className={cn('fixed md:sticky top-0 right-0 z-40 h-screen w-72 bg-sidebar border-l border-sidebar-border flex flex-col transition-transform duration-300', isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0')}>
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black">WH</div>
            <div>
              <span className="font-bold text-xl text-foreground block">StoreHub</span>
              <span className="text-xs text-muted-foreground">Marketplace Builder</span>
            </div>
          </Link>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{profile?.full_name || user.email}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="secondary" className="text-xs gap-1">
                  <Crown className="h-3 w-3" />
                  {planLabel}
                </Badge>
                {profile?.is_admin && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {store?.is_published && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <a href={`/store/${store.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Globe className="h-4 w-4" />
              <span className="truncate">{store.name}</span>
              <ExternalLink className="h-3 w-3 mr-auto" />
            </a>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsMobileOpen(false)} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground')}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}

          {profile?.is_admin && (
            <Link href="/admin" onClick={() => setIsMobileOpen(false)} className={cn('flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors', pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary')}>
              <Shield className="h-5 w-5" />
              لوحة الإدارة
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>
    </>
  )
}
