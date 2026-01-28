import { Progress } from '@/components/ui/progress';
import type { ProjectTask } from '@/types/projects';

interface PortalProjectProgressProps {
  tasks: ProjectTask[];
}

export function PortalProjectProgress({ tasks }: PortalProjectProgressProps) {
  if (tasks.length === 0) {
    return null;
  }

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const progress = Math.round((doneTasks / tasks.length) * 100);

  const statusCounts = {
    backlog: tasks.filter((t) => t.status === 'backlog').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    in_review: tasks.filter((t) => t.status === 'in_review').length,
    done: doneTasks,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Overall Progress</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />

      <div className="grid grid-cols-5 gap-2 text-center">
        <div className="p-2 rounded bg-muted/50">
          <p className="text-lg font-bold text-foreground">{statusCounts.backlog}</p>
          <p className="text-xs text-muted-foreground">Backlog</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-lg font-bold text-foreground">{statusCounts.todo}</p>
          <p className="text-xs text-muted-foreground">To Do</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-lg font-bold text-foreground">{statusCounts.in_progress}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-lg font-bold text-foreground">{statusCounts.in_review}</p>
          <p className="text-xs text-muted-foreground">In Review</p>
        </div>
        <div className="p-2 rounded bg-muted/50">
          <p className="text-lg font-bold text-foreground">{statusCounts.done}</p>
          <p className="text-xs text-muted-foreground">Done</p>
        </div>
      </div>
    </div>
  );
}
