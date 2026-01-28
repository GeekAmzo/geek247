import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MILESTONE_STATUSES, type ProjectMilestone, type MilestoneStatus } from '@/types/projects';
import { Calendar, CheckCircle, Circle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors: Record<MilestoneStatus, string> = {
  pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  missed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusIcons: Record<MilestoneStatus, typeof Circle> = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle,
  missed: AlertCircle,
};

interface MilestoneTimelineProps {
  milestones: ProjectMilestone[];
  onDelete?: (id: string) => void;
}

export function MilestoneTimeline({ milestones, onDelete }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No milestones yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const StatusIcon = statusIcons[milestone.status];
        const statusInfo = MILESTONE_STATUSES.find((s) => s.value === milestone.status);

        return (
          <div
            key={milestone.id}
            className="flex gap-4 p-4 rounded-lg border border-border"
          >
            <div className="mt-1">
              <StatusIcon
                className={cn(
                  'w-5 h-5',
                  milestone.status === 'completed' && 'text-green-500',
                  milestone.status === 'in_progress' && 'text-blue-500',
                  milestone.status === 'missed' && 'text-red-500',
                  milestone.status === 'pending' && 'text-gray-400'
                )}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-foreground">{milestone.title}</h4>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={statusColors[milestone.status]}>
                    {statusInfo?.label}
                  </Badge>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(milestone.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                {milestone.targetDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Target: {format(new Date(milestone.targetDate), 'MMM d, yyyy')}
                  </span>
                )}
                {milestone.completedDate && (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Completed: {format(new Date(milestone.completedDate), 'MMM d, yyyy')}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
