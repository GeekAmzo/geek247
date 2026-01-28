import { Badge } from '@/components/ui/badge';
import { CLIENT_STATUSES, type ClientStatus } from '@/types/clients';
import { cn } from '@/lib/utils';

const statusColors: Record<ClientStatus, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  churned: 'bg-red-500/10 text-red-500 border-red-500/20',
  prospect: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

interface ClientStatusBadgeProps {
  status: ClientStatus;
  className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const statusInfo = CLIENT_STATUSES.find((s) => s.value === status);

  return (
    <Badge
      variant="outline"
      className={cn(statusColors[status], 'font-medium', className)}
    >
      {statusInfo?.label || status}
    </Badge>
  );
}
