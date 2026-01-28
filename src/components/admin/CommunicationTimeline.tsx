import { format } from 'date-fns';
import { Mail, Phone, FileText, MessageSquare, CalendarDays } from 'lucide-react';
import type { ClientCommunication, CommunicationType } from '@/types/projects';
import { Badge } from '@/components/ui/badge';

const typeIcons: Record<CommunicationType, typeof Mail> = {
  email: Mail,
  call: Phone,
  note: FileText,
  message: MessageSquare,
  meeting: CalendarDays,
};

const directionColors = {
  inbound: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  outbound: 'bg-green-500/10 text-green-500 border-green-500/20',
  internal: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface CommunicationTimelineProps {
  communications: ClientCommunication[];
  isLoading?: boolean;
}

export function CommunicationTimeline({ communications, isLoading }: CommunicationTimelineProps) {
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading communications...</div>;
  }

  if (communications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No communications yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {communications.map((comm) => {
        const Icon = typeIcons[comm.type] || FileText;
        return (
          <div key={comm.id} className="flex gap-4 p-4 rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {comm.subject && (
                  <span className="font-medium text-foreground">{comm.subject}</span>
                )}
                <Badge variant="outline" className={directionColors[comm.direction]}>
                  {comm.direction}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">{comm.type}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                {comm.content}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {comm.authorName && <span>by {comm.authorName}</span>}
                <span>{format(new Date(comm.createdAt), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
