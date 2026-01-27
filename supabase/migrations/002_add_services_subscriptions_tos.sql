-- Migration: Add services, subscriptions, legal documents, user profiles
-- Phase 1 of Services, Subscriptions, ToS/SLA Implementation

-- Enums
CREATE TYPE billing_interval AS ENUM ('monthly', 'once_off', 'custom');
CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled', 'past_due', 'trialing');
CREATE TYPE payment_status AS ENUM ('success', 'failed', 'pending');
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE agreement_type AS ENUM ('tos', 'sla');

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  features_included jsonb NOT NULL DEFAULT '[]'::jsonb,
  features_not_included jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  pricing_zar_min_cents integer NOT NULL DEFAULT 0,
  pricing_zar_max_cents integer,
  pricing_usd_min_cents integer NOT NULL DEFAULT 0,
  pricing_usd_max_cents integer,
  billing_interval billing_interval NOT NULL DEFAULT 'monthly',
  paystack_plan_code_zar text,
  paystack_plan_code_usd text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  company text,
  phone text,
  role user_role NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status subscription_status NOT NULL DEFAULT 'active',
  paystack_subscription_code text,
  paystack_customer_code text,
  price_amount_cents integer NOT NULL,
  price_currency text NOT NULL CHECK (price_currency IN ('ZAR', 'USD')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Payment history
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paystack_reference text NOT NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL CHECK (currency IN ('ZAR', 'USD')),
  status payment_status NOT NULL DEFAULT 'pending',
  paid_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Legal documents
CREATE TABLE IF NOT EXISTS legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type agreement_type NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  version text NOT NULL DEFAULT '1.0',
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User agreements
CREATE TABLE IF NOT EXISTS user_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES legal_documents(id) ON DELETE RESTRICT,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  agreed_at timestamptz NOT NULL DEFAULT now(),
  ip_address text
);

-- Indexes
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_active ON services(is_active, sort_order);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_service ON subscriptions(service_id);
CREATE INDEX idx_payment_history_user ON payment_history(user_id);
CREATE INDEX idx_payment_history_subscription ON payment_history(subscription_id);
CREATE INDEX idx_legal_documents_active ON legal_documents(is_active, type);
CREATE INDEX idx_user_agreements_user ON user_agreements(user_id);
CREATE INDEX idx_user_agreements_document ON user_agreements(document_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER legal_documents_updated_at
  BEFORE UPDATE ON legal_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies

-- Services: public read, admin write
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are publicly readable" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User profiles: user can read/update own, admin can read all
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Profile auto-insert on signup" ON user_profiles FOR INSERT WITH CHECK (true);

-- Subscriptions: user sees own, admin sees all
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all subscriptions" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payment history: user sees own, admin sees all
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payment_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payment_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all payments" ON payment_history FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Legal documents: public read, admin write
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Legal documents are publicly readable" ON legal_documents FOR SELECT USING (true);
CREATE POLICY "Admins can manage legal documents" ON legal_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User agreements: user sees own, admin sees all
ALTER TABLE user_agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own agreements" ON user_agreements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own agreements" ON user_agreements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all agreements" ON user_agreements FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
