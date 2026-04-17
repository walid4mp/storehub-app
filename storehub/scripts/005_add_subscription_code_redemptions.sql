-- Track one-time subscription code usage
CREATE TABLE IF NOT EXISTS public.subscription_code_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('standard', 'pro')),
  duration_days INTEGER NOT NULL DEFAULT 30,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscription_code_redemptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscription_code_redemptions'
      AND policyname = 'Users can view their own subscription code redemptions'
  ) THEN
    CREATE POLICY "Users can view their own subscription code redemptions"
      ON public.subscription_code_redemptions
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscription_code_redemptions'
      AND policyname = 'Users can insert their own subscription code redemptions'
  ) THEN
    CREATE POLICY "Users can insert their own subscription code redemptions"
      ON public.subscription_code_redemptions
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscription_code_redemptions'
      AND policyname = 'Admins can manage all subscription code redemptions'
  ) THEN
    CREATE POLICY "Admins can manage all subscription code redemptions"
      ON public.subscription_code_redemptions
      FOR ALL
      USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
      );
  END IF;
END $$;
