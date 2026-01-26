-- Geek247 CRM Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
CREATE TYPE lead_source AS ENUM ('website', 'referral', 'linkedin', 'cold_outreach', 'event', 'other');
CREATE TYPE activity_type AS ENUM ('note', 'email_sent', 'call', 'meeting', 'status_change', 'created');

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    website TEXT,
    status lead_status NOT NULL DEFAULT 'new',
    source lead_source NOT NULL DEFAULT 'website',
    service_interest TEXT[] DEFAULT '{}',
    budget_range TEXT,
    timeline TEXT,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activities table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    type activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create admin_users table (for tracking authorized admins)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to leads table
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (update email as needed)
INSERT INTO admin_users (email) VALUES ('admin@geek247.co.za');

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
-- Allow anyone to insert (for contact form submissions)
CREATE POLICY "Allow public lead submissions" ON leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Only authenticated users can view/update/delete leads
CREATE POLICY "Authenticated users can view leads" ON leads
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can update leads" ON leads
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete leads" ON leads
    FOR DELETE TO authenticated
    USING (true);

-- RLS Policies for activities
-- Allow insert for authenticated users and system (for auto-created activities)
CREATE POLICY "Allow activity creation" ON activities
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view activities" ON activities
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete activities" ON activities
    FOR DELETE TO authenticated
    USING (true);

-- RLS Policies for admin_users
CREATE POLICY "Authenticated users can view admin_users" ON admin_users
    FOR SELECT TO authenticated
    USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON leads TO anon, authenticated;
GRANT ALL ON activities TO anon, authenticated;
GRANT SELECT ON admin_users TO authenticated;

COMMENT ON TABLE leads IS 'CRM leads captured from website contact forms';
COMMENT ON TABLE activities IS 'Activity log for lead interactions';
COMMENT ON TABLE admin_users IS 'Authorized admin users for CRM access';
