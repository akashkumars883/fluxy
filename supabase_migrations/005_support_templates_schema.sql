-- ==========================================
-- 005_support_templates_schema.sql
-- ==========================================

-- 1. Create content_templates table
CREATE TABLE IF NOT EXISTS public.content_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general', -- e.g., 'dm', 'comment', 'story'
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for content_templates (Admins full access, users read-only if active)
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active templates" 
    ON public.content_templates FOR SELECT 
    USING (is_active = true);


-- 2. Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable for guest/unauthenticated tickets
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for support_tickets (Users can only see/insert their own tickets, Admins use Service Role)
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" 
    ON public.support_tickets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tickets" 
    ON public.support_tickets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own open tickets" 
    ON public.support_tickets FOR UPDATE 
    USING (auth.uid() = user_id AND status = 'open');


-- 3. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_content_templates_modtime
    BEFORE UPDATE ON public.content_templates
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_support_tickets_modtime
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
