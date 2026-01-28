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
      clients: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          website: string | null;
          industry: string | null;
          status: 'active' | 'inactive' | 'churned' | 'prospect';
          notes: string | null;
          user_profile_id: string | null;
          lead_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          industry?: string | null;
          status?: 'active' | 'inactive' | 'churned' | 'prospect';
          notes?: string | null;
          user_profile_id?: string | null;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          industry?: string | null;
          status?: 'active' | 'inactive' | 'churned' | 'prospect';
          notes?: string | null;
          user_profile_id?: string | null;
          lead_id?: string | null;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          client_id: string;
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          start_date: string | null;
          end_date: string | null;
          budget_cents: number | null;
          budget_currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          client_id: string;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          start_date?: string | null;
          end_date?: string | null;
          budget_cents?: number | null;
          budget_currency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          client_id?: string;
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
          start_date?: string | null;
          end_date?: string | null;
          budget_cents?: number | null;
          budget_currency?: string | null;
          updated_at?: string;
        };
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: 'owner' | 'manager' | 'member' | 'viewer';
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role?: 'owner' | 'manager' | 'member' | 'viewer';
          created_at?: string;
        };
        Update: {
          role?: 'owner' | 'manager' | 'member' | 'viewer';
        };
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          position: number;
          assignee_id: string | null;
          parent_task_id: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          position?: number;
          assignee_id?: string | null;
          parent_task_id?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          position?: number;
          assignee_id?: string | null;
          parent_task_id?: string | null;
          due_date?: string | null;
          updated_at?: string;
        };
      };
      task_comments: {
        Row: {
          id: string;
          task_id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          author_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'pending' | 'in_progress' | 'completed' | 'missed';
          target_date: string | null;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'missed';
          target_date?: string | null;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'completed' | 'missed';
          target_date?: string | null;
          completed_date?: string | null;
          updated_at?: string;
        };
      };
      project_goals: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'not_started' | 'on_track' | 'at_risk' | 'achieved' | 'missed';
          target_value: number | null;
          current_value: number;
          unit: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: 'not_started' | 'on_track' | 'at_risk' | 'achieved' | 'missed';
          target_value?: number | null;
          current_value?: number;
          unit?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: 'not_started' | 'on_track' | 'at_risk' | 'achieved' | 'missed';
          target_value?: number | null;
          current_value?: number;
          unit?: string | null;
          updated_at?: string;
        };
      };
      project_deliverables: {
        Row: {
          id: string;
          project_id: string;
          milestone_id: string | null;
          title: string;
          description: string | null;
          status: 'pending' | 'in_progress' | 'in_review' | 'approved' | 'rejected';
          acceptance_criteria: string | null;
          due_date: string | null;
          completed_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          milestone_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'in_review' | 'approved' | 'rejected';
          acceptance_criteria?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          milestone_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'pending' | 'in_progress' | 'in_review' | 'approved' | 'rejected';
          acceptance_criteria?: string | null;
          due_date?: string | null;
          completed_date?: string | null;
          updated_at?: string;
        };
      };
      project_attachments: {
        Row: {
          id: string;
          project_id: string;
          task_id: string | null;
          deliverable_id: string | null;
          file_name: string;
          file_size: number;
          file_type: string;
          storage_path: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          task_id?: string | null;
          deliverable_id?: string | null;
          file_name: string;
          file_size: number;
          file_type: string;
          storage_path: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          task_id?: string | null;
          deliverable_id?: string | null;
        };
      };
      client_communications: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          author_id: string | null;
          type: 'email' | 'call' | 'note' | 'message' | 'meeting';
          direction: 'inbound' | 'outbound' | 'internal';
          subject: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          author_id?: string | null;
          type?: 'email' | 'call' | 'note' | 'message' | 'meeting';
          direction?: 'inbound' | 'outbound' | 'internal';
          subject?: string | null;
          content: string;
          created_at?: string;
        };
        Update: {
          type?: 'email' | 'call' | 'note' | 'message' | 'meeting';
          direction?: 'inbound' | 'outbound' | 'internal';
          subject?: string | null;
          content?: string;
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
      client_status: 'active' | 'inactive' | 'churned' | 'prospect';
      project_status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
      task_status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
      task_priority: 'low' | 'medium' | 'high' | 'urgent';
      communication_type: 'email' | 'call' | 'note' | 'message' | 'meeting';
      communication_direction: 'inbound' | 'outbound' | 'internal';
      milestone_status: 'pending' | 'in_progress' | 'completed' | 'missed';
      goal_status: 'not_started' | 'on_track' | 'at_risk' | 'achieved' | 'missed';
      deliverable_status: 'pending' | 'in_progress' | 'in_review' | 'approved' | 'rejected';
      project_member_role: 'owner' | 'manager' | 'member' | 'viewer';
    };
  };
}
