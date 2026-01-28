import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import type { ProjectTask } from '@/types/projects';
import { Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: ProjectTask;
  onClick?: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 cursor-pointer transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-foreground line-clamp-2">{task.title}</h4>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TaskStatusBadge status={task.status} />
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          {task.commentCount !== undefined && task.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              {task.commentCount}
            </span>
          )}
        </div>
        {task.assigneeName && (
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
            {task.assigneeName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
