import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TaskStatusBadge } from './TaskStatusBadge';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskCommentList } from './TaskCommentList';
import { Separator } from '@/components/ui/separator';
import type { ProjectTask } from '@/types/projects';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';

interface TaskDetailSheetProps {
  task: ProjectTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
}

export function TaskDetailSheet({ task, open, onOpenChange, currentUserId }: TaskDetailSheetProps) {
  if (!task) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">{task.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Assignee
              </p>
              <p className="text-foreground mt-1">{task.assigneeName || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </p>
              <p className="text-foreground mt-1">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
              </p>
            </div>
          </div>

          <Separator />

          <TaskCommentList taskId={task.id} currentUserId={currentUserId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
