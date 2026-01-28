import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Subscription } from '@/types/subscriptions';

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  trialing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  past_due: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
};

interface SubscriptionMiniCardProps {
  subscription: Subscription;
}

function formatPrice(cents: number, currency: string): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency }).format(amount);
}

export function SubscriptionMiniCard({ subscription }: SubscriptionMiniCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm text-foreground truncate">
          {subscription.service?.title || 'Subscription'}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(subscription.priceAmountCents, subscription.priceCurrency)}
          </span>
          {subscription.service?.billingInterval && (
            <span className="text-xs text-muted-foreground">
              / {subscription.service.billingInterval}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Renews {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn('shrink-0 ml-3', statusColors[subscription.status])}
      >
        {subscription.status}
      </Badge>
    </div>
  );
}
