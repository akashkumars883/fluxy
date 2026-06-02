-- Migration 010: Master Security Hardening - RLS Policies
-- Description: Consolidates and hardens RLS policies for ALL tables in the database, including full multi-user collaboration support.

-- Enable Row Level Security on ALL tables
ALTER TABLE IF EXISTS public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.automation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.partner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.referral_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payout_disbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.smart_bio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.smart_bio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_orders ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 1. WORKSPACES
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage their own workspaces" ON public.workspaces;
CREATE POLICY "Users can manage their own workspaces" ON public.workspaces
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Members can view shared workspaces" ON public.workspaces;
CREATE POLICY "Members can view shared workspaces" ON public.workspaces
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
        AND (workspace_members.user_id = auth.uid() OR workspace_members.email = auth.jwt()->>'email')
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Members with admin/editor role can update workspace" ON public.workspaces;
CREATE POLICY "Members with admin/editor role can update workspace" ON public.workspaces
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'editor')
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'editor')
        AND workspace_members.status = 'active'
    )
  );

-- -------------------------------------------------------------
-- 2. AUTOMATIONS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage their own automations" ON public.automations;
CREATE POLICY "Users can manage their own automations" ON public.automations
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Members can view workspace automations" ON public.automations;
CREATE POLICY "Members can view workspace automations" ON public.automations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = automations.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admin/Editor members can manage workspace automations" ON public.automations;
CREATE POLICY "Admin/Editor members can manage workspace automations" ON public.automations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = automations.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'editor')
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = automations.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'editor')
        AND workspace_members.status = 'active'
    )
  );

-- -------------------------------------------------------------
-- 3. TRIGGERS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage triggers for their automations" ON public.triggers;
CREATE POLICY "Users can manage triggers for their automations" ON public.triggers
  FOR ALL
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

DROP POLICY IF EXISTS "Members can view workspace triggers" ON public.triggers;
CREATE POLICY "Members can view workspace triggers" ON public.triggers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = triggers.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Admin/Editor members can manage workspace triggers" ON public.triggers;
CREATE POLICY "Admin/Editor members can manage workspace triggers" ON public.triggers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = triggers.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'editor')
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = triggers.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('admin', 'editor')
        AND workspace_members.status = 'active'
    )
  );

-- -------------------------------------------------------------
-- 4. AUTOMATION_HISTORY
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own automation history" ON public.automation_history;
CREATE POLICY "Users can view their own automation history" ON public.automation_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = automation_history.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can view workspace automation history" ON public.automation_history;
CREATE POLICY "Members can view workspace automation history" ON public.automation_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_members.workspace_id = automation_history.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

-- -------------------------------------------------------------
-- 5. WORKSPACE_MEMBERS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Allow owners full access to members list" ON public.workspace_members;
CREATE POLICY "Allow owners full access to members list" ON public.workspace_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE workspaces.id = workspace_members.workspace_id 
        AND workspaces.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces 
      WHERE workspaces.id = workspace_members.workspace_id 
        AND workspaces.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Allow members to view their own entries" ON public.workspace_members;
CREATE POLICY "Allow members to view their own entries" ON public.workspace_members
  FOR SELECT
  USING (
    workspace_members.user_id = auth.uid() 
    OR workspace_members.email = auth.jwt()->>'email'
  );

DROP POLICY IF EXISTS "Allow invited users to accept pending invites" ON public.workspace_members;
CREATE POLICY "Allow invited users to accept pending invites" ON public.workspace_members
  FOR UPDATE
  USING (
    workspace_members.email = auth.jwt()->>'email'
    AND workspace_members.status = 'pending'
  )
  WITH CHECK (
    workspace_members.email = auth.jwt()->>'email'
  );

-- -------------------------------------------------------------
-- 6. CONTENT_TEMPLATES
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can read active templates" ON public.content_templates;
CREATE POLICY "Anyone can read active templates" ON public.content_templates
  FOR SELECT 
  USING (is_active = true);

