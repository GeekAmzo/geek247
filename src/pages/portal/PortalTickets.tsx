import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PortalTicketCard } from '@/components/portal/PortalTicketCard';
import { useUserTickets } from '@/hooks/useTickets';
import { useUserAuth } from '@/contexts/UserAuthContext';

export default function PortalTickets() {
  const { user } = useUserAuth();
  const { data: tickets, isLoading } = useUserTickets(user?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
        <Link to="/portal/tickets/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <PortalTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">You don't have any support tickets yet.</p>
          <Link
            to="/portal/tickets/new"
            className="btn-primary-glow px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            Create a Ticket
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
