-- Security hardening for user-owned SaaS data.

ALTER TABLE IF EXISTS public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.automation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referral_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payout_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_user_id_key ON public.subscriptions(user_id);

ALTER TABLE IF EXISTS public.referral_attributions
  ALTER COLUMN customer_user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users can manage their own workspaces" ON public.workspaces;
CREATE POLICY "Users can manage their own workspaces"
  ON public.workspaces FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage their own automations" ON public.automations;
CREATE POLICY "Users can manage their own automations"
  ON public.automations FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage triggers for their automations" ON public.triggers;
CREATE POLICY "Users can manage triggers for their automations"
  ON public.triggers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = triggers.automation_id
        AND automations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = triggers.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own automation history" ON public.automation_history;
CREATE POLICY "Users can view their own automation history"
  ON public.automation_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = automation_history.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage their own partner profile" ON public.partner_profiles;
CREATE POLICY "Users can manage their own partner profile"
  ON public.partner_profiles FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Public can validate active promo codes" ON public.promo_codes;
CREATE POLICY "Public can validate active promo codes"
  ON public.promo_codes FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Partners can manage their own promo codes" ON public.promo_codes;
CREATE POLICY "Partners can manage their own promo codes"
  ON public.promo_codes FOR ALL
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

DROP POLICY IF EXISTS "Partners can view their own referrals" ON public.referral_attributions;
CREATE POLICY "Partners can view their own referrals"
  ON public.referral_attributions FOR SELECT
  USING (partner_id = auth.uid() OR customer_user_id = auth.uid());

DROP POLICY IF EXISTS "Partners can view their own payouts" ON public.payout_disbursements;
CREATE POLICY "Partners can view their own payouts"
  ON public.payout_disbursements FOR SELECT
  USING (partner_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (user_id = auth.uid());
