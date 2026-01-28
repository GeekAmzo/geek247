import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { ProjectMilestone, ProjectDeliverable, MilestoneStatus, DeliverableStatus } from '@/types/projects';
import { CheckCircle, Circle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const milestoneStatusColors: Record<MilestoneStatus, string> = {
  pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  missed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  pending: 'Pending', in_progress: 'In Progress', completed: 'Completed', missed: 'Missed',
};

const deliverableStatusColors: Record<DeliverableStatus, string> = {
  pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_review: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const deliverableStatusLabels: Record<DeliverableStatus, string> = {
  pending: 'Pending', in_progress: 'In Progress', in_review: 'In Review', approved: 'Approved', rejected: 'Rejected',
};

const statusIcons: Record<MilestoneStatus, typeof Circle> = {
  pending: Circle, in_progress: Clock, completed: CheckCircle, missed: AlertCircle,
};

interface PortalMilestoneViewProps {
  milestones: ProjectMilestone[];
  deliverables: ProjectDeliverable[];
}

export function PortalMilestoneView({ milestones, deliverables }: PortalMilestoneViewProps) {
  if (milestones.length === 0 && deliverables.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No milestones or deliverables yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {milestones.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Milestones</h3>
          <div className="space-y-3">
            {milestones.map((milestone) => {
              const StatusIcon = statusIcons[milestone.status];
              return (
                <div key={milestone.id} className="flex gap-3 p-3 rounded-lg border border-border">
                  <StatusIcon
                    className={cn(
                      'w-5 h-5 mt-0.5 shrink-0',
                      milestone.status === 'completed' && 'text-green-500',
                      milestone.status === 'in_progress' && 'text-blue-500',
                      milestone.status === 'missed' && 'text-red-500',
                      milestone.status === 'pending' && 'text-gray-400'
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{milestone.title}</p>
                      <Badge variant="outline" className={milestoneStatusColors[milestone.status]}>
                        {milestoneStatusLabels[milestone.status]}
                      </Badge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                    {milestone.targetDate && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Target: {format(new Date(milestone.targetDate), 'MMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {deliverables.length > 0 && (
        <div>
          <h3 className="font-semibold text-foreground mb-3">Deliverables</h3>
          <div className="space-y-3">
            {deliverables.map((d) => (
              <div key={d.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{d.title}</p>
                  <Badge variant="outline" className={deliverableStatusColors[d.status]}>
                    {deliverableStatusLabels[d.status]}
                  </Badge>
                </div>
                {d.description && (
                  <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
