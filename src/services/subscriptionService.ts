import type { Subscription, PaymentRecord } from '@/types/subscriptions';
import type { SubscriptionStatus } from '@/types/subscriptions';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToSubscription(row: any): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    serviceId: row.service_id,
    status: row.status,
    paystackSubscriptionCode: row.paystack_subscription_code,
    paystackCustomerCode: row.paystack_customer_code,
    priceAmountCents: row.price_amount_cents,
    priceCurrency: row.price_currency,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    cancelledAt: row.cancelled_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    service: row.services
      ? {
          title: row.services.title,
          slug: row.services.slug,
          billingInterval: row.services.billing_interval,
        }
      : undefined,
  };
}

function dbRowToPayment(row: any): PaymentRecord {
  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    userId: row.user_id,
    paystackReference: row.paystack_reference,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

function getLocalSubscriptions(): Subscription[] {
  return getItem<Subscription[]>(StorageKeys.SUBSCRIPTIONS) || [];
}
function saveLocalSubscriptions(subs: Subscription[]): void {
  setItem(StorageKeys.SUBSCRIPTIONS, subs);
}
function getLocalPayments(): PaymentRecord[] {
  return getItem<PaymentRecord[]>(StorageKeys.PAYMENT_HISTORY) || [];
}
function saveLocalPayments(payments: PaymentRecord[]): void {
  setItem(StorageKeys.PAYMENT_HISTORY, payments);
}

export const subscriptionService = {
  async getAll(userId?: string): Promise<Subscription[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('subscriptions')
          .select('*, services(title, slug, billing_interval)');
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(dbRowToSubscription);
      } catch (err) {
        console.warn('Supabase subscriptions query failed, falling back to localStorage:', err);
      }
    }

    let subs = getLocalSubscriptions();
    if (userId) subs = subs.filter((s) => s.userId === userId);
    return subs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Subscription | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*, services(title, slug, billing_interval)')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw error;
        }
        return data ? dbRowToSubscription(data) : null;
      } catch (err) {
        console.warn('Supabase subscription query failed, falling back to localStorage:', err);
      }
    }

    const subs = getLocalSubscriptions();
    return subs.find((s) => s.id === id) || null;
  },

  async create(data: {
    userId: string;
    serviceId: string;
    paystackSubscriptionCode?: string;
    paystackCustomerCode?: string;
    priceAmountCents: number;
    priceCurrency: 'ZAR' | 'USD';
    currentPeriodStart: string;
    currentPeriodEnd: string;
  }): Promise<Subscription> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: newSub, error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: data.userId,
            service_id: data.serviceId,
            status: 'active',
            paystack_subscription_code: data.paystackSubscriptionCode || null,
            paystack_customer_code: data.paystackCustomerCode || null,
            price_amount_cents: data.priceAmountCents,
            price_currency: data.priceCurrency,
            current_period_start: data.currentPeriodStart,
            current_period_end: data.currentPeriodEnd,
          })
          .select('*, services(title, slug, billing_interval)')
          .single();

        if (error) throw error;
        return dbRowToSubscription(newSub);
      } catch (err) {
        console.warn('Supabase subscription create failed, falling back to localStorage:', err);
      }
    }

    const subs = getLocalSubscriptions();
    const now = new Date().toISOString();
    const newSub: Subscription = {
      id: generateId(),
      userId: data.userId,
      serviceId: data.serviceId,
      status: 'active',
      paystackSubscriptionCode: data.paystackSubscriptionCode || null,
      paystackCustomerCode: data.paystackCustomerCode || null,
      priceAmountCents: data.priceAmountCents,
      priceCurrency: data.priceCurrency,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelledAt: null,
      createdAt: now,
      updatedAt: now,
    };
    subs.push(newSub);
    saveLocalSubscriptions(subs);
    return newSub;
  },

  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const updateData: any = { status };
        if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('id', id)
          .select('*, services(title, slug, billing_interval)')
          .single();

        if (error) throw error;
        return data ? dbRowToSubscription(data) : null;
      } catch (err) {
        console.warn('Supabase subscription update failed, falling back to localStorage:', err);
      }
    }

    const subs = getLocalSubscriptions();
    const index = subs.findIndex((s) => s.id === id);
    if (index === -1) return null;

    subs[index] = {
      ...subs[index],
      status,
      cancelledAt: status === 'cancelled' ? new Date().toISOString() : subs[index].cancelledAt,
      updatedAt: new Date().toISOString(),
    };
    saveLocalSubscriptions(subs);
    return subs[index];
  },

  async getPayments(subscriptionId?: string, userId?: string): Promise<PaymentRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('payment_history').select('*');
        if (subscriptionId) query = query.eq('subscription_id', subscriptionId);
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.order('paid_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(dbRowToPayment);
      } catch (err) {
        console.warn('Supabase payments query failed, falling back to localStorage:', err);
      }
    }

    let payments = getLocalPayments();
    if (subscriptionId) payments = payments.filter((p) => p.subscriptionId === subscriptionId);
    if (userId) payments = payments.filter((p) => p.userId === userId);
    return payments.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());
  },

  async createPayment(data: {
    subscriptionId: string;
    userId: string;
    paystackReference: string;
    amountCents: number;
    currency: 'ZAR' | 'USD';
    paidAt: string;
  }): Promise<PaymentRecord> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: newPayment, error } = await supabase
          .from('payment_history')
          .insert({
            subscription_id: data.subscriptionId,
            user_id: data.userId,
            paystack_reference: data.paystackReference,
            amount_cents: data.amountCents,
            currency: data.currency,
            status: 'success',
            paid_at: data.paidAt,
          })
          .select()
          .single();

        if (error) throw error;
        return dbRowToPayment(newPayment);
      } catch (err) {
        console.warn('Supabase payment create failed, falling back to localStorage:', err);
      }
    }

    const payments = getLocalPayments();
    const newPayment: PaymentRecord = {
      id: generateId(),
      subscriptionId: data.subscriptionId,
      userId: data.userId,
      paystackReference: data.paystackReference,
      amountCents: data.amountCents,
      currency: data.currency,
      status: 'success',
      paidAt: data.paidAt,
      createdAt: new Date().toISOString(),
    };
    payments.push(newPayment);
    saveLocalPayments(payments);
    return newPayment;
  },
};
