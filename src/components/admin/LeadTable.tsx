import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal, Eye, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LeadStatusBadge } from './LeadStatusBadge';
import { type Lead } from '@/types/crm';
import { useState } from 'react';
import { useDeleteLead } from '@/hooks/useLeads';

interface LeadTableProps {
  leads: Lead[];
  isLoading?: boolean;
}

export function LeadTable({ leads, isLoading }: LeadTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteLead = useDeleteLead();

  const handleDelete = () => {
    if (deleteId) {
      deleteLead.mutate(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          Loading leads...
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          No leads found. Try adjusting your filters.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link
                    to={`/admin/leads/${lead.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {lead.firstName} {lead.lastName}
                  </Link>
                  <p className="text-sm text-muted-foreground">{lead.email}</p>
                </TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>
                  <LeadStatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="capitalize">
                  {lead.source.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/leads/${lead.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(lead.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this lead and all associated activities.
              This action cannot be undone.
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
    </>
  );
}
