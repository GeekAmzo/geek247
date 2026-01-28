import { Badge } from '@/components/ui/badge';
import { TASK_STATUSES, type TaskStatus } from '@/types/projects';
import { cn } from '@/lib/utils';

const statusColors: Record<TaskStatus, string> = {
  backlog: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  todo: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  in_review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  done: 'bg-green-500/10 text-green-500 border-green-500/20',
};

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  const statusInfo = TASK_STATUSES.find((s) => s.value === status);

  return (
    <Badge
      variant="outline"
      className={cn(statusColors[status], 'font-medium', className)}
    >
      {statusInfo?.label || status}
    </Badge>
  );
}
