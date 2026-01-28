-- Migration: Add Client & Project Management tables
-- Depends on: 001_create_crm_tables.sql, 002_add_services_subscriptions_tos.sql

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE client_status AS ENUM ('active', 'inactive', 'churned', 'prospect');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('backlog', 'todo', 'in_progress', 'in_review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE communication_type AS ENUM ('email', 'call', 'note', 'message', 'meeting');
CREATE TYPE communication_direction AS ENUM ('inbound', 'outbound', 'internal');
CREATE TYPE milestone_status AS ENUM ('pending', 'in_progress', 'completed', 'missed');
CREATE TYPE goal_status AS ENUM ('not_started', 'on_track', 'at_risk', 'achieved', 'missed');
CREATE TYPE deliverable_status AS ENUM ('pending', 'in_progress', 'in_review', 'approved', 'rejected');
CREATE TYPE project_member_role AS ENUM ('owner', 'manager', 'member', 'viewer');

-- =====================================================
-- TABLES
-- =====================================================

-- 1. clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  industry TEXT,
  status client_status NOT NULL DEFAULT 'active',
  notes TEXT,
  user_profile_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_user_profile_id ON clients(user_profile_id);
CREATE INDEX idx_clients_lead_id ON clients(lead_id);

-- 2. projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  status project_status NOT NULL DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget_cents INTEGER,
  budget_currency TEXT DEFAULT 'ZAR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

-- 3. project_members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role project_member_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

-- 4. project_tasks
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  position INTEGER NOT NULL DEFAULT 0,
  assignee_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  parent_task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_status ON project_tasks(status);
CREATE INDEX idx_project_tasks_assignee ON project_tasks(assignee_id);
CREATE INDEX idx_project_tasks_parent ON project_tasks(parent_task_id);

-- 5. task_comments
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES project_tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_task_comments_task ON task_comments(task_id);

-- 6. project_milestones
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status milestone_status NOT NULL DEFAULT 'pending',
  target_date DATE,
  completed_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_milestones_project ON project_milestones(project_id);

-- 7. project_goals
CREATE TABLE project_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status goal_status NOT NULL DEFAULT 'not_started',
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_goals_project ON project_goals(project_id);

-- 8. project_deliverables
CREATE TABLE project_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES project_milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status deliverable_status NOT NULL DEFAULT 'pending',
  acceptance_criteria TEXT,
  due_date DATE,
  completed_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_deliverables_project ON project_deliverables(project_id);
CREATE INDEX idx_project_deliverables_milestone ON project_deliverables(milestone_id);

-- 9. project_attachments
CREATE TABLE project_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
  deliverable_id UUID REFERENCES project_deliverables(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_attachments_project ON project_attachments(project_id);
CREATE INDEX idx_project_attachments_task ON project_attachments(task_id);
CREATE INDEX idx_project_attachments_deliverable ON project_attachments(deliverable_id);

-- 10. client_communications
CREATE TABLE client_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  type communication_type NOT NULL DEFAULT 'note',
  direction communication_direction NOT NULL DEFAULT 'internal',
  subject TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_communications_client ON client_communications(client_id);
CREATE INDEX idx_client_communications_project ON client_communications(project_id);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- =====================================================

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_goals_updated_at
  BEFORE UPDATE ON project_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_project_deliverables_updated_at
  BEFORE UPDATE ON project_deliverables
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- AUTO-CREATE CLIENT TRIGGER (lead won -> client)
-- =====================================================

CREATE OR REPLACE FUNCTION auto_create_client_from_lead()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'won' AND (OLD.status IS NULL OR OLD.status != 'won') THEN
    INSERT INTO clients (company_name, contact_name, email, phone, website, status, lead_id)
    VALUES (
      COALESCE(NEW.company, NEW.first_name || ' ' || NEW.last_name),
      NEW.first_name || ' ' || NEW.last_name,
      NEW.email,
      NEW.phone,
      NEW.website,
      'active',
      NEW.id
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_client
  AFTER UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION auto_create_client_from_lead();

-- =====================================================
-- SUPABASE STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;

-- Admin policies: full access for authenticated admin users
CREATE POLICY "Admin full access on clients" ON clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on projects" ON projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on project_members" ON project_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on project_tasks" ON project_tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on task_comments" ON task_comments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on project_milestones" ON project_milestones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on project_goals" ON project_goals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on project_deliverables" ON project_deliverables
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on project_attachments" ON project_attachments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin full access on client_communications" ON client_communications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Customer policies: read own data
CREATE POLICY "Customers view own client" ON clients
  FOR SELECT USING (user_profile_id = auth.uid());

CREATE POLICY "Customers view own projects" ON projects
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE user_profile_id = auth.uid())
  );

CREATE POLICY "Customers view own project tasks" ON project_tasks
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Customers view own milestones" ON project_milestones
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Customers view own goals" ON project_goals
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Customers view own deliverables" ON project_deliverables
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Customers view own attachments" ON project_attachments
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Customers view own communications" ON client_communications
  FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE user_profile_id = auth.uid())
  );

CREATE POLICY "Customers create communications" ON client_communications
  FOR INSERT WITH CHECK (
    client_id IN (SELECT id FROM clients WHERE user_profile_id = auth.uid())
  );

-- Storage policies for project-files bucket
CREATE POLICY "Admin upload project files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin manage project files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'project-files'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers download project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files'
    AND EXISTS (
      SELECT 1 FROM project_attachments pa
      JOIN projects p ON p.id = pa.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_profile_id = auth.uid()
      AND pa.storage_path = name
    )
  );
