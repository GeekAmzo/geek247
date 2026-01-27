import { useAllAgreements } from '@/hooks/useLegalDocuments';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default function AdminUserAgreements() {
  const { data: agreements, isLoading } = useAllAgreements();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">User Agreements</h1>

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Agreed At</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agreements && agreements.length > 0 ? (
              agreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell className="text-muted-foreground">
                    {agreement.userEmail || agreement.userId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {agreement.document?.title || agreement.documentId}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {agreement.document?.type?.toUpperCase() || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell>{agreement.document?.version || '—'}</TableCell>
                  <TableCell>
                    {format(new Date(agreement.agreedAt), 'MMM d, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {agreement.ipAddress || '—'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No agreements recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
