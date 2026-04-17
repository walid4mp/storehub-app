import { Button } from '@/components/ui/button'
import { Store, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function StoreNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
          <Store className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">المتجر غير موجود</h1>
        <p className="text-muted-foreground mb-8">
          عذراً، لم نتمكن من العثور على المتجر المطلوب. قد يكون تم حذفه أو أن الرابط غير صحيح.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          هل تريد إنشاء متجرك الخاص؟
        </p>
        <Link 
          href="/auth/signup" 
          className="text-sm text-primary font-medium hover:underline"
        >
          ابدأ الآن مجاناً
        </Link>
      </div>
    </div>
  )
}
