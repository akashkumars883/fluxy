-- Phase 1: Smart Bio & Mini Store Database Schema

-- 1. Bio Links Table (For Link-in-Bio builder)
CREATE TABLE IF NOT EXISTS public.smart_bio_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bio Settings Table (For Bio theme and profile overrides)
CREATE TABLE IF NOT EXISTS public.smart_bio_settings (
    automation_id UUID PRIMARY KEY REFERENCES public.automations(id) ON DELETE CASCADE,
    profile_title TEXT,
    bio_text TEXT,
    theme_preset TEXT DEFAULT 'light',
    custom_colors JSONB,
    show_lead_capture BOOLEAN DEFAULT false,
    lead_capture_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table (Mini Store)
CREATE TABLE IF NOT EXISTS public.store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_inr NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('digital', 'physical')),
    file_url TEXT, -- Supabase Storage URL for digital products
    cover_image TEXT,
    is_active BOOLEAN DEFAULT true,
    sales_count INTEGER DEFAULT 0,
    revenue_generated NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.store_products(id) ON DELETE CASCADE,
    automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    customer_email TEXT NOT NULL,
    customer_ig_handle TEXT,
    customer_name TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    fulfillment_status TEXT DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'delivered', 'shipped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS
ALTER TABLE public.smart_bio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_bio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
