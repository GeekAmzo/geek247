import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '@/services/clientService';
import type { Client, ClientFilters } from '@/types/clients';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'clients';

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => clientService.getAll(filters),
  });
}

export function useClient(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => (id ? clientService.getById(id) : null),
    enabled: !!id,
  });
}

export function useClientByLeadId(leadId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'lead', leadId],
    queryFn: () => (leadId ? clientService.getByLeadId(leadId) : null),
    enabled: !!leadId,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) =>
      clientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Client created', description: 'The client has been created successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create client.', variant: 'destructive' });
      console.error('Error creating client:', error);
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      clientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Client updated', description: 'The client has been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update client.', variant: 'destructive' });
      console.error('Error updating client:', error);
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Client deleted', description: 'The client has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete client.', variant: 'destructive' });
      console.error('Error deleting client:', error);
    },
  });
}
