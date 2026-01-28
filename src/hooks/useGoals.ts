import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalService } from '@/services/goalService';
import type { ProjectGoal } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'goals';

export function useGoals(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => (projectId ? goalService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<ProjectGoal, 'id' | 'createdAt' | 'updatedAt'>) =>
      goalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Goal created', description: 'The goal has been created.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create goal.', variant: 'destructive' });
      console.error('Error creating goal:', error);
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectGoal> }) =>
      goalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Goal updated', description: 'The goal has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update goal.', variant: 'destructive' });
      console.error('Error updating goal:', error);
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => goalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Goal deleted', description: 'The goal has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete goal.', variant: 'destructive' });
      console.error('Error deleting goal:', error);
    },
  });
}
