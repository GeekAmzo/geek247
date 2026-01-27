import { Link } from 'react-router-dom';
import { CreditCard, ArrowRight, CalendarDays, LayoutGrid, Plus } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useServices } from '@/hooks/useServices';
import { SubscriptionCard } from '@/components/portal/SubscriptionCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortalDashboard() {
  const { user, profile } = useUserAuth();
  const { data: subscriptions, isLoading } = useSubscriptions(user?.id);
  const { data: services } = useServices();

  const activeSubscriptions = subscriptions?.filter((s) => s.status === 'active') || [];
  const subscribedServiceIds = new Set(activeSubscriptions.map((s) => s.serviceId));
  const availableCount = (services || []).filter((s) => !subscribedServiceIds.has(s.id)).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome{profile?.fullName ? `, ${profile.fullName}` : ''}
        </h1>
        <p className="text-muted-foreground">Manage your subscriptions and account</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Subscriptions</span>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-9 w-12" /> : activeSubscriptions.length}
          </p>
        </div>

        <Link
          to="/portal/services"
          className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Available Services</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-foreground">{availableCount}</p>
            <span className="text-xs text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              <Plus className="w-3 h-3" />
              Add
            </span>
          </div>
        </Link>

        <Link
          to="/portal/book-meeting"
          className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Need Help?</span>
          </div>
          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
            Book a consultation
            <ArrowRight className="w-3 h-3" />
          </p>
        </Link>
      </div>

      {/* Active Subscriptions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Subscriptions</h2>
          <Link
            to="/portal/subscriptions"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : activeSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {activeSubscriptions.slice(0, 3).map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-border rounded-lg">
            <p className="text-muted-foreground mb-4">You don't have any active subscriptions yet.</p>
            <Link
              to="/portal/services"
              className="btn-primary-glow px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              Browse Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
