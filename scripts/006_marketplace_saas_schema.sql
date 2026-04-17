-- Comprehensive Marketplace Builder schema additions for StoreHub

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'ar',
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE public.stores
  ADD COLUMN IF NOT EXISTS domain TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS support_email TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS state_region TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS default_currency TEXT DEFAULT 'USD';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'physical' CHECK (product_type IN ('physical', 'digital_pdf', 'digital_design')),
  ADD COLUMN IF NOT EXISTS digital_file_url TEXT,
  ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS purchases_count INTEGER DEFAULT 0;

ALTER TABLE public.subscription_code_redemptions
  ADD COLUMN IF NOT EXISTS duration_days INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS subscription_code_id UUID;

ALTER TABLE public.subscription_code_redemptions
  DROP CONSTRAINT IF EXISTS subscription_code_redemptions_code_key;

CREATE TABLE IF NOT EXISTS public.subscription_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('standard', 'pro')),
  duration_days INTEGER NOT NULL DEFAULT 30,
  max_redemptions INTEGER NOT NULL DEFAULT 1,
  current_redemptions INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.store_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  preview_image_url TEXT,
  supported_plans TEXT[] NOT NULL DEFAULT ARRAY['free','standard','pro'],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  city TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  currency TEXT NOT NULL DEFAULT 'USD',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  shipping_address TEXT,
  city TEXT,
  region TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'negotiating', 'closed')),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('merchant', 'customer', 'system')),
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'offer', 'system')),
  body TEXT,
  offer_amount DECIMAL(10,2),
  offer_status TEXT CHECK (offer_status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'qualified', 'rewarded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rewarded_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL DEFAULT 'pro_trial',
  duration_days INTEGER NOT NULL DEFAULT 10,
  referrals_required INTEGER NOT NULL DEFAULT 50,
  cooldown_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscription_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.increment_subscription_code_redemptions(p_code_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.subscription_codes
  SET current_redemptions = current_redemptions + 1
  WHERE id = p_code_id
    AND is_active = TRUE
    AND current_redemptions < max_redemptions;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'subscription_codes' AND policyname = 'Admins can manage subscription codes') THEN
    CREATE POLICY "Admins can manage subscription codes" ON public.subscription_codes FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'store_templates' AND policyname = 'Public can read active store templates') THEN
    CREATE POLICY "Public can read active store templates" ON public.store_templates FOR SELECT USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'store_templates' AND policyname = 'Admins can manage store templates') THEN
    CREATE POLICY "Admins can manage store templates" ON public.store_templates FOR ALL USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'customers' AND policyname = 'Store owners manage customers') THEN
    CREATE POLICY "Store owners manage customers" ON public.customers FOR ALL USING (
      EXISTS (SELECT 1 FROM public.stores WHERE stores.id = customers.store_id AND stores.user_id = auth.uid())
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'Store owners manage orders') THEN
    CREATE POLICY "Store owners manage orders" ON public.orders FOR ALL USING (
      EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid())
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'Store owners manage order items') THEN
    CREATE POLICY "Store owners manage order items" ON public.order_items FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.orders
        JOIN public.stores ON stores.id = orders.store_id
        WHERE orders.id = order_items.order_id AND stores.user_id = auth.uid()
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversations' AND policyname = 'Store owners manage conversations') THEN
    CREATE POLICY "Store owners manage conversations" ON public.conversations FOR ALL USING (
      EXISTS (SELECT 1 FROM public.stores WHERE stores.id = conversations.store_id AND stores.user_id = auth.uid())
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'messages' AND policyname = 'Store owners manage messages') THEN
    CREATE POLICY "Store owners manage messages" ON public.messages FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.conversations
        JOIN public.stores ON stores.id = conversations.store_id
        WHERE conversations.id = messages.conversation_id AND stores.user_id = auth.uid()
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'referrals' AND policyname = 'Users view their referrals') THEN
    CREATE POLICY "Users view their referrals" ON public.referrals FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND (profiles.id = referrals.inviter_user_id OR profiles.id = referrals.invited_user_id)
      )
    );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'referral_rewards' AND policyname = 'Users view their referral rewards') THEN
    CREATE POLICY "Users view their referral rewards" ON public.referral_rewards FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'notifications' AND policyname = 'Users manage their notifications') THEN
    CREATE POLICY "Users manage their notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
