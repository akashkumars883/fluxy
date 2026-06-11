-- Create manual_payments table
CREATE TABLE IF NOT EXISTS public.manual_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    utr_number TEXT UNIQUE NOT NULL,
    is_annual BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup RLS
ALTER TABLE public.manual_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own manual payments"
ON public.manual_payments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own manual payments"
ON public.manual_payments FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
