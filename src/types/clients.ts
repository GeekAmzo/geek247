// Client Manager Types

export type ClientStatus = 'active' | 'inactive' | 'churned' | 'prospect';

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  status: ClientStatus;
  notes?: string;
  userProfileId?: string;
  leadId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFilters {
  status?: ClientStatus | 'all';
  search?: string;
}

export const CLIENT_STATUSES: { value: ClientStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-500' },
  { value: 'churned', label: 'Churned', color: 'bg-red-500' },
  { value: 'prospect', label: 'Prospect', color: 'bg-blue-500' },
];
