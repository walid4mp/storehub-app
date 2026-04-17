import type { Metadata } from 'next'
import { Geist, Geist_Mono, Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const _tajawal = Tajawal({ 
  subsets: ['arabic', 'latin'], 
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal'
})

export const metadata: Metadata = {
  title: 'StoreHub - منصة إنشاء المتاجر الإلكترونية',
  description: 'أنشئ متجرك الإلكتروني الاحترافي في دقائق مع قوالب جاهزة ومميزات متقدمة',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-background">
      <body className={`${_geist.variable} ${_geistMono.variable} ${_tajawal.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors dir="rtl" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
