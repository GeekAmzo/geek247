import { Users, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProjectMember } from '@/types/projects';

interface ProjectMembersListProps {
  members: ProjectMember[];
  onRemove?: (memberId: string) => void;
}

export function ProjectMembersList({ members, onRemove }: ProjectMembersListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No team members assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {(member.userName || member.userEmail || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{member.userName || member.userEmail || 'Unknown'}</p>
              {member.userEmail && (
                <p className="text-xs text-muted-foreground">{member.userEmail}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {member.role}
            </Badge>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(member.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
