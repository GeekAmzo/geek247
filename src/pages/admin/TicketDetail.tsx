import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Trash2,
  Send,
  Lock,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TicketStatusBadge } from '@/components/admin/TicketStatusBadge';
import { TicketPriorityBadge } from '@/components/admin/TicketPriorityBadge';
import { useTicket, useTicketMessages, useUpdateTicket, useDeleteTicket, useAddTicketMessage } from '@/hooks/useTickets';
import {
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
  type TicketStatus,
  type TicketPriority,
} from '@/types/tickets';
import { useAuth } from '@/contexts/AuthContext';

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ticket, isLoading: ticketLoading } = useTicket(id);
  const { data: messages, isLoading: messagesLoading } = useTicketMessages(id);
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const addMessage = useAddTicketMessage();

  const [replyContent, setReplyContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const handleStatusChange = (status: TicketStatus) => {
    if (id) {
      const data: any = { status };
      if (status === 'closed' || status === 'resolved') {
        data.closedAt = new Date().toISOString();
      }
      updateTicket.mutate({ id, data });
    }
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    if (id) {
      updateTicket.mutate({ id, data: { priority } });
    }
  };

  const handleDelete = () => {
    if (id) {
      deleteTicket.mutate(id, {
        onSuccess: () => navigate('/admin/tickets'),
      });
    }
  };

  const handleReply = () => {
    if (!id || !replyContent.trim()) return;
    addMessage.mutate(
      {
        ticketId: id,
        data: {
          ticketId: id,
          authorId: user?.email || 'admin',
          content: replyContent.trim(),
          isInternal,
        },
      },
      {
        onSuccess: () => {
          setReplyContent('');
          setIsInternal(false);
        },
      }
    );
  };

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
        <Button variant="outline" onClick={() => navigate('/admin/tickets')}>
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
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/admin/tickets"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tickets
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{ticket.subject}</h1>
          <div className="flex items-center gap-3 mt-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
            <span className="text-sm text-muted-foreground">
              {categoryInfo?.label || ticket.category}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={ticket.status} onValueChange={(val) => handleStatusChange(val as TicketStatus)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {TICKET_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ticket.priority} onValueChange={(val) => handlePriorityChange(val as TicketPriority)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {TICKET_PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this ticket? This will also remove all
                  messages. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ticket Info Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Ticket Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Requester</p>
                <p className="text-foreground mt-1">{ticket.userName || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="text-foreground mt-1">{categoryInfo?.label || ticket.category}</p>
              </div>
              {ticket.assigneeName && (
                <div>
                  <p className="text-muted-foreground">Assignee</p>
                  <p className="text-foreground mt-1">{ticket.assigneeName}</p>
                </div>
              )}
            </div>
          </div>

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
            {ticket.closedAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Calendar className="w-4 h-4" />
                Closed {format(new Date(ticket.closedAt), 'MMM d, yyyy h:mm a')}
              </div>
            )}
          </div>
        </motion.div>

        {/* Messages Thread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Reply Form */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Reply</h2>
            <Textarea
              placeholder={isInternal ? 'Add an internal note...' : 'Type your reply...'}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between mt-4">
              <Button
                variant={isInternal ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsInternal(!isInternal)}
              >
                <Lock className="w-4 h-4 mr-2" />
                {isInternal ? 'Internal Note' : 'Public Reply'}
              </Button>
              <Button
                onClick={handleReply}
                disabled={!replyContent.trim() || addMessage.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {isInternal ? 'Add Note' : 'Send Reply'}
              </Button>
            </div>
          </div>

          {/* Message Thread */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-6">Conversation</h2>
            {messagesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            ) : messages && messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${
                      message.isInternal
                        ? 'border-yellow-500/20 bg-yellow-500/5'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {message.authorName || message.authorId}
                        </span>
                        {message.isInternal && (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" />
                            Internal
                          </span>
                        )}
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
        </motion.div>
      </div>
    </div>
  );
};

export default TicketDetail;
