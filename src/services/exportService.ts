import type { Lead } from '@/types/crm';
import { format } from 'date-fns';

export type ExportFormat = 'csv' | 'json';

function escapeCSV(value: string | undefined | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportLeadsToCSV(leads: Lead[]): string {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Company',
    'Job Title',
    'Website',
    'Status',
    'Source',
    'Services Interested',
    'Budget Range',
    'Timeline',
    'Message',
    'Created At',
    'Updated At',
  ];

  const rows = leads.map((lead) => [
    escapeCSV(lead.id),
    escapeCSV(lead.firstName),
    escapeCSV(lead.lastName),
    escapeCSV(lead.email),
    escapeCSV(lead.phone),
    escapeCSV(lead.company),
    escapeCSV(lead.jobTitle),
    escapeCSV(lead.website),
    escapeCSV(lead.status),
    escapeCSV(lead.source),
    escapeCSV(lead.serviceInterest.join('; ')),
    escapeCSV(lead.budgetRange),
    escapeCSV(lead.timeline),
    escapeCSV(lead.message),
    escapeCSV(format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm:ss')),
    escapeCSV(format(new Date(lead.updatedAt), 'yyyy-MM-dd HH:mm:ss')),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function exportLeadsToJSON(leads: Lead[]): string {
  return JSON.stringify(leads, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportLeads(leads: Lead[], format: ExportFormat): void {
  const timestamp = format === 'csv'
    ? new Date().toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  if (format === 'csv') {
    const content = exportLeadsToCSV(leads);
    downloadFile(content, `geek247-leads-${timestamp}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const content = exportLeadsToJSON(leads);
    downloadFile(content, `geek247-leads-${timestamp}.json`, 'application/json');
  }
}
