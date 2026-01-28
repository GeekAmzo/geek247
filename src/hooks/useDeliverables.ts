import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliverableService } from '@/services/deliverableService';
import type { ProjectDeliverable } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'deliverables';

export function useDeliverables(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => (projectId ? deliverableService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useCreateDeliverable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<ProjectDeliverable, 'id' | 'createdAt' | 'updatedAt'>) =>
      deliverableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Deliverable created', description: 'The deliverable has been created.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create deliverable.', variant: 'destructive' });
      console.error('Error creating deliverable:', error);
    },
  });
}

export function useUpdateDeliverable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectDeliverable> }) =>
      deliverableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Deliverable updated', description: 'The deliverable has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update deliverable.', variant: 'destructive' });
      console.error('Error updating deliverable:', error);
    },
  });
}

export function useDeleteDeliverable() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deliverableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Deliverable deleted', description: 'The deliverable has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete deliverable.', variant: 'destructive' });
      console.error('Error deleting deliverable:', error);
    },
  });
}
