import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import type { Subscription } from '@/types/subscriptions';
import { format } from 'date-fns';

interface SubscriptionCardProps {
  subscription: Subscription;
}

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

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <Link
      to={`/portal/subscriptions/${subscription.id}`}
      className="block p-6 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">
            {subscription.service?.title || 'Service'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatAmount(subscription.priceAmountCents, subscription.priceCurrency)}
            {subscription.service?.billingInterval === 'monthly' && '/month'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[subscription.status] || ''} variant="outline">
            {subscription.status}
          </Badge>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        Period: {format(new Date(subscription.currentPeriodStart), 'MMM d, yyyy')} —{' '}
        {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
      </div>
    </Link>
  );
}
