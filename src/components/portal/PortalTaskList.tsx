import { Badge } from '@/components/ui/badge';
import type { ProjectTask, TaskStatus } from '@/types/projects';
import { TASK_STATUSES } from '@/types/projects';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<TaskStatus, string> = {
  backlog: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  todo: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_progress: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  in_review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  done: 'bg-green-500/10 text-green-500 border-green-500/20',
};

interface PortalTaskListProps {
  tasks: ProjectTask[];
}

export function PortalTaskList({ tasks }: PortalTaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const statusInfo = TASK_STATUSES.find((s) => s.value === task.status);
        return (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
              {task.dueDate && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </p>
              )}
            </div>
            <Badge variant="outline" className={statusColors[task.status]}>
              {statusInfo?.label || task.status}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
