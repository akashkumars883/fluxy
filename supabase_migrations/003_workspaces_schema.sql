-- ==============================================================================
-- AUTOMIXA CORE TABLES & WORKSPACES - SUPABASE MIGRATION SCRIPT
-- Database: PostgreSQL (Supabase)
-- ==============================================================================

-- 1. WORKSPACES TABLE
-- Stores workspace containers created by users for isolated client/brand management.
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_color TEXT NOT NULL DEFAULT 'bg-indigo-600',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AUTOMATIONS TABLE (Instagram Accounts Connected)
CREATE TABLE IF NOT EXISTS automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    page_id TEXT UNIQUE NOT NULL,
    page_name TEXT,
    access_token TEXT NOT NULL,
    ig_business_id TEXT UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    persona TEXT DEFAULT 'business',
    metadata JSONB DEFAULT '{}'::jsonb,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRIGGERS TABLE (Campaign Triggers/Keywords)
CREATE TABLE IF NOT EXISTS triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    response TEXT NOT NULL,
    type TEXT DEFAULT 'COMMENT',
    metadata JSONB DEFAULT '{}'::jsonb,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AUTOMATION_HISTORY TABLE (CRM Interaction Logs)
CREATE TABLE IF NOT EXISTS automation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    sender_name TEXT,
    type TEXT NOT NULL,
    keyword TEXT,
    status TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ADD WORKSPACE_ID COLUMNS (IF TABLE ALREADY EXISTED BUT WITHOUT WORKSPACES)
-- ==============================================================================
ALTER TABLE automations ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL;
ALTER TABLE triggers ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;
ALTER TABLE automation_history ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE;

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_workspaces_user ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_workspace ON automations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_triggers_workspace ON triggers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_history_workspace ON automation_history(workspace_id);
