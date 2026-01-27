import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAllSubscriptions } from '@/hooks/useSubscriptions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  past_due: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  trialing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

function formatAmount(cents: number, currency: string): string {
  const amount = cents / 100;
  if (currency === 'ZAR') return `R${amount.toLocaleString('en-ZA')}`;
  return `$${amount.toLocaleString('en-US')}`;
}

export default function AdminSubscriptionList() {
  const { data: subscriptions, isLoading } = useAllSubscriptions();

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
      <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions && subscriptions.length > 0 ? (
              subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    {sub.service?.title || sub.serviceId}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{sub.userId.slice(0, 8)}...</TableCell>
                  <TableCell>
                    {formatAmount(sub.priceAmountCents, sub.priceCurrency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[sub.status] || ''} variant="outline">
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(sub.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/admin/subscriptions/${sub.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No subscriptions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
