'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { toast } from 'sonner'
import { ShoppingBag, Plus, Edit, Trash2, Loader2, Package, Tag, ImageIcon } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  sale_price: number | null
  category: string | null
  stock: number
  is_active: boolean
  image_url: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [store, setStore] = useState<{ id: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('0')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: storeData } = await supabase
        .from('stores')
        .select('id')
        .eq('user_id', user.id)
        .single()

      setStore(storeData)

      if (storeData) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false })

        setProducts(productsData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setPrice('')
    setSalePrice('')
    setCategory('')
    setStock('0')
    setImageUrl('')
    setEditingProduct(null)
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setName(product.name)
    setDescription(product.description || '')
    setPrice(product.price.toString())
    setSalePrice(product.sale_price?.toString() || '')
    setCategory(product.category || '')
    setStock(product.stock.toString())
    setImageUrl(product.image_url || '')
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim() || !price) {
      toast.error('يرجى إدخال اسم المنتج والسعر')
      return
    }

    if (!store) {
      toast.error('يجب إنشاء متجر أولاً')
      return
    }

    setIsSaving(true)
    try {
      const productData = {
        store_id: store.id,
        name,
        description: description || null,
        price: parseFloat(price),
        sale_price: salePrice ? parseFloat(salePrice) : null,
        category: category || null,
        stock: parseInt(stock) || 0,
        image_url: imageUrl || null,
      }

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id)
        if (error) throw error
        toast.success('تم تحديث المنتج بنجاح')
      } else {
        const { error } = await supabase.from('products').insert(productData)
        if (error) throw error
        toast.success('تم إضافة المنتج بنجاح')
      }

      setIsDialogOpen(false)
      resetForm()
      loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId)
      if (error) throw error
      toast.success('تم حذف المنتج')
      loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      const { error } = await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
      if (error) throw error
      toast.success(product.is_active ? 'تم إخفاء المنتج' : 'تم تفعيل المنتج')
      loadData()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-warning mb-4" />
            <CardTitle>يجب إنشاء متجر أولاً</CardTitle>
            <CardDescription>قم بإنشاء متجرك أولاً ثم أضف منتجاتك</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild><a href="/dashboard/store">إنشاء متجر</a></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            إدارة المنتجات
          </h1>
          <p className="text-muted-foreground">{products.length} منتج في متجرك</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 ml-2" />إضافة منتج</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
              <DialogDescription>{editingProduct ? 'قم بتعديل بيانات المنتج' : 'أضف منتجًا جديدًا إلى متجرك'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="productName">اسم المنتج *</Label>
                <Input id="productName" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: قميص قطني" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDesc">وصف المنتج</Label>
                <Textarea id="productDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف تفصيلي للمنتج..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">السعر *</Label>
                  <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">سعر العرض</Label>
                  <Input id="salePrice" type="number" step="0.01" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="0.00" dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="مثال: ملابس" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">المخزون</Label>
                  <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" dir="ltr" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">رابط الصورة</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" dir="ltr" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                  {editingProduct ? 'تحديث' : 'إضافة'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>لا توجد منتجات بعد</EmptyTitle>
            <EmptyDescription>أضف منتجك الأول لبدء البيع</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />إضافة منتج
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className={`relative overflow-hidden ${!product.is_active ? 'opacity-60' : ''}`}>
              <div className="aspect-square bg-muted relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {product.sale_price && <Badge className="absolute top-2 right-2 bg-destructive">عرض</Badge>}
                {!product.is_active && <Badge variant="secondary" className="absolute top-2 left-2">مخفي</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  {product.sale_price ? (
                    <>
                      <span className="text-lg font-bold text-primary">${product.sale_price}</span>
                      <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">${product.price}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  {product.category && <Badge variant="outline" className="text-xs"><Tag className="h-3 w-3 ml-1" />{product.category}</Badge>}
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" />{product.stock}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(product)}>
                    <Edit className="h-4 w-4 ml-1" />تعديل
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleActive(product)}>
                    {product.is_active ? 'إخفاء' : 'إظهار'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف المنتج</AlertDialogTitle>
                        <AlertDialogDescription>هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">حذف</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
