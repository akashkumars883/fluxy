-- ==============================================================================
-- AUTOMIXA SaaS PARTNER & PROMO CODE PROGRAM - SUPABASE MIGRATION SCRIPT
-- Database: PostgreSQL (Supabase)
-- ==============================================================================

-- 1. PARTNER PROFILES TABLE
-- Stores vetted ambassador profiles, current tiers, earnings, and payout details.
CREATE TABLE IF NOT EXISTS partner_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    application_status TEXT NOT NULL DEFAULT 'pending' CHECK (application_status IN ('unapplied', 'pending', 'approved', 'rejected')),
    primary_platform TEXT NOT NULL DEFAULT 'instagram',
    audience_tier TEXT NOT NULL DEFAULT '10k-50k',
    social_handle TEXT,
    master_tracking_link TEXT UNIQUE,
    active_tier TEXT NOT NULL DEFAULT 'silver' CHECK (active_tier IN ('silver', 'gold', 'platinum')),
    commission_rate NUMERIC(3, 2) NOT NULL DEFAULT 0.15, -- 0.15 for Silver, 0.20 for Gold, 0.25 for Platinum
    total_referrals_count INTEGER NOT NULL DEFAULT 0,
    monthly_recurring_revenue NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    unpaid_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_paid_earnings NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payout_method TEXT DEFAULT 'upi' CHECK (payout_method IN ('upi', 'bank_transfer', 'razorpay_route')),
    payout_address TEXT, -- UPI ID, Bank Account Number, or Razorpay Route Account ID
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CUSTOM PROMO CODES TABLE
-- Stores all discount codes created by partners and their respective attribution splits.
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
    code VARCHAR(30) UNIQUE NOT NULL,
    customer_discount_percent INTEGER NOT NULL DEFAULT 10, -- 10% or 15%
    partner_commission_percent INTEGER NOT NULL DEFAULT 20, -- 15%, 20%, or 25%
    split_config TEXT NOT NULL DEFAULT '10_20', -- '10_20', '15_15', '10_15'
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'revoked')),
    clicks_count INTEGER NOT NULL DEFAULT 0,
    sales_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. REFERRAL ATTRIBUTIONS TABLE
-- Records every successful Razorpay transaction linked to a promo code.
CREATE TABLE IF NOT EXISTS referral_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    promo_code_used VARCHAR(30) REFERENCES promo_codes(code) ON DELETE SET NULL,
    partner_id UUID NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
    subscription_plan TEXT NOT NULL, -- e.g., 'growth_monthly'
    transaction_amount NUMERIC(10, 2) NOT NULL, -- e.g., 1399.00
    commission_earned NUMERIC(10, 2) NOT NULL, -- e.g., 279.80
    transaction_id TEXT NOT NULL UNIQUE, -- Razorpay Payment ID / Subscription ID
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MONTHLY PAYOUT DISBURSEMENTS TABLE
-- Records batches of payouts disbursed on the 5th of every month via RazorpayX.
CREATE TABLE IF NOT EXISTS payout_disbursements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES partner_profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    period_month TEXT NOT NULL, -- e.g., 'April 2026'
    payout_method TEXT NOT NULL, -- 'upi' or 'razorpay_route'
    payout_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    razorpayx_reference_id TEXT UNIQUE, -- Payout Transaction Reference ID
    disbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES & PERFORMANCE OPTIMIZATIONS
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_partner_profiles_tier ON partner_profiles(active_tier);
CREATE INDEX IF NOT EXISTS idx_promo_codes_partner ON promo_codes(partner_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_referrals_partner ON referral_attributions(partner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_partner ON payout_disbursements(partner_id);

-- ==============================================================================
-- AUTOMATED TRIGGER: TIER UPGRADE CALCULATION
-- Automatically checks and upgrades active_tier when total_referrals_count increases.
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_partner_tier()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_referrals_count >= 50 THEN
        NEW.active_tier := 'platinum';
        NEW.commission_rate := 0.25;
    ELSIF NEW.total_referrals_count >= 11 THEN
        NEW.active_tier := 'gold';
        NEW.commission_rate := 0.20;
    ELSE
        NEW.active_tier := 'silver';
        NEW.commission_rate := 0.15;
    END IF;
    
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_partner_tier ON partner_profiles;
CREATE TRIGGER trigger_update_partner_tier
    BEFORE UPDATE ON partner_profiles
    FOR EACH ROW
    WHEN (OLD.total_referrals_count IS DISTINCT FROM NEW.total_referrals_count)
    EXECUTE FUNCTION update_partner_tier();