-- -------------------------------------------------------------
-- 7. SUPPORT_TICKETS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tickets" ON public.support_tickets;
CREATE POLICY "Users can insert their own tickets" ON public.support_tickets
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own open tickets" ON public.support_tickets;
CREATE POLICY "Users can update their own open tickets" ON public.support_tickets
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'open')
  WITH CHECK (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 8. BLOG_POSTS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

-- -------------------------------------------------------------
-- 9. SEO_SETTINGS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view seo settings" ON public.seo_settings;
CREATE POLICY "Public can view seo settings" ON public.seo_settings
  FOR SELECT
  USING (true);

-- -------------------------------------------------------------
-- 10. SUBSCRIPTIONS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- 11. INVOICES
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT
  USING (user_id = auth.uid());

-- -------------------------------------------------------------
-- 12. PARTNER_PROFILES
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Users can manage their own partner profile" ON public.partner_profiles;
CREATE POLICY "Users can manage their own partner profile" ON public.partner_profiles
  FOR ALL
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- -------------------------------------------------------------
-- 13. PROMO_CODES
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Public can validate active promo codes" ON public.promo_codes;
CREATE POLICY "Public can validate active promo codes" ON public.promo_codes
  FOR SELECT
  USING (status = 'active');

DROP POLICY IF EXISTS "Partners can manage their own promo codes" ON public.promo_codes;
CREATE POLICY "Partners can manage their own promo codes" ON public.promo_codes
  FOR ALL
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

-- -------------------------------------------------------------
-- 14. REFERRAL_ATTRIBUTIONS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Partners can view their own referrals" ON public.referral_attributions;
CREATE POLICY "Partners can view their own referrals" ON public.referral_attributions
  FOR SELECT
  USING (partner_id = auth.uid() OR customer_user_id = auth.uid());

-- -------------------------------------------------------------
-- 15. PAYOUT_DISBURSEMENTS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Partners can view their own payouts" ON public.payout_disbursements;
CREATE POLICY "Partners can view their own payouts" ON public.payout_disbursements
  FOR SELECT
  USING (partner_id = auth.uid());

-- -------------------------------------------------------------
-- 16. SMART_BIO_LINKS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Owners can manage bio links" ON public.smart_bio_links;
CREATE POLICY "Owners can manage bio links" ON public.smart_bio_links
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = smart_bio_links.automation_id
        AND automations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = smart_bio_links.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can manage bio links" ON public.smart_bio_links;
CREATE POLICY "Members can manage bio links" ON public.smart_bio_links
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = smart_bio_links.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = smart_bio_links.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Public can view active bio links" ON public.smart_bio_links;
CREATE POLICY "Public can view active bio links" ON public.smart_bio_links
  FOR SELECT
  USING (is_active = true);

-- -------------------------------------------------------------
-- 17. SMART_BIO_SETTINGS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Owners can manage bio settings" ON public.smart_bio_settings;
CREATE POLICY "Owners can manage bio settings" ON public.smart_bio_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = smart_bio_settings.automation_id
        AND automations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = smart_bio_settings.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can manage bio settings" ON public.smart_bio_settings;
CREATE POLICY "Members can manage bio settings" ON public.smart_bio_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = smart_bio_settings.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = smart_bio_settings.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Public can view bio settings" ON public.smart_bio_settings;
CREATE POLICY "Public can view bio settings" ON public.smart_bio_settings
  FOR SELECT
  USING (true);

-- -------------------------------------------------------------
-- 18. STORE_PRODUCTS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Owners can manage store products" ON public.store_products;
CREATE POLICY "Owners can manage store products" ON public.store_products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = store_products.automation_id
        AND automations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = store_products.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can manage store products" ON public.store_products;
CREATE POLICY "Members can manage store products" ON public.store_products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = store_products.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = store_products.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Public can view active products" ON public.store_products;
CREATE POLICY "Public can view active products" ON public.store_products
  FOR SELECT
  USING (is_active = true);

-- -------------------------------------------------------------
-- 19. STORE_ORDERS
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Owners can manage store orders" ON public.store_orders;
CREATE POLICY "Owners can manage store orders" ON public.store_orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = store_orders.automation_id
        AND automations.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      WHERE automations.id = store_orders.automation_id
        AND automations.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can manage store orders" ON public.store_orders;
CREATE POLICY "Members can manage store orders" ON public.store_orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = store_orders.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.automations
      JOIN public.workspace_members ON workspace_members.workspace_id = automations.workspace_id
      WHERE automations.id = store_orders.automation_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Public can insert orders during checkout" ON public.store_orders;
CREATE POLICY "Public can insert orders during checkout" ON public.store_orders
  FOR INSERT
  WITH CHECK (true);
