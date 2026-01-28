import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Project, ProjectStatus } from '@/types/projects';

const statusColors: Record<ProjectStatus, string> = {
  planning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  on_hold: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

interface PortalProjectCardProps {
  project: Project;
}

export function PortalProjectCard({ project }: PortalProjectCardProps) {
  return (
    <Link
      to={`/portal/projects/${project.id}`}
      className="block p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground truncate mr-2">{project.name}</h3>
        <Badge variant="outline" className={statusColors[project.status]}>
          {statusLabels[project.status]}
        </Badge>
      </div>

      {project.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {project.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(project.startDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
