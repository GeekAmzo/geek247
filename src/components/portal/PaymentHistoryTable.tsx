import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PaymentRecord } from '@/types/subscriptions';
import { format } from 'date-fns';

interface PaymentHistoryTableProps {
  payments: PaymentRecord[];
}

function formatAmount(cents: number, currency: string): string {
  const amount = cents / 100;
  if (currency === 'ZAR') return `R${amount.toLocaleString('en-ZA')}`;
  return `$${amount.toLocaleString('en-US')}`;
}

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  success: 'default',
  pending: 'secondary',
  failed: 'destructive',
};

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  if (payments.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">No payment history yet.</p>
    );
  }

  return (
    <div className="border border-border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{format(new Date(payment.paidAt), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {payment.paystackReference}
              </TableCell>
              <TableCell>{formatAmount(payment.amountCents, payment.currency)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[payment.status] || 'secondary'}>
                  {payment.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
