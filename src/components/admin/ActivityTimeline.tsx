import { format } from 'date-fns';
import {
  FileText,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import type { Activity, ActivityType } from '@/types/crm';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  activities: Activity[];
  isLoading?: boolean;
}

const activityIcons: Record<ActivityType, typeof FileText> = {
  note: FileText,
  email_sent: Mail,
  call: Phone,
  meeting: Calendar,
  status_change: RefreshCw,
  created: UserPlus,
};

const activityColors: Record<ActivityType, string> = {
  note: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  email_sent: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  call: 'bg-green-500/10 text-green-500 border-green-500/20',
  meeting: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  status_change: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  created: 'bg-primary/10 text-primary border-primary/20',
};

export function ActivityTimeline({ activities, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading activities...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No activities yet. Add a note to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        return (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border',
                  activityColors[activity.type]
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 flex-1 bg-border mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {activity.description}
                    </p>
                  )}
                </div>
                <time className="text-xs text-muted-foreground">
                  {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                </time>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
