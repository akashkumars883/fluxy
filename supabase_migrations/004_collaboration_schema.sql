-- Migration 004: Collaboration & Workspace Team Roles Schema
-- Description: Creates the workspace_members table to allow multi-user collaboration per workspace.

CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    user_id UUID, -- NULL until the invited user registers/signs in
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
    invited_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (workspace_id, email)
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_workspace_members_email ON workspace_members(email);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);

-- Enable Row Level Security
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow owners full access to members list" ON workspace_members;
CREATE POLICY "Allow owners full access to members list" ON workspace_members
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workspaces 
            WHERE workspaces.id = workspace_members.workspace_id 
            AND workspaces.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Allow members to view their own entries" ON workspace_members;
CREATE POLICY "Allow members to view their own entries" ON workspace_members
    FOR SELECT
    USING (
        workspace_members.user_id = auth.uid() 
        OR workspace_members.email = auth.jwt()->>'email'
    );

DROP POLICY IF EXISTS "Allow invited users to accept pending invites" ON workspace_members;
CREATE POLICY "Allow invited users to accept pending invites" ON workspace_members
    FOR UPDATE
    USING (
        workspace_members.email = auth.jwt()->>'email'
        AND workspace_members.status = 'pending'
    );
