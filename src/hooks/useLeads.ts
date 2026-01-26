import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import type { Lead, LeadFilters, LeadStatus } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'leads';

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => leadService.getAll(filters),
  });
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => (id ? leadService.getById(id) : null),
    enabled: !!id,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: [QUERY_KEY, 'stats'],
    queryFn: () => leadService.getStats(),
  });
}

export function useRecentLeads(limit: number = 5) {
  return useQuery({
    queryKey: [QUERY_KEY, 'recent', limit],
    queryFn: () => leadService.getRecent(limit),
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>) =>
      leadService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Success!',
        description: 'Your inquiry has been submitted. We\'ll be in touch soon.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating lead:', error);
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      leadService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Lead updated',
        description: 'The lead has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update lead.',
        variant: 'destructive',
      });
      console.error('Error updating lead:', error);
    },
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      leadService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Status updated',
        description: 'The lead status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
      console.error('Error updating status:', error);
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({
        title: 'Lead deleted',
        description: 'The lead has been deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete lead.',
        variant: 'destructive',
      });
      console.error('Error deleting lead:', error);
    },
  });
}
