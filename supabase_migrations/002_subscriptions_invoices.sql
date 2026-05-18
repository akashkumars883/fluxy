-- ==============================================================================
-- AUTOMIXA SUBSCRIPTIONS & INVOICES SCHEMA
-- ==============================================================================

-- 1. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL DEFAULT 'free', -- 'free', 'creator_pro', 'viral_scale'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'past_due', 'canceled', 'trialing'
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    razorpay_subscription_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'paid', -- 'paid', 'pending', 'failed'
    plan_name TEXT NOT NULL,
    billing_reason TEXT DEFAULT 'subscription_create',
    payment_id TEXT UNIQUE, -- Razorpay Payment ID
    invoice_number TEXT UNIQUE NOT NULL, -- e.g., INV-1001
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
