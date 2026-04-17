'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Store,
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Settings,
  LogOut,
  Globe,
  Crown,
  ExternalLink,
  Menu,
  X
} from 'lucide-react'
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
    { href: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم', labelEn: 'Dashboard' },
    { href: '/dashboard/store', icon: Store, label: 'متجري', labelEn: 'My Store' },
    { href: '/dashboard/products', icon: ShoppingBag, label: 'المنتجات', labelEn: 'Products' },
    { href: '/dashboard/subscription', icon: CreditCard, label: 'الاشتراك', labelEn: 'Subscription' },
    { href: '/dashboard/settings', icon: Settings, label: 'الإعدادات', labelEn: 'Settings' },
  ]

  const userInitials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U'

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 right-0 z-40 h-screen w-72 bg-sidebar border-l border-sidebar-border flex flex-col transition-transform duration-300",
        isMobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3 text-primary">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl text-foreground">StoreHub</span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {profile?.full_name || user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {subscription ? (
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Crown className="h-3 w-3" />
                    {subscription.plan_type === 'pro' ? 'Pro' : subscription.plan_type === 'free' ? 'مجاني' : 'Standard'}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    بدون اشتراك
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Store preview link */}
        {store?.is_published && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="truncate">{store.name}</span>
              <ExternalLink className="h-3 w-3 mr-auto" />
            </a>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>
    </>
  )
}
