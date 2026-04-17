-- Support free trial subscriptions and subscription codes
ALTER TABLE public.subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_plan_type_check
  CHECK (plan_type IN ('free', 'standard', 'pro'));

ALTER TABLE public.subscription_requests
  ADD COLUMN IF NOT EXISTS subscription_code TEXT;
