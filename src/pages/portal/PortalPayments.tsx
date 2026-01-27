import { useUserAuth } from '@/contexts/UserAuthContext';
import { usePayments } from '@/hooks/useSubscriptions';
import { PaymentHistoryTable } from '@/components/portal/PaymentHistoryTable';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortalPayments() {
  const { user } = useUserAuth();
  const { data: payments, isLoading } = usePayments(undefined, user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Payment History</h1>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <PaymentHistoryTable payments={payments || []} />
      )}
    </div>
  );
}
