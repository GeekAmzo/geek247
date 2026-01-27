import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ServicePriceDisplay } from '@/components/ServicePriceDisplay';
import { AgreementCheckbox } from './AgreementCheckbox';
import { PaystackButton } from './PaystackButton';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useCreateSubscription, useCreatePayment } from '@/hooks/useSubscriptions';
import { legalService } from '@/services/legalService';
import { paystackService } from '@/services/paystackService';
import { useCurrency } from '@/contexts/CurrencyContext';
import type { Service } from '@/types/services';
import type { PaystackResponse } from '@/services/paystackService';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
}

export function CheckoutDialog({ open, onOpenChange, service }: CheckoutDialogProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserAuth();
  const { currency } = useCurrency();
  const createSubscription = useCreateSubscription();
  const createPayment = useCreatePayment();

  const [agreeTos, setAgreeTos] = useState(false);
  const [agreeSla, setAgreeSla] = useState(false);
  const [errors, setErrors] = useState<{ tos?: string; sla?: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const priceCents = currency === 'ZAR' ? service.pricingZarMinCents : service.pricingUsdMinCents;
  const planCode =
    currency === 'ZAR' ? service.paystackPlanCodeZar : service.paystackPlanCodeUsd;

  const validateAgreements = (): boolean => {
    const newErrors: { tos?: string; sla?: string } = {};
    if (!agreeTos) newErrors.tos = 'You must agree to the Terms of Service';
    if (!agreeSla) newErrors.sla = 'You must agree to the Service Level Agreement';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSignInRedirect = () => {
    onOpenChange(false);
    navigate('/login', { state: { from: { pathname: `/services/${service.slug}` } } });
  };

  const completeSubscription = async (reference: string) => {
    if (!user) return;

    const now = new Date();
    const periodEnd = new Date(now);
    if (service.billingInterval === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      // once_off or custom: set a far-future end date
      periodEnd.setFullYear(periodEnd.getFullYear() + 99);
    }

    setIsProcessing(true);
    try {
      // Create subscription
      const subscription = await createSubscription.mutateAsync({
        userId: user.id,
        serviceId: service.id,
        paystackSubscriptionCode: reference,
        priceAmountCents: priceCents,
        priceCurrency: currency,
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
      });

      // Record payment
      await createPayment.mutateAsync({
        subscriptionId: subscription.id,
        userId: user.id,
        paystackReference: reference,
        amountCents: priceCents,
        currency,
        paidAt: now.toISOString(),
      });

      // Record agreements
      const [tosDoc, slaDoc] = await Promise.all([
        legalService.getActiveDocument('tos'),
        legalService.getActiveDocument('sla'),
      ]);

      const agreementPromises = [];
      if (tosDoc) {
        agreementPromises.push(
          legalService.createAgreement({
            userId: user.id,
            documentId: tosDoc.id,
            subscriptionId: subscription.id,
          })
        );
      }
      if (slaDoc) {
        agreementPromises.push(
          legalService.createAgreement({
            userId: user.id,
            documentId: slaDoc.id,
            subscriptionId: subscription.id,
          })
        );
      }
      await Promise.all(agreementPromises);

      onOpenChange(false);
      navigate(`/portal/subscriptions/${subscription.id}`);
    } catch (err) {
      console.error('Error completing checkout:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackSuccess = async (response: PaystackResponse) => {
    await completeSubscription(response.reference);
  };

  const handleDirectSubscribe = async () => {
    if (!validateAgreements()) return;
    const reference = `direct-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    await completeSubscription(reference);
  };

  const canPay = agreeTos && agreeSla && isAuthenticated;
  const paystackAvailable = paystackService.isConfigured();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Subscribe to {service.title}</DialogTitle>
          <DialogDescription>
            Review your subscription details and complete payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Subscription price</p>
            <ServicePriceDisplay
              zarMinCents={service.pricingZarMinCents}
              zarMaxCents={null}
              usdMinCents={service.pricingUsdMinCents}
              usdMaxCents={null}
              billingInterval={service.billingInterval}
              size="md"
            />
          </div>

          {/* Agreements */}
          <div className="space-y-3">
            <AgreementCheckbox
              id="tos"
              type="tos"
              checked={agreeTos}
              onCheckedChange={setAgreeTos}
              error={errors.tos}
            />
            <AgreementCheckbox
              id="sla"
              type="sla"
              checked={agreeSla}
              onCheckedChange={setAgreeSla}
              error={errors.sla}
            />
          </div>

          {/* Action */}
          {!isAuthenticated ? (
            <Button onClick={handleSignInRedirect} className="w-full">
              Sign in to Subscribe
            </Button>
          ) : paystackAvailable ? (
            <div className="space-y-2">
              <PaystackButton
                email={user!.email}
                amountCents={priceCents}
                currency={currency}
                planCode={planCode || undefined}
                metadata={{ serviceId: service.id, serviceName: service.title }}
                onSuccess={handlePaystackSuccess}
                onClose={() => {}}
                disabled={!canPay || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay & Subscribe'}
              </PaystackButton>
              {!canPay && (
                <p className="text-xs text-muted-foreground text-center">
                  Please agree to both agreements to continue
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={handleDirectSubscribe}
                disabled={!canPay || isProcessing}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Subscribe Now'}
              </Button>
              {!canPay && (
                <p className="text-xs text-muted-foreground text-center">
                  Please agree to both agreements to continue
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
