import { Badge } from '@/components/ui/badge';
import { PROJECT_STATUSES, type ProjectStatus } from '@/types/projects';
import { cn } from '@/lib/utils';

const statusColors: Record<ProjectStatus, string> = {
  planning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  on_hold: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const statusInfo = PROJECT_STATUSES.find((s) => s.value === status);

  return (
    <Badge
      variant="outline"
      className={cn(statusColors[status], 'font-medium', className)}
    >
      {statusInfo?.label || status}
    </Badge>
  );
}
