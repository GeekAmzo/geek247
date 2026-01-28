import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, User } from 'lucide-react';
import type { ClientCommunication } from '@/types/projects';

interface PortalCommunicationThreadProps {
  communications: ClientCommunication[];
  onSendMessage: (content: string) => void;
  isSending?: boolean;
}

export function PortalCommunicationThread({
  communications,
  onSendMessage,
  isSending,
}: PortalCommunicationThreadProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <div className="space-y-4">
      {communications.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {[...communications].reverse().map((comm) => (
            <div key={comm.id} className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {comm.authorName || 'Team'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comm.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
              {comm.subject && (
                <p className="text-sm font-medium text-foreground">{comm.subject}</p>
              )}
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comm.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground text-sm">
          No messages yet. Send a message to start a conversation.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!message.trim() || isSending}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
