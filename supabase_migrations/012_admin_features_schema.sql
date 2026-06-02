-- 012_admin_features_schema.sql

-- 1. Pricing Plans Table
CREATE TABLE public.pricing_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id text UNIQUE NOT NULL, -- e.g., 'creator_pro', 'viral_scale'
  name text NOT NULL,
  description text,
  price_inr_monthly integer NOT NULL,
  price_usd_monthly integer NOT NULL,
  price_inr_annual integer NOT NULL,
  price_usd_annual integer NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default pricing data
INSERT INTO public.pricing_plans (plan_id, name, description, price_inr_monthly, price_usd_monthly, price_inr_annual, price_usd_annual, features, is_popular, display_order)
VALUES 
('free', 'Free Plan', 'Perfect to test automated chat flows.', 0, 0, 0, 0, '["1 Instagram Account", "1 Personal Workspace", "25,000 AI Credits/mo", "5 Active Automations", "1,000 Auto-DMs & Replies/mo", "Follow before DM Gate", "Basic CRM (100 Contacts)", "Keyword Triggers Only"]', false, 1),
('creator_pro', 'Creator Pro', 'The sweet spot for Indian creators.', 899, 14, 8630, 134, '["Multiple Connected Accounts", "Multiple Workspaces", "250,000 AI Credits (10X)", "Unlimited Automations", "AI Intent & Smart AI Mode", "AI Human Mimicry Mode", "Story Mention Responder", "Smart Bio & Mini Store Access", "CRM Unlimited + CSV Leads Export", "Ambassador Split Access (20%)"]', true, 2),
('viral_scale', 'Viral Scale', 'For viral influencers & D2C brands.', 1999, 29, 19190, 278, '["2,000,000 AI Credits (100X)", "Everything in Creator Pro", "Auto-Fetch Profile Training", "Custom Brand Persona", "VIP Ambassador Split (25%)", "Priority WhatsApp Founder SLA"]', false, 3);

-- 2. Global Settings Table
CREATE TABLE public.global_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO public.global_settings (key, value, description)
VALUES 
('maintenance_mode', 'false', 'Enable to block user access globally'),
('free_trial_enabled', 'true', 'Enable free trial for new users'),
('signup_enabled', 'true', 'Allow new user registrations');

-- 3. System Broadcasts Table
CREATE TABLE public.system_broadcasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  link text,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- RLS Policies
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_broadcasts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active pricing plans and broadcasts
CREATE POLICY "Public read active pricing_plans" ON public.pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active broadcasts" ON public.system_broadcasts FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "Public read global_settings" ON public.global_settings FOR SELECT USING (true);

-- Allow admins full access via service role
