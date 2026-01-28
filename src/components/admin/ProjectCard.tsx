import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import type { Project } from '@/types/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/admin/projects/${project.id}`}
      className="block p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground truncate mr-2">{project.name}</h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      {project.clientName && (
        <p className="text-sm text-muted-foreground mb-2">{project.clientName}</p>
      )}

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
          {project.endDate && (
            <span>- {format(new Date(project.endDate), 'MMM d, yyyy')}</span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
}
