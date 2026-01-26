import { Badge } from '@/components/ui/badge';
import { LEAD_STATUSES, type LeadStatus } from '@/types/crm';
import { cn } from '@/lib/utils';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  qualified: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  proposal: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  won: 'bg-green-500/10 text-green-500 border-green-500/20',
  lost: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const statusInfo = LEAD_STATUSES.find((s) => s.value === status);

  return (
    <Badge
      variant="outline"
      className={cn(statusColors[status], 'font-medium', className)}
    >
      {statusInfo?.label || status}
    </Badge>
  );
}
