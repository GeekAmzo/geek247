import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { milestoneService } from '@/services/milestoneService';
import type { ProjectMilestone } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'milestones';

export function useMilestones(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => (projectId ? milestoneService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<ProjectMilestone, 'id' | 'createdAt' | 'updatedAt'>) =>
      milestoneService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Milestone created', description: 'The milestone has been created.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create milestone.', variant: 'destructive' });
      console.error('Error creating milestone:', error);
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectMilestone> }) =>
      milestoneService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Milestone updated', description: 'The milestone has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update milestone.', variant: 'destructive' });
      console.error('Error updating milestone:', error);
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => milestoneService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Milestone deleted', description: 'The milestone has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete milestone.', variant: 'destructive' });
      console.error('Error deleting milestone:', error);
    },
  });
}
