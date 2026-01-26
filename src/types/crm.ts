// CRM Types

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'event' | 'other';

export type ActivityType = 'note' | 'email_sent' | 'call' | 'meeting' | 'status_change' | 'created';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  status: LeadStatus;
  source: LeadSource;
  serviceInterest: string[];
  budgetRange?: string;
  timeline?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdAt: string;
}

export interface LeadFilters {
  status?: LeadStatus | 'all';
  source?: LeadSource | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  thisMonth: number;
  conversionRate: number;
}

export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-orange-500' },
  { value: 'won', label: 'Won', color: 'bg-green-500' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export const LEAD_SOURCES: { value: LeadSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];

export const ACTIVITY_TYPES: { value: ActivityType; label: string; icon: string }[] = [
  { value: 'note', label: 'Note', icon: 'FileText' },
  { value: 'email_sent', label: 'Email Sent', icon: 'Mail' },
  { value: 'call', label: 'Call', icon: 'Phone' },
  { value: 'meeting', label: 'Meeting', icon: 'Calendar' },
  { value: 'status_change', label: 'Status Change', icon: 'RefreshCw' },
  { value: 'created', label: 'Lead Created', icon: 'UserPlus' },
];

export const SERVICE_OPTIONS = [
  'AI Process Automation',
  'Business Systems & Infrastructure',
  'Custom Software & Integrations',
  'Strategy Consulting',
  'Other',
];

export const BUDGET_RANGES = [
  'Under R10,000',
  'R10,000 - R25,000',
  'R25,000 - R50,000',
  'R50,000 - R100,000',
  'R100,000+',
  'Not sure yet',
];

export const TIMELINE_OPTIONS = [
  'ASAP',
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  '6+ months',
  'Just exploring',
];
