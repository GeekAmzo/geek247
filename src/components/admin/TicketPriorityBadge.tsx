import { Badge } from '@/components/ui/badge';
import { TICKET_PRIORITIES, type TicketPriority } from '@/types/tickets';
import { cn } from '@/lib/utils';

const priorityColors: Record<TicketPriority, string> = {
  low: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-500 border-red-500/20',
};

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export function TicketPriorityBadge({ priority, className }: TicketPriorityBadgeProps) {
  const priorityInfo = TICKET_PRIORITIES.find((p) => p.value === priority);

  return (
    <Badge
      variant="outline"
      className={cn(priorityColors[priority], 'font-medium', className)}
    >
      {priorityInfo?.label || priority}
    </Badge>
  );
}
