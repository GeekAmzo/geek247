import { Badge } from '@/components/ui/badge';
import { TICKET_STATUSES, type TicketStatus } from '@/types/tickets';
import { cn } from '@/lib/utils';

const statusColors: Record<TicketStatus, string> = {
  open: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  waiting_on_customer: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  resolved: 'bg-green-500/10 text-green-500 border-green-500/20',
  closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  const statusInfo = TICKET_STATUSES.find((s) => s.value === status);

  return (
    <Badge
      variant="outline"
      className={cn(statusColors[status], 'font-medium', className)}
    >
      {statusInfo?.label || status}
    </Badge>
  );
}
