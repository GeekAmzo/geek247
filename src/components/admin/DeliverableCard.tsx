import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DELIVERABLE_STATUSES, type ProjectDeliverable, type DeliverableStatus } from '@/types/projects';
import { Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<DeliverableStatus, string> = {
  pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  in_review: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

interface DeliverableCardProps {
  deliverable: ProjectDeliverable;
  onDelete?: (id: string) => void;
}

export function DeliverableCard({ deliverable, onDelete }: DeliverableCardProps) {
  const statusInfo = DELIVERABLE_STATUSES.find((s) => s.value === deliverable.status);

  return (
    <div className="p-4 rounded-lg border border-border">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-foreground">{deliverable.title}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[deliverable.status]}>
            {statusInfo?.label}
          </Badge>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(deliverable.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {deliverable.description && (
        <p className="text-sm text-muted-foreground mb-2">{deliverable.description}</p>
      )}

      {deliverable.acceptanceCriteria && (
        <div className="mt-2 p-2 rounded bg-muted/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">Acceptance Criteria</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{deliverable.acceptanceCriteria}</p>
        </div>
      )}

      {deliverable.dueDate && (
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          Due: {format(new Date(deliverable.dueDate), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}
