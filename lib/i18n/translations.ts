export type Language = 'ar' | 'en'

export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    pricing: 'الأسعار',
    templates: 'القوالب',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    
    // Hero
    heroTitle: 'أنشئ متجرك الإلكتروني في دقائق',
    heroSubtitle: 'منصة احترافية لإنشاء المتاجر الإلكترونية مع قوالب جاهزة وأدوات تحكم متقدمة',
    startNow: 'ابدأ الآن مجاناً',
    viewTemplates: 'استعرض القوالب',
    
    // Features
    features: 'المميزات',
    feature1Title: 'قوالب احترافية',
    feature1Desc: '23 قالب متجر جاهز للاستخدام مع تصاميم عصرية',
    feature2Title: 'رابط خاص لمتجرك',
    feature2Desc: 'احصل على رابط فريد لمتجرك لمشاركته مع العملاء',
    feature3Title: 'إدارة سهلة',
    feature3Desc: 'أضف منتجاتك وأسعارك وصورك بسهولة',
    feature4Title: 'دعم متعدد اللغات',
    feature4Desc: 'دعم كامل للعربية والإنجليزية',
    
    // Pricing
    pricingTitle: 'اختر خطتك المناسبة',
    pricingSubtitle: 'أسعار تنافسية مع ميزات رائعة',
    standard: 'العادي',
    pro: 'الاحترافي',
    perMonth: '/شهر',
    currentOffer: 'عرض لمدة شهرين!',
    normalPrice: 'السعر العادي',
    subscribe: 'اشترك الآن',
    contactWhatsapp: 'تواصل عبر واتساب',
    
    // Standard Plan Features
    standardFeature1: '3 قوالب متجر',
    standardFeature2: 'منتجات غير محدودة',
    standardFeature3: 'رابط خاص لمتجرك',
    standardFeature4: 'دعم فني أساسي',
    
    // Pro Plan Features
    proFeature1: '20 قالب متجر احترافي',
    proFeature2: 'منتجات غير محدودة',
    proFeature3: 'رابط خاص لمتجرك',
    proFeature4: 'دعم فني متقدم 24/7',
    proFeature5: 'تخصيص الألوان والتصميم',
    proFeature6: 'تحليلات متقدمة',
    
    // Auth
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    loginTitle: 'تسجيل الدخول',
    loginDesc: 'أدخل بياناتك للوصول إلى حسابك',
    signupTitle: 'إنشاء حساب جديد',
    signupDesc: 'أنشئ حسابك وابدأ ببناء متجرك',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    loggingIn: 'جاري تسجيل الدخول...',
    signingUp: 'جاري إنشاء الحساب...',
    signupSuccess: 'تم إنشاء الحساب بنجاح!',
    signupSuccessDesc: 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني',
    checkEmail: 'تفقد بريدك الإلكتروني',
    passwordsNotMatch: 'كلمات المرور غير متطابقة',
    
    // Dashboard
    myStore: 'متجري',
    myProducts: 'منتجاتي',
    mySubscription: 'اشتراكي',
    settings: 'الإعدادات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل المنتج',
    deleteProduct: 'حذف المنتج',
    storeName: 'اسم المتجر',
    storeDescription: 'وصف المتجر',
    storeLink: 'رابط المتجر',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط!',
    selectTemplate: 'اختر قالب المتجر',
    publishStore: 'نشر المتجر',
    unpublishStore: 'إلغاء نشر المتجر',
    storePublished: 'المتجر منشور',
    storeNotPublished: 'المتجر غير منشور',
    
    // Products
    productName: 'اسم المنتج',
    productDescription: 'وصف المنتج',
    productPrice: 'السعر',
    productSalePrice: 'سعر العرض',
    productCategory: 'التصنيف',
    productStock: 'المخزون',
    productImages: 'صور المنتج',
    noProducts: 'لا توجد منتجات بعد',
    addFirstProduct: 'أضف منتجك الأول',
    
    // Subscription
    subscriptionStatus: 'حالة الاشتراك',
    active: 'نشط',
    pending: 'قيد الانتظار',
    expired: 'منتهي',
    cancelled: 'ملغي',
    expiresOn: 'ينتهي في',
    requestSubscription: 'طلب اشتراك',
    upgradeToProTitle: 'الترقية إلى Pro',
    upgradeToProDesc: 'احصل على 20 قالب متجر ومميزات حصرية',
    
    // Admin
    adminDashboard: 'لوحة تحكم الإدارة',
    allUsers: 'جميع المستخدمين',
    allStores: 'جميع المتاجر',
    subscriptionRequests: 'طلبات الاشتراك',
    approveRequest: 'قبول الطلب',
    rejectRequest: 'رفض الطلب',
    activateSubscription: 'تفعيل الاشتراك',
    cancelSubscription: 'إلغاء الاشتراك',
    banUser: 'حظر المستخدم',
    unbanUser: 'إلغاء الحظر',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    close: 'إغلاق',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'تم بنجاح',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    submit: 'إرسال',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    none: 'لا شيء',
    yes: 'نعم',
    no: 'لا',
    
    // Footer
    footerDesc: 'منصة StoreHub لإنشاء المتاجر الإلكترونية الاحترافية',
    contactUs: 'تواصل معنا',
    whatsappContact: 'تواصل عبر واتساب',
    allRightsReserved: 'جميع الحقوق محفوظة',
  },
  en: {
    // Navigation
    home: 'Home',
    pricing: 'Pricing',
    templates: 'Templates',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    dashboard: 'Dashboard',
    
    // Hero
    heroTitle: 'Create Your Online Store in Minutes',
    heroSubtitle: 'Professional platform for creating online stores with ready-made templates and advanced control tools',
    startNow: 'Start Now for Free',
    viewTemplates: 'View Templates',
    
    // Features
    features: 'Features',
    feature1Title: 'Professional Templates',
    feature1Desc: '23 ready-to-use store templates with modern designs',
    feature2Title: 'Unique Store Link',
    feature2Desc: 'Get a unique link for your store to share with customers',
    feature3Title: 'Easy Management',
    feature3Desc: 'Add your products, prices, and images easily',
    feature4Title: 'Multi-language Support',
    feature4Desc: 'Full support for Arabic and English',
    
    // Pricing
    pricingTitle: 'Choose Your Plan',
    pricingSubtitle: 'Competitive prices with great features',
    standard: 'Standard',
    pro: 'Pro',
    perMonth: '/month',
    currentOffer: '2 months offer!',
    normalPrice: 'Normal price',
    subscribe: 'Subscribe Now',
    contactWhatsapp: 'Contact via WhatsApp',
    
    // Standard Plan Features
    standardFeature1: '3 store templates',
    standardFeature2: 'Unlimited products',
    standardFeature3: 'Unique store link',
    standardFeature4: 'Basic support',
    
    // Pro Plan Features
    proFeature1: '20 professional store templates',
    proFeature2: 'Unlimited products',
    proFeature3: 'Unique store link',
    proFeature4: 'Advanced 24/7 support',
    proFeature5: 'Color and design customization',
    proFeature6: 'Advanced analytics',
    
    // Auth
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone Number',
    loginTitle: 'Login',
    loginDesc: 'Enter your credentials to access your account',
    signupTitle: 'Create New Account',
    signupDesc: 'Create your account and start building your store',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loggingIn: 'Logging in...',
    signingUp: 'Creating account...',
    signupSuccess: 'Account created successfully!',
    signupSuccessDesc: 'A confirmation link has been sent to your email',
    checkEmail: 'Check your email',
    passwordsNotMatch: 'Passwords do not match',
    
    // Dashboard
    myStore: 'My Store',
    myProducts: 'My Products',
    mySubscription: 'My Subscription',
    settings: 'Settings',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    storeName: 'Store Name',
    storeDescription: 'Store Description',
    storeLink: 'Store Link',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied!',
    selectTemplate: 'Select Store Template',
    publishStore: 'Publish Store',
    unpublishStore: 'Unpublish Store',
    storePublished: 'Store is published',
    storeNotPublished: 'Store is not published',
    
    // Products
    productName: 'Product Name',
    productDescription: 'Product Description',
    productPrice: 'Price',
    productSalePrice: 'Sale Price',
    productCategory: 'Category',
    productStock: 'Stock',
    productImages: 'Product Images',
    noProducts: 'No products yet',
    addFirstProduct: 'Add your first product',
    
    // Subscription
    subscriptionStatus: 'Subscription Status',
    active: 'Active',
    pending: 'Pending',
    expired: 'Expired',
    cancelled: 'Cancelled',
    expiresOn: 'Expires on',
    requestSubscription: 'Request Subscription',
    upgradeToProTitle: 'Upgrade to Pro',
    upgradeToProDesc: 'Get 20 store templates and exclusive features',
    
    // Admin
    adminDashboard: 'Admin Dashboard',
    allUsers: 'All Users',
    allStores: 'All Stores',
    subscriptionRequests: 'Subscription Requests',
    approveRequest: 'Approve Request',
    rejectRequest: 'Reject Request',
    activateSubscription: 'Activate Subscription',
    cancelSubscription: 'Cancel Subscription',
    banUser: 'Ban User',
    unbanUser: 'Unban User',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error occurred',
    success: 'Success',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    
    // Footer
    footerDesc: 'StoreHub platform for creating professional online stores',
    contactUs: 'Contact Us',
    whatsappContact: 'Contact via WhatsApp',
    allRightsReserved: 'All rights reserved',
  }
}

export function getTranslation(lang: Language, key: keyof typeof translations.ar): string {
  return translations[lang][key] || key
}
