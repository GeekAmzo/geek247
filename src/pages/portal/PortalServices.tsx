import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useServices } from '@/hooks/useServices';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { ServicePriceDisplay } from '@/components/ServicePriceDisplay';
import { CheckoutDialog } from '@/components/checkout/CheckoutDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Service } from '@/types/services';

export default function PortalServices() {
  const { user } = useUserAuth();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions(user?.id);
  const [checkoutService, setCheckoutService] = useState<Service | null>(null);

  const isLoading = servicesLoading || subsLoading;

  const subscribedServiceIds = new Set(
    (subscriptions || [])
      .filter((s) => s.status === 'active')
      .map((s) => s.serviceId)
  );

  const availableServices = (services || []).filter(
    (s) => !subscribedServiceIds.has(s.id)
  );
  const activeServices = (services || []).filter(
    (s) => subscribedServiceIds.has(s.id)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground">
          Browse available services and manage your subscriptions
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          {/* Active Services */}
          {activeServices.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Your Active Services
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {activeServices.map((service) => {
                  const sub = (subscriptions || []).find(
                    (s) => s.serviceId === service.id && s.status === 'active'
                  );
                  return (
                    <div
                      key={service.id}
                      className="p-6 rounded-xl border border-primary/30 bg-primary/5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-foreground">{service.title}</h3>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.shortDescription}
                      </p>
                      {sub && (
                        <Link
                          to={`/portal/subscriptions/${sub.id}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          View subscription
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Services */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {activeServices.length > 0 ? 'Add More Services' : 'Available Services'}
            </h2>
            {availableServices.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {availableServices.map((service) => (
                  <div
                    key={service.id}
                    className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-end justify-between">
                      <ServicePriceDisplay
                        zarMinCents={service.pricingZarMinCents}
                        zarMaxCents={service.pricingZarMaxCents}
                        usdMinCents={service.pricingUsdMinCents}
                        usdMaxCents={service.pricingUsdMaxCents}
                        billingInterval={service.billingInterval}
                        size="sm"
                      />
                      <div className="flex gap-2">
                        <Link
                          to={`/services/${service.slug}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Details
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => setCheckoutService(service)}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-border rounded-lg">
                <p className="text-muted-foreground">
                  You're subscribed to all available services.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {checkoutService && (
        <CheckoutDialog
          open={!!checkoutService}
          onOpenChange={(open) => !open && setCheckoutService(null)}
          service={checkoutService}
        />
      )}
    </div>
  );
}
