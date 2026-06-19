-- Add missing columns to smart_bio_settings for new UI features
ALTER TABLE public.smart_bio_settings
ADD COLUMN IF NOT EXISTS bg_preset_id TEXT,
ADD COLUMN IF NOT EXISTS enable_email_capture BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_capture_title TEXT,
ADD COLUMN IF NOT EXISTS email_capture_button_text TEXT;

-- Add missing columns to smart_bio_links for link thumbnails
ALTER TABLE public.smart_bio_links
ADD COLUMN IF NOT EXISTS thumbnail TEXT;
