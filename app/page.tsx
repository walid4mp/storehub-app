'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Store, 
  Globe, 
  Palette, 
  Link2, 
  Settings, 
  Languages, 
  Check, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Crown,
  MessageCircle,
  ShoppingBag,
  Zap,
  Shield,
  CreditCard
} from 'lucide-react'

const WHATSAPP_NUMBER = '+213779109990'

export default function HomePage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')
  const isRTL = language === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const t = {
    ar: {
      // Navigation
      home: 'الرئيسية',
      pricing: 'الأسعار',
      templates: 'القوالب',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      
      // Hero
      heroTitle: 'أنشئ متجرك الإلكتروني الاحترافي في دقائق',
      heroSubtitle: 'منصة متكاملة لإنشاء المتاجر الإلكترونية مع 23 قالب جاهز، روابط مشاركة فريدة، وأدوات تحكم سهلة',
      startNow: 'ابدأ الآن مجاناً',
      viewPricing: 'استعرض الأسعار',
      
      // Stats
      templatesCount: '23+',
      templatesLabel: 'قالب متجر',
      usersCount: '500+',
      usersLabel: 'متجر نشط',
      supportLabel: 'دعم على مدار الساعة',
      
      // Features
      featuresTitle: 'كل ما تحتاجه لبناء متجرك',
      featuresSubtitle: 'مميزات قوية تساعدك على إطلاق متجرك الإلكتروني بسرعة واحترافية',
      
      feature1Title: 'قوالب احترافية',
      feature1Desc: '23 قالب متجر جاهز للاستخدام بتصاميم عصرية وجذابة للأزياء والإلكترونيات وأكثر',
      
      feature2Title: 'رابط فريد لمتجرك',
      feature2Desc: 'احصل على رابط خاص بمتجرك يمكنك مشاركته مع عملائك على أي منصة',
      
      feature3Title: 'إدارة سهلة',
      feature3Desc: 'أضف منتجاتك وصورك وأسعارك بسهولة من لوحة تحكم بسيطة وسريعة',
      
      feature4Title: 'دعم العربية والإنجليزية',
      feature4Desc: 'واجهة متعددة اللغات مع دعم كامل للعربية من اليمين لليسار',
      
      feature5Title: 'تخصيص الألوان',
      feature5Desc: 'غيّر ألوان متجرك لتتناسب مع هويتك التجارية بسهولة',
      
      feature6Title: 'حماية وأمان',
      feature6Desc: 'بيانات متجرك وعملائك محمية بأحدث تقنيات الأمان',
      
      // Pricing
      pricingTitle: 'خطط الأسعار',
      pricingSubtitle: 'اختر الخطة المناسبة لاحتياجاتك وابدأ ببناء متجرك اليوم',
      
      standard: 'العادي',
      pro: 'الاحترافي',
      perMonth: '/شهر',
      mostPopular: 'الأكثر شعبية',
      limitedOffer: 'عرض لمدة شهرين!',
      normalPrice: 'السعر العادي',
      
      standardFeature1: '3 قوالب متجر',
      standardFeature2: 'منتجات غير محدودة',
      standardFeature3: 'رابط فريد لمتجرك',
      standardFeature4: 'دعم فني أساسي',
      
      proFeature1: '20 قالب متجر احترافي',
      proFeature2: 'منتجات غير محدودة',
      proFeature3: 'رابط فريد لمتجرك',
      proFeature4: 'دعم فني متقدم 24/7',
      proFeature5: 'تخصيص الألوان والتصميم',
      proFeature6: 'تحليلات متقدمة',
      
      subscribe: 'اشترك الآن',
      contactWhatsapp: 'تواصل عبر واتساب',
      
      // CTA
      ctaTitle: 'جاهز لإطلاق متجرك؟',
      ctaSubtitle: 'انضم إلى مئات التجار الذين يستخدمون منصتنا لبناء متاجرهم الإلكترونية',
      
      // Footer
      footerDesc: 'منصة StoreHub لإنشاء المتاجر الإلكترونية الاحترافية',
      contactUs: 'تواصل معنا',
      quickLinks: 'روابط سريعة',
      allRightsReserved: 'جميع الحقوق محفوظة',
    },
    en: {
      // Navigation
      home: 'Home',
      pricing: 'Pricing',
      templates: 'Templates',
      login: 'Login',
      signup: 'Sign Up',
      
      // Hero
      heroTitle: 'Create Your Professional Online Store in Minutes',
      heroSubtitle: 'Complete platform for creating online stores with 23 ready templates, unique sharing links, and easy control tools',
      startNow: 'Start Now for Free',
      viewPricing: 'View Pricing',
      
      // Stats
      templatesCount: '23+',
      templatesLabel: 'Store Templates',
      usersCount: '500+',
      usersLabel: 'Active Stores',
      supportLabel: '24/7 Support',
      
      // Features
      featuresTitle: 'Everything You Need to Build Your Store',
      featuresSubtitle: 'Powerful features to help you launch your online store quickly and professionally',
      
      feature1Title: 'Professional Templates',
      feature1Desc: '23 ready-to-use store templates with modern and attractive designs for fashion, electronics, and more',
      
      feature2Title: 'Unique Store Link',
      feature2Desc: 'Get a unique link for your store that you can share with customers on any platform',
      
      feature3Title: 'Easy Management',
      feature3Desc: 'Add your products, images, and prices easily from a simple and fast dashboard',
      
      feature4Title: 'Arabic & English Support',
      feature4Desc: 'Multi-language interface with full Arabic RTL support',
      
      feature5Title: 'Color Customization',
      feature5Desc: 'Change your store colors to match your brand identity easily',
      
      feature6Title: 'Security & Protection',
      feature6Desc: 'Your store and customer data is protected with the latest security technologies',
      
      // Pricing
      pricingTitle: 'Pricing Plans',
      pricingSubtitle: 'Choose the plan that fits your needs and start building your store today',
      
      standard: 'Standard',
      pro: 'Pro',
      perMonth: '/month',
      mostPopular: 'Most Popular',
      limitedOffer: '2 months offer!',
      normalPrice: 'Normal price',
      
      standardFeature1: '3 store templates',
      standardFeature2: 'Unlimited products',
      standardFeature3: 'Unique store link',
      standardFeature4: 'Basic support',
      
      proFeature1: '20 professional templates',
      proFeature2: 'Unlimited products',
      proFeature3: 'Unique store link',
      proFeature4: 'Advanced 24/7 support',
      proFeature5: 'Color & design customization',
      proFeature6: 'Advanced analytics',
      
      subscribe: 'Subscribe Now',
      contactWhatsapp: 'Contact via WhatsApp',
      
      // CTA
      ctaTitle: 'Ready to Launch Your Store?',
      ctaSubtitle: 'Join hundreds of merchants using our platform to build their online stores',
      
      // Footer
      footerDesc: 'StoreHub platform for creating professional online stores',
      contactUs: 'Contact Us',
      quickLinks: 'Quick Links',
      allRightsReserved: 'All rights reserved',
    }
  }

  const text = t[language]

  const features = [
    { icon: Palette, title: text.feature1Title, desc: text.feature1Desc },
    { icon: Link2, title: text.feature2Title, desc: text.feature2Desc },
    { icon: Settings, title: text.feature3Title, desc: text.feature3Desc },
    { icon: Languages, title: text.feature4Title, desc: text.feature4Desc },
    { icon: Sparkles, title: text.feature5Title, desc: text.feature5Desc },
    { icon: Shield, title: text.feature6Title, desc: text.feature6Desc },
  ]

  const standardFeatures = [
    text.standardFeature1,
    text.standardFeature2,
    text.standardFeature3,
    text.standardFeature4,
  ]

  const proFeatures = [
    text.proFeature1,
    text.proFeature2,
    text.proFeature3,
    text.proFeature4,
    text.proFeature5,
    text.proFeature6,
  ]

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Store className="h-6 w-6" />
              <span>StoreHub</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                {text.templates}
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                {text.pricing}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                {language === 'ar' ? 'EN' : 'عربي'}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">{text.login}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">{text.signup}</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Zap className="h-4 w-4 ml-2" />
              {language === 'ar' ? 'منصة إنشاء المتاجر #1' : '#1 Store Building Platform'}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              {text.heroTitle}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              {text.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 px-8 text-base gap-2" asChild>
                <Link href="/auth/signup">
                  {text.startNow}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="#pricing">{text.viewPricing}</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{text.templatesCount}</div>
                <div className="text-sm text-muted-foreground mt-1">{text.templatesLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{text.usersCount}</div>
                <div className="text-sm text-muted-foreground mt-1">{text.usersLabel}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground mt-1">{text.supportLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{text.featuresTitle}</h2>
            <p className="text-muted-foreground text-lg">{text.featuresSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{text.pricingTitle}</h2>
            <p className="text-muted-foreground text-lg">{text.pricingSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <Card className="border-2 border-border shadow-lg">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{text.standard}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$5</span>
                  <span className="text-muted-foreground">{text.perMonth}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {standardFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-12" variant="outline" asChild>
                  <Link href="/auth/signup">
                    <CreditCard className="h-4 w-4 ml-2" />
                    {text.subscribe}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-primary shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                <Crown className="h-4 w-4 inline-block ml-2" />
                {text.mostPopular}
              </div>
              <CardHeader className="text-center pb-8 pt-12">
                <Badge variant="secondary" className="mx-auto mb-4">
                  {text.limitedOffer}
                </Badge>
                <CardTitle className="text-2xl font-bold">{text.pro}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-primary">$8</span>
                  <span className="text-muted-foreground">{text.perMonth}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {text.normalPrice}: <span className="line-through">$10</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full h-12" asChild>
                  <Link href="/auth/signup">
                    <CreditCard className="h-4 w-4 ml-2" />
                    {text.subscribe}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <ShoppingBag className="h-12 w-12 mx-auto opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold">{text.ctaTitle}</h2>
            <p className="text-lg opacity-90">{text.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base gap-2" asChild>
                <Link href="/auth/signup">
                  {text.startNow}
                  <Arrow className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  {text.contactWhatsapp}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl mb-4">
                <Store className="h-6 w-6" />
                <span>StoreHub</span>
              </Link>
              <p className="text-muted-foreground">{text.footerDesc}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{text.quickLinks}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">{text.templates}</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">{text.pricing}</Link></li>
                <li><Link href="/auth/login" className="hover:text-foreground transition-colors">{text.login}</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{text.contactUs}</h3>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <MessageCircle className="h-5 w-5" />
                {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} StoreHub. {text.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
