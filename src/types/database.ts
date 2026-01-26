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
    };
  };
}
