import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProjectStatusBadge } from '@/components/admin/ProjectStatusBadge';
import type { Project, ProjectTask } from '@/types/projects';

interface ProjectMiniCardProps {
  project: Project;
  tasks: ProjectTask[];
}

export function ProjectMiniCard({ project, tasks }: ProjectMiniCardProps) {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const doneTasks = projectTasks.filter((t) => t.status === 'done').length;
  const totalTasks = projectTasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Link
      to={`/admin/projects/${project.id}`}
      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
          {project.name}
        </p>
        {totalTasks > 0 && (
          <div className="flex items-center gap-2 mt-1.5">
            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden max-w-[120px]">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {doneTasks}/{totalTasks}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <ProjectStatusBadge status={project.status} />
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
