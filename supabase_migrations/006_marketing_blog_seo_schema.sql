-- ==========================================
-- 006_marketing_blog_seo_schema.sql
-- ==========================================
-- Description: Creates the blog_posts and seo_settings tables for the CMS.

-- 1. Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Automixa Team',
  cover_image text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- 2. Create seo_settings table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now()
);

-- Insert default SEO settings
INSERT INTO public.seo_settings (setting_key, setting_value, description)
VALUES 
('site_title', 'Automixa - AI Instagram Automation', 'Global fallback title'),
('meta_description', 'Automate your DMs, Comments, and Stories with AI.', 'Global meta description'),
('og_image', 'https://automixa.in/og-image.jpg', 'Default OpenGraph image URL'),
('twitter_handle', '@automixa', 'Twitter handle for cards')
ON CONFLICT (setting_key) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Public can read published blog posts
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- Admins can read all blog posts
CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts FOR SELECT
  USING (auth.role() = 'service_role');

-- Admins can insert/update/delete blog posts
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Public can read seo settings
CREATE POLICY "Public can view seo settings"
  ON public.seo_settings FOR SELECT
  USING (true);

-- Admins can manage seo settings
CREATE POLICY "Admins can manage seo settings"
  ON public.seo_settings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 5. Add Updated At Triggers
-- Assuming the trigger function `update_updated_at_column` already exists from previous migrations.
-- If not, it will be automatically handled or we can re-declare it if necessary, but it should exist.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blog_posts_modtime') THEN
    CREATE TRIGGER update_blog_posts_modtime
      BEFORE UPDATE ON public.blog_posts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_seo_settings_modtime') THEN
    CREATE TRIGGER update_seo_settings_modtime
      BEFORE UPDATE ON public.seo_settings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
