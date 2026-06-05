-- ==============================================================================
-- AUTOMIXA ONBOARDING EMAILS TRACKING TABLE - SUPABASE MIGRATION SCRIPT
-- Database: PostgreSQL (Supabase)
-- ==============================================================================

-- Create Onboarding Emails log table in public schema
CREATE TABLE IF NOT EXISTS public.onboarding_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    email_type TEXT NOT NULL, -- 'welcome', 'nudge_2h', 'case_study_24h', 'feedback_72h'
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, email_type)
);

-- Indexes for fast queries in Admin Dashboard
CREATE INDEX IF NOT EXISTS idx_onboarding_emails_user ON onboarding_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_emails_type ON onboarding_emails(email_type);
CREATE INDEX IF NOT EXISTS idx_onboarding_emails_sent ON onboarding_emails(sent_at DESC);
