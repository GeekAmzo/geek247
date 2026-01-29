import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { TicketStatusBadge } from '@/components/admin/TicketStatusBadge';
import { TicketPriorityBadge } from '@/components/admin/TicketPriorityBadge';
import { TICKET_CATEGORIES } from '@/types/tickets';
import type { Ticket } from '@/types/tickets';

interface PortalTicketCardProps {
  ticket: Ticket;
}

export function PortalTicketCard({ ticket }: PortalTicketCardProps) {
  const categoryInfo = TICKET_CATEGORIES.find((c) => c.value === ticket.category);

  return (
    <Link
      to={`/portal/tickets/${ticket.id}`}
      className="block p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {ticket.subject}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {categoryInfo?.label || ticket.category}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-4 flex-shrink-0 mt-1" />
      </div>
      <div className="flex items-center gap-3 mt-4">
        <TicketStatusBadge status={ticket.status} />
        <TicketPriorityBadge priority={ticket.priority} />
        <span className="text-xs text-muted-foreground ml-auto">
          Updated {format(new Date(ticket.updatedAt), 'MMM d, yyyy')}
        </span>
      </div>
    </Link>
  );
}
