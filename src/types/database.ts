// Supabase Database Types
// Generated based on the CRM schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          company: string | null;
          job_title: string | null;
          website: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
          source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'event' | 'other';
          service_interest: string[];
          budget_range: string | null;
          timeline: string | null;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          job_title?: string | null;
          website?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
          source?: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'event' | 'other';
          service_interest?: string[];
          budget_range?: string | null;
          timeline?: string | null;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          company?: string | null;
          job_title?: string | null;
          website?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
          source?: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'event' | 'other';
          service_interest?: string[];
          budget_range?: string | null;
          timeline?: string | null;
          message?: string | null;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          lead_id: string;
          type: 'note' | 'email_sent' | 'call' | 'meeting' | 'status_change' | 'created';
          title: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          type: 'note' | 'email_sent' | 'call' | 'meeting' | 'status_change' | 'created';
          title: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          type?: 'note' | 'email_sent' | 'call' | 'meeting' | 'status_change' | 'created';
          title?: string;
          description?: string | null;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          email?: string;
        };
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          long_description: string;
          features_included: Json;
          features_not_included: Json;
          faqs: Json;
          pricing_zar_min_cents: number;
          pricing_zar_max_cents: number | null;
          pricing_usd_min_cents: number;
          pricing_usd_max_cents: number | null;
          billing_interval: 'monthly' | 'once_off' | 'custom';
          paystack_plan_code_zar: string | null;
          paystack_plan_code_usd: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description: string;
          long_description: string;
          features_included?: Json;
          features_not_included?: Json;
          faqs?: Json;
          pricing_zar_min_cents: number;
          pricing_zar_max_cents?: number | null;
          pricing_usd_min_cents: number;
          pricing_usd_max_cents?: number | null;
          billing_interval: 'monthly' | 'once_off' | 'custom';
          paystack_plan_code_zar?: string | null;
          paystack_plan_code_usd?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          short_description?: string;
          long_description?: string;
          features_included?: Json;
          features_not_included?: Json;
          faqs?: Json;
          pricing_zar_min_cents?: number;
          pricing_zar_max_cents?: number | null;
          pricing_usd_min_cents?: number;
          pricing_usd_max_cents?: number | null;
          billing_interval?: 'monthly' | 'once_off' | 'custom';
          paystack_plan_code_zar?: string | null;
          paystack_plan_code_usd?: string | null;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          company: string | null;
          phone: string | null;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          company?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          company?: string | null;
          phone?: string | null;
          role?: 'customer' | 'admin';
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          status: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
          paystack_subscription_code: string | null;
          paystack_customer_code: string | null;
          price_amount_cents: number;
          price_currency: 'ZAR' | 'USD';
          current_period_start: string;
          current_period_end: string;
          cancelled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          status?: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
          paystack_subscription_code?: string | null;
          paystack_customer_code?: string | null;
          price_amount_cents: number;
          price_currency: 'ZAR' | 'USD';
          current_period_start: string;
          current_period_end: string;
          cancelled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
          paystack_subscription_code?: string | null;
          paystack_customer_code?: string | null;
          price_amount_cents?: number;
          price_currency?: 'ZAR' | 'USD';
          current_period_start?: string;
          current_period_end?: string;
          cancelled_at?: string | null;
          updated_at?: string;
        };
      };
      payment_history: {
        Row: {
          id: string;
          subscription_id: string;
          user_id: string;
          paystack_reference: string;
          amount_cents: number;
          currency: 'ZAR' | 'USD';
          status: 'success' | 'failed' | 'pending';
          paid_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          user_id: string;
          paystack_reference: string;
          amount_cents: number;
          currency: 'ZAR' | 'USD';
          status?: 'success' | 'failed' | 'pending';
          paid_at: string;
          created_at?: string;
        };
        Update: {
          status?: 'success' | 'failed' | 'pending';
        };
      };
      legal_documents: {
        Row: {
          id: string;
          type: 'tos' | 'sla';
          title: string;
          content: string;
          version: string;
          service_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'tos' | 'sla';
          title: string;
          content: string;
          version: string;
          service_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: 'tos' | 'sla';
          title?: string;
          content?: string;
          version?: string;
          service_id?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      user_agreements: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          subscription_id: string | null;
          agreed_at: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id: string;
          subscription_id?: string | null;
          agreed_at?: string;
          ip_address?: string | null;
        };
        Update: {
          [_ in never]: never;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      lead_status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
      lead_source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'event' | 'other';
      activity_type: 'note' | 'email_sent' | 'call' | 'meeting' | 'status_change' | 'created';
      billing_interval: 'monthly' | 'once_off' | 'custom';
      subscription_status: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
      payment_status: 'success' | 'failed' | 'pending';
      user_role: 'customer' | 'admin';
      agreement_type: 'tos' | 'sla';
    };
  };
}
