import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionCard } from '@/components/portal/SubscriptionCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortalSubscriptions() {
  const { user } = useUserAuth();
  const { data: subscriptions, isLoading } = useSubscriptions(user?.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Subscriptions</h1>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : subscriptions && subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">You don't have any subscriptions yet.</p>
          <Link
            to="/services"
            className="btn-primary-glow px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            Browse Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
