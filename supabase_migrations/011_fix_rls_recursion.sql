-- Migration 011: Fix RLS Policy Recursion between workspaces and workspace_members
-- Description: Breaks the infinite recursion loop in Row Level Security policies by using SECURITY DEFINER functions.

-- 1. Create helper functions with SECURITY DEFINER to bypass RLS inside the checks
CREATE OR REPLACE FUNCTION public.is_workspace_owner(workspace_id UUID, user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspaces
    WHERE id = workspace_id AND workspaces.user_id = user_id
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id UUID, user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_members.workspace_id = $1
      AND workspace_members.user_id = $2
      AND workspace_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_workspace_admin_or_editor(workspace_id UUID, user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_members.workspace_id = $1
      AND workspace_members.user_id = $2
      AND workspace_members.role IN ('admin', 'editor')
      AND workspace_members.status = 'active'
  );
END;
$$ LANGUAGE plpgsql;

-- 2. Re-create Workspaces RLS Policies using the security-definer helper functions
DROP POLICY IF EXISTS "Members can view shared workspaces" ON public.workspaces;
CREATE POLICY "Members can view shared workspaces" ON public.workspaces
  FOR SELECT
  USING (
    public.is_workspace_member(id, auth.uid())
  );

DROP POLICY IF EXISTS "Members with admin/editor role can update workspace" ON public.workspaces;
CREATE POLICY "Members with admin/editor role can update workspace" ON public.workspaces
  FOR UPDATE
  USING (
    public.is_workspace_admin_or_editor(id, auth.uid())
  )
  WITH CHECK (
    public.is_workspace_admin_or_editor(id, auth.uid())
  );

-- 3. Re-create Workspace Members RLS Policies using the security-definer helper functions
DROP POLICY IF EXISTS "Allow owners full access to members list" ON public.workspace_members;
CREATE POLICY "Allow owners full access to members list" ON public.workspace_members
  FOR ALL
  USING (
    public.is_workspace_owner(workspace_id, auth.uid())
  )
  WITH CHECK (
    public.is_workspace_owner(workspace_id, auth.uid())
  );
