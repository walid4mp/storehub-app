import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SUPABASE_SETUP_MESSAGE, getSupabaseEnv } from '@/lib/supabase/env'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Store, 
  ShoppingBag, 
  MessageCircle, 
  Tag,
  Package,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface StoreData {
  id: string
  slug: string
  name: string
  description: string | null
  logo_url: string | null
  template_id: string
  primary_color: string
  secondary_color: string
  language: string
  currency: string
  is_published: boolean
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  sale_price: number | null
  image_url: string | null
  category: string | null
  stock: number
  is_active: boolean
}

const WHATSAPP_NUMBER = '+213779109990'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params

  if (!getSupabaseEnv().isConfigured) {
    return {
      title: 'StoreHub',
      description: SUPABASE_SETUP_MESSAGE,
    }
  }

  const supabase = await createClient()
  
  const { data: store } = await supabase
    .from('stores')
    .select('name, description')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!store) {
    return {
      title: 'متجر غير موجود',
    }
  }

  return {
    title: `${store.name} | StoreHub`,
    description: store.description || `تسوق من ${store.name}`,
  }
}

export default async function PublicStorePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params

  if (!getSupabaseEnv().isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background text-center">
        <div className="max-w-xl rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-3">إعداد Supabase مطلوب</h1>
          <p className="text-muted-foreground">{SUPABASE_SETUP_MESSAGE}</p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()

  // Get store data
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single() as { data: StoreData | null }

  if (!store) {
    notFound()
  }

  // Get products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false }) as { data: Product[] | null }

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`
  const isRTL = store.language === 'ar'

  // Get unique categories
  const categories = [...new Set(products?.filter(p => p.category).map(p => p.category))]

  return (
    <div 
      className="min-h-screen bg-background"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ '--store-primary': store.primary_color } as React.CSSProperties}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ borderColor: `${store.primary_color}20` }}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {store.logo_url ? (
                <img 
                  src={store.logo_url} 
                  alt={store.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${store.primary_color}15` }}
                >
                  <Store className="h-5 w-5" style={{ color: store.primary_color }} />
                </div>
              )}
              <span className="font-bold text-xl">{store.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                style={{ borderColor: store.primary_color, color: store.primary_color }}
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-12 md:py-20"
        style={{ background: `linear-gradient(135deg, ${store.primary_color}10 0%, transparent 50%)` }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{store.name}</h1>
          {store.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {store.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="gap-1">
              <ShoppingBag className="h-3 w-3" />
              {products?.length || 0} {isRTL ? 'منتج' : 'products'}
            </Badge>
            {categories.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Tag className="h-3 w-3" />
                {categories.length} {isRTL ? 'تصنيف' : 'categories'}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!products || products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {isRTL ? 'لا توجد منتجات بعد' : 'No products yet'}
              </h2>
              <p className="text-muted-foreground">
                {isRTL ? 'سيتم إضافة المنتجات قريباً' : 'Products will be added soon'}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-8">
                {isRTL ? 'منتجاتنا' : 'Our Products'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {product.sale_price && (
                        <Badge 
                          className="absolute top-2 right-2"
                          style={{ backgroundColor: store.primary_color }}
                        >
                          {isRTL ? 'عرض' : 'Sale'}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                      {product.category && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.category}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mb-3">
                        {product.sale_price ? (
                          <>
                            <span 
                              className="text-lg font-bold"
                              style={{ color: store.primary_color }}
                            >
                              {store.currency === 'USD' ? '$' : ''}{product.sale_price}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {store.currency === 'USD' ? '$' : ''}{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold">
                            {store.currency === 'USD' ? '$' : ''}{product.price}
                          </span>
                        )}
                      </div>
                      <Button 
                        className="w-full"
                        style={{ backgroundColor: store.primary_color }}
                        asChild
                      >
                        <a 
                          href={`${whatsappLink}?text=${encodeURIComponent(
                            isRTL 
                              ? `مرحباً، أريد طلب: ${product.name} - السعر: $${product.sale_price || product.price}`
                              : `Hi, I want to order: ${product.name} - Price: $${product.sale_price || product.price}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4 ml-2" />
                          {isRTL ? 'اطلب الآن' : 'Order Now'}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5" style={{ color: store.primary_color }} />
              <span className="font-semibold">{store.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {WHATSAPP_NUMBER}
                </a>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {isRTL ? 'مدعوم من' : 'Powered by'}
              <Link href="/" className="font-medium hover:underline" style={{ color: store.primary_color }}>
                StoreHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
