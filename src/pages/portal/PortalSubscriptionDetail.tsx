import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSubscription, useCancelSubscription, usePayments } from '@/hooks/useSubscriptions';
import { PaymentHistoryTable } from '@/components/portal/PaymentHistoryTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

export default function PortalSubscriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: subscription, isLoading } = useSubscription(id);
  const { data: payments, isLoading: paymentsLoading } = usePayments(id);
  const cancelSubscription = useCancelSubscription();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Subscription not found.</p>
        <Link to="/portal/subscriptions" className="text-primary hover:underline">
          Back to Subscriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        to="/portal/subscriptions"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subscriptions
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {subscription.service?.title || 'Subscription'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {formatAmount(subscription.priceAmountCents, subscription.priceCurrency)}
            {subscription.service?.billingInterval === 'monthly' && '/month'}
          </p>
        </div>
        <Badge className={statusColors[subscription.status] || ''} variant="outline">
          {subscription.status}
        </Badge>
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border border-border bg-card space-y-4">
          <h2 className="font-semibold text-foreground">Subscription Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground capitalize">{subscription.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Period</span>
              <span className="text-foreground">
                {format(new Date(subscription.currentPeriodStart), 'MMM d')} —{' '}
                {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started</span>
              <span className="text-foreground">
                {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            {subscription.cancelledAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cancelled</span>
                <span className="text-foreground">
                  {format(new Date(subscription.cancelledAt), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {subscription.status === 'active' && (
          <div className="p-6 rounded-lg border border-border bg-card space-y-4">
            <h2 className="font-semibold text-foreground">Actions</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will be cancelled. You'll retain access until the end of your
                    current billing period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => cancelSubscription.mutate(subscription.id)}
                  >
                    Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Payment History</h2>
        {paymentsLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <PaymentHistoryTable payments={payments || []} />
        )}
      </div>
    </div>
  );
}
