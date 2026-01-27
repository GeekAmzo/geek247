import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';
import type { SubscriptionStatus } from '@/types/subscriptions';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'subscriptions';
const PAYMENTS_KEY = 'payments';

export function useSubscriptions(userId?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, userId],
    queryFn: () => subscriptionService.getAll(userId),
    enabled: !!userId,
  });
}

export function useAllSubscriptions() {
  return useQuery({
    queryKey: [QUERY_KEY, 'all'],
    queryFn: () => subscriptionService.getAll(),
  });
}

export function useSubscription(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => (id ? subscriptionService.getById(id) : null),
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      serviceId: string;
      paystackSubscriptionCode?: string;
      paystackCustomerCode?: string;
      priceAmountCents: number;
      priceCurrency: 'ZAR' | 'USD';
      currentPeriodStart: string;
      currentPeriodEnd: string;
    }) => subscriptionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Subscribed!',
        description: 'Your subscription has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create subscription.',
        variant: 'destructive',
      });
      console.error('Error creating subscription:', error);
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => subscriptionService.updateStatus(id, 'cancelled'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription has been cancelled.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription.',
        variant: 'destructive',
      });
      console.error('Error cancelling subscription:', error);
    },
  });
}

export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubscriptionStatus }) =>
      subscriptionService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Status updated', description: 'The subscription status has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
      console.error('Error updating status:', error);
    },
  });
}

export function usePayments(subscriptionId?: string, userId?: string) {
  return useQuery({
    queryKey: [PAYMENTS_KEY, subscriptionId, userId],
    queryFn: () => subscriptionService.getPayments(subscriptionId, userId),
    enabled: !!subscriptionId || !!userId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      subscriptionId: string;
      userId: string;
      paystackReference: string;
      amountCents: number;
      currency: 'ZAR' | 'USD';
      paidAt: string;
    }) => subscriptionService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYMENTS_KEY] });
    },
  });
}
