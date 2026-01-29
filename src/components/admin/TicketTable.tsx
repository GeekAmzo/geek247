import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import type { Ticket } from '@/types/tickets';
import { TICKET_CATEGORIES } from '@/types/tickets';
import { ArrowRight } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No tickets found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => {
          const categoryInfo = TICKET_CATEGORIES.find((c) => c.value === ticket.category);
          return (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium max-w-[300px] truncate">
                {ticket.subject}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {ticket.userName || 'Unknown'}
              </TableCell>
              <TableCell>
                <TicketStatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <TicketPriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {categoryInfo?.label || ticket.category}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Link
                  to={`/admin/tickets/${ticket.id}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
