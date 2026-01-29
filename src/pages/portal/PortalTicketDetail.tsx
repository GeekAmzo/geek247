import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketStatusBadge } from '@/components/admin/TicketStatusBadge';
import { TicketPriorityBadge } from '@/components/admin/TicketPriorityBadge';
import { useTicket, useTicketMessages, useAddTicketMessage } from '@/hooks/useTickets';
import { TICKET_CATEGORIES } from '@/types/tickets';
import { useUserAuth } from '@/contexts/UserAuthContext';

export default function PortalTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useUserAuth();
  const { data: ticket, isLoading: ticketLoading } = useTicket(id);
  const { data: messages, isLoading: messagesLoading } = useTicketMessages(id);
  const addMessage = useAddTicketMessage();

  const [replyContent, setReplyContent] = useState('');

  const handleReply = () => {
    if (!id || !user?.id || !replyContent.trim()) return;
    addMessage.mutate(
      {
        ticketId: id,
        data: {
          ticketId: id,
          authorId: user.id,
          content: replyContent.trim(),
          isInternal: false,
        },
      },
      {
        onSuccess: () => setReplyContent(''),
      }
    );
  };

  // Filter out internal notes for customer view
  const publicMessages = messages?.filter((m) => !m.isInternal) || [];

  if (ticketLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Ticket not found</p>
        <Button variant="outline" onClick={() => navigate('/portal/tickets')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </Button>
      </div>
    );
  }

  const categoryInfo = TICKET_CATEGORIES.find((c) => c.value === ticket.category);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Tickets
        </Link>
        <h1 className="text-2xl font-bold text-foreground">{ticket.subject}</h1>
        <div className="flex items-center gap-3 mt-2">
          <TicketStatusBadge status={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} />
          <span className="text-sm text-muted-foreground">
            {categoryInfo?.label || ticket.category}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ticket Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Description</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Created {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
            {ticket.updatedAt !== ticket.createdAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="w-4 h-4" />
                Updated {format(new Date(ticket.updatedAt), 'MMM d, yyyy h:mm a')}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reply Form */}
          {ticket.status !== 'closed' && (
            <div className="p-6 rounded-xl bg-card border border-border">
              <h2 className="font-semibold text-foreground mb-4">Reply</h2>
              <Textarea
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim() || addMessage.isPending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}

          {/* Message Thread */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-6">Conversation</h2>
            {messagesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : publicMessages.length > 0 ? (
              <div className="space-y-4">
                {publicMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {message.authorName || (message.authorId === user?.id ? profile?.fullName || 'You' : 'Support')}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
