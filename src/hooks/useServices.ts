import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '@/services/serviceService';
import type { ServiceInsert, ServiceUpdate } from '@/types/services';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'services';

export function useServices(activeOnly = true) {
  return useQuery({
    queryKey: [QUERY_KEY, { activeOnly }],
    queryFn: () => serviceService.getAll(activeOnly),
  });
}

export function useService(slug: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'slug', slug],
    queryFn: () => (slug ? serviceService.getBySlug(slug) : null),
    enabled: !!slug,
  });
}

export function useServiceById(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'id', id],
    queryFn: () => (id ? serviceService.getById(id) : null),
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ServiceInsert) => serviceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Service created', description: 'The service has been created successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create service.', variant: 'destructive' });
      console.error('Error creating service:', error);
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceUpdate }) =>
      serviceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Service updated', description: 'The service has been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update service.', variant: 'destructive' });
      console.error('Error updating service:', error);
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => serviceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Service deleted', description: 'The service has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete service.', variant: 'destructive' });
      console.error('Error deleting service:', error);
    },
  });
}
