import { format, isPast, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OverviewItemRowProps {
  title: string;
  projectName?: string;
  dueDate?: string;
  status: string;
  statusColor?: string;
  type: 'task' | 'milestone' | 'deliverable';
}

const typeLabels: Record<string, string> = {
  task: 'Task',
  milestone: 'Milestone',
  deliverable: 'Deliverable',
};

export function OverviewItemRow({ title, projectName, dueDate, status, statusColor, type }: OverviewItemRowProps) {
  const isOverdue = dueDate && isPast(new Date(dueDate)) && !isToday(new Date(dueDate));

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">{title}</span>
          <span className="text-xs text-muted-foreground shrink-0">{typeLabels[type]}</span>
        </div>
        {projectName && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{projectName}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {dueDate && (
          <span className={cn('text-xs', isOverdue ? 'text-red-500 font-medium' : 'text-muted-foreground')}>
            {format(new Date(dueDate), 'MMM d')}
          </span>
        )}
        <Badge
          variant="outline"
          className={cn('text-xs', statusColor)}
        >
          {status}
        </Badge>
      </div>
    </div>
  );
}
