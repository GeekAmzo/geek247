import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TICKET_CATEGORIES, TICKET_PRIORITIES, type TicketCategory, type TicketPriority } from '@/types/tickets';
import { useCreateTicket } from '@/hooks/useTickets';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';

export default function PortalNewTicket() {
  const navigate = useNavigate();
  const { user, profile } = useUserAuth();
  const createTicket = useCreateTicket();

  const { data: clients } = useClients();
  const userClient = clients?.find((c) => c.userProfileId === user?.id);
  const { data: projects } = useProjects(userClient ? { clientId: userClient.id } : undefined);

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('general');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [projectId, setProjectId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !subject.trim() || !description.trim()) return;

    createTicket.mutate(
      {
        subject: subject.trim(),
        description: description.trim(),
        status: 'open',
        priority,
        category,
        userId: user.id,
        projectId: projectId || undefined,
        userName: profile?.fullName || undefined,
      },
      {
        onSuccess: (ticket) => {
          navigate(`/portal/tickets/${ticket.id}`);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/portal/tickets"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Tickets
        </Link>
        <h1 className="text-2xl font-bold text-foreground">New Support Ticket</h1>
        <p className="text-muted-foreground mt-1">Describe your issue and we'll get back to you</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="p-6 rounded-xl bg-card border border-border space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Brief summary of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as TicketCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as TicketPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TICKET_PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {projects && projects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="project">Related Project (optional)</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={createTicket.isPending}>
            {createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/portal/tickets')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
