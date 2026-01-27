import type { Service, ServiceInsert, ServiceUpdate } from '@/types/services';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { defaultServices } from './seedData';

function dbRowToService(row: any): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    featuresIncluded: row.features_included || [],
    featuresNotIncluded: row.features_not_included || [],
    faqs: row.faqs || [],
    pricingZarMinCents: row.pricing_zar_min_cents,
    pricingZarMaxCents: row.pricing_zar_max_cents,
    pricingUsdMinCents: row.pricing_usd_min_cents,
    pricingUsdMaxCents: row.pricing_usd_max_cents,
    billingInterval: row.billing_interval,
    paystackPlanCodeZar: row.paystack_plan_code_zar,
    paystackPlanCodeUsd: row.paystack_plan_code_usd,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function serviceToDbRow(service: Partial<ServiceInsert>) {
  const row: any = {};
  if (service.slug !== undefined) row.slug = service.slug;
  if (service.title !== undefined) row.title = service.title;
  if (service.shortDescription !== undefined) row.short_description = service.shortDescription;
  if (service.longDescription !== undefined) row.long_description = service.longDescription;
  if (service.featuresIncluded !== undefined) row.features_included = service.featuresIncluded;
  if (service.featuresNotIncluded !== undefined) row.features_not_included = service.featuresNotIncluded;
  if (service.faqs !== undefined) row.faqs = service.faqs;
  if (service.pricingZarMinCents !== undefined) row.pricing_zar_min_cents = service.pricingZarMinCents;
  if (service.pricingZarMaxCents !== undefined) row.pricing_zar_max_cents = service.pricingZarMaxCents;
  if (service.pricingUsdMinCents !== undefined) row.pricing_usd_min_cents = service.pricingUsdMinCents;
  if (service.pricingUsdMaxCents !== undefined) row.pricing_usd_max_cents = service.pricingUsdMaxCents;
  if (service.billingInterval !== undefined) row.billing_interval = service.billingInterval;
  if (service.paystackPlanCodeZar !== undefined) row.paystack_plan_code_zar = service.paystackPlanCodeZar;
  if (service.paystackPlanCodeUsd !== undefined) row.paystack_plan_code_usd = service.paystackPlanCodeUsd;
  if (service.isActive !== undefined) row.is_active = service.isActive;
  if (service.sortOrder !== undefined) row.sort_order = service.sortOrder;
  return row;
}

function getLocalServices(): Service[] {
  const stored = getItem<Service[]>(StorageKeys.SERVICES);
  if (stored && stored.length > 0) return stored;
  // Auto-seed with defaults on first access
  setItem(StorageKeys.SERVICES, defaultServices);
  return defaultServices;
}

function saveLocalServices(services: Service[]): void {
  setItem(StorageKeys.SERVICES, services);
}

export const serviceService = {
  async getAll(activeOnly = true): Promise<Service[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('services').select('*');
        if (activeOnly) query = query.eq('is_active', true);
        const { data, error } = await query.order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) return data.map(dbRowToService);
      } catch (err) {
        console.warn('Supabase services query failed, falling back to localStorage:', err);
      }
    }

    let services = getLocalServices();
    if (activeOnly) services = services.filter((s) => s.isActive);
    return services.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getBySlug(slug: string): Promise<Service | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw error;
        }
        return data ? dbRowToService(data) : null;
      } catch (err) {
        console.warn('Supabase service query failed, falling back to localStorage:', err);
      }
    }

    const services = getLocalServices();
    return services.find((s) => s.slug === slug) || null;
  },

  async getById(id: string): Promise<Service | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') return null;
          throw error;
        }
        return data ? dbRowToService(data) : null;
      } catch (err) {
        console.warn('Supabase service query failed, falling back to localStorage:', err);
      }
    }

    const services = getLocalServices();
    return services.find((s) => s.id === id) || null;
  },

  async create(data: ServiceInsert): Promise<Service> {
    if (isSupabaseConfigured && supabase) {
      const { data: newService, error } = await supabase
        .from('services')
        .insert(serviceToDbRow(data))
        .select()
        .single();

      if (error) {
        console.error('Error creating service:', error);
        throw error;
      }
      return dbRowToService(newService);
    }

    const services = getLocalServices();
    const now = new Date().toISOString();
    const newService: Service = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    services.push(newService);
    saveLocalServices(services);
    return newService;
  },

  async update(id: string, data: ServiceUpdate): Promise<Service | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: updated, error } = await supabase
        .from('services')
        .update(serviceToDbRow(data))
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        throw error;
      }
      return updated ? dbRowToService(updated) : null;
    }

    const services = getLocalServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const updated: Service = {
      ...services[index],
      ...data,
      id: services[index].id,
      createdAt: services[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    services[index] = updated;
    saveLocalServices(services);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        console.error('Error deleting service:', error);
        throw error;
      }
      return true;
    }

    const services = getLocalServices();
    const filtered = services.filter((s) => s.id !== id);
    if (filtered.length === services.length) return false;
    saveLocalServices(filtered);
    return true;
  },
};
