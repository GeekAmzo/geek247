-- Fix: RLS infinite recursion when policies on multiple tables
-- reference user_profiles which itself has RLS policies that
-- query user_profiles.
--
-- Solution: Create a SECURITY DEFINER function that bypasses RLS
-- to check admin status, then update all policies to use it.

-- =====================================================
-- 1. Create helper function (SECURITY DEFINER bypasses RLS)
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- 2. Fix user_profiles policies (from migration 002)
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin());

-- =====================================================
-- 3. Fix services/subscriptions policies (from migration 002)
-- =====================================================

DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;
CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage all payments" ON payment_history;
CREATE POLICY "Admins can manage all payments" ON payment_history
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage legal documents" ON legal_documents;
CREATE POLICY "Admins can manage legal documents" ON legal_documents
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all agreements" ON user_agreements;
CREATE POLICY "Admins can view all agreements" ON user_agreements
  FOR ALL USING (is_admin());

-- =====================================================
-- 4. Fix client/project management policies (from migration 003)
-- =====================================================

DROP POLICY IF EXISTS "Admin full access on clients" ON clients;
CREATE POLICY "Admin full access on clients" ON clients
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on projects" ON projects;
CREATE POLICY "Admin full access on projects" ON projects
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on project_members" ON project_members;
CREATE POLICY "Admin full access on project_members" ON project_members
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on project_tasks" ON project_tasks;
CREATE POLICY "Admin full access on project_tasks" ON project_tasks
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on task_comments" ON task_comments;
CREATE POLICY "Admin full access on task_comments" ON task_comments
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on project_milestones" ON project_milestones;
CREATE POLICY "Admin full access on project_milestones" ON project_milestones
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on project_goals" ON project_goals;
CREATE POLICY "Admin full access on project_goals" ON project_goals
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on project_deliverables" ON project_deliverables;
CREATE POLICY "Admin full access on project_deliverables" ON project_deliverables
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on project_attachments" ON project_attachments;
CREATE POLICY "Admin full access on project_attachments" ON project_attachments
  FOR ALL USING (is_admin());

DROP POLICY IF EXISTS "Admin full access on client_communications" ON client_communications;
CREATE POLICY "Admin full access on client_communications" ON client_communications
  FOR ALL USING (is_admin());

-- Fix storage policies too
DROP POLICY IF EXISTS "Admin upload project files" ON storage.objects;
CREATE POLICY "Admin upload project files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' AND is_admin()
  );

DROP POLICY IF EXISTS "Admin manage project files" ON storage.objects;
CREATE POLICY "Admin manage project files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'project-files' AND is_admin()
  );

-- =====================================================
-- 5. Ensure the admin user has a user_profiles row
-- =====================================================
-- Upsert a profile for the admin. Update the email below if needed.

INSERT INTO user_profiles (id, email, full_name, role)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', 'Admin'),
  'admin'::user_role
FROM auth.users au
JOIN admin_users adm ON adm.email = au.email
ON CONFLICT (id) DO UPDATE SET role = 'admin';
