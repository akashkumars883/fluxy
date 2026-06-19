-- Add custom background image support to smart_bio_settings
ALTER TABLE public.smart_bio_settings 
ADD COLUMN IF NOT EXISTS background_image_url TEXT;
