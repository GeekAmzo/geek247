import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GOAL_STATUSES, type ProjectGoal, type GoalStatus } from '@/types/projects';
import { Trash2 } from 'lucide-react';

const statusColors: Record<GoalStatus, string> = {
  not_started: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  on_track: 'bg-green-500/10 text-green-500 border-green-500/20',
  at_risk: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  achieved: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  missed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

interface GoalCardProps {
  goal: ProjectGoal;
  onDelete?: (id: string) => void;
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
  const statusInfo = GOAL_STATUSES.find((s) => s.value === goal.status);
  const progress = goal.targetValue
    ? Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100)
    : 0;

  return (
    <div className="p-4 rounded-lg border border-border">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-foreground">{goal.title}</h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={statusColors[goal.status]}>
            {statusInfo?.label}
          </Badge>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {goal.description && (
        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
      )}

      {goal.targetValue !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.currentValue}{goal.unit ? ` ${goal.unit}` : ''} / {goal.targetValue}{goal.unit ? ` ${goal.unit}` : ''}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
