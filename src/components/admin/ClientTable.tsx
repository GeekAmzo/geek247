import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClientStatusBadge } from './ClientStatusBadge';
import type { Client } from '@/types/clients';
import { ArrowRight } from 'lucide-react';

interface ClientTableProps {
  clients: Client[];
  projectCounts?: Record<string, number>;
}

export function ClientTable({ clients, projectCounts }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No clients found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Projects</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.companyName}</TableCell>
            <TableCell>{client.contactName}</TableCell>
            <TableCell className="text-muted-foreground">{client.email}</TableCell>
            <TableCell>
              <ClientStatusBadge status={client.status} />
            </TableCell>
            <TableCell>{projectCounts?.[client.id] ?? 0}</TableCell>
            <TableCell>
              <Link
                to={`/admin/clients/${client.id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
