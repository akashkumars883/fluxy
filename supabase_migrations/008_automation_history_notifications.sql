-- Notification read state used by the dashboard notification dropdown.

ALTER TABLE IF EXISTS public.automation_history
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_history_notifications_unread
  ON public.automation_history(automation_id, is_read, created_at DESC);
