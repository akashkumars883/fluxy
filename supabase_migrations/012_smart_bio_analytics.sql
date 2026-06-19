-- Create smart_bio_analytics table
CREATE TABLE IF NOT EXISTS public.smart_bio_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
    link_id UUID REFERENCES public.smart_bio_links(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_smart_bio_analytics_automation_id ON public.smart_bio_analytics(automation_id);
CREATE INDEX IF NOT EXISTS idx_smart_bio_analytics_event_type ON public.smart_bio_analytics(event_type);

-- Enable RLS
ALTER TABLE public.smart_bio_analytics ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous/public users to insert analytics (views/clicks)
DROP POLICY IF EXISTS "Public can insert analytics" ON public.smart_bio_analytics;
CREATE POLICY "Public can insert analytics" ON public.smart_bio_analytics
    FOR INSERT 
    WITH CHECK (true);

-- Policy to allow owners to read their own analytics
DROP POLICY IF EXISTS "Owners can read analytics" ON public.smart_bio_analytics;
CREATE POLICY "Owners can read analytics" ON public.smart_bio_analytics
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.automations 
            WHERE automations.id = smart_bio_analytics.automation_id 
            AND automations.user_id = auth.uid()
        )
    );
