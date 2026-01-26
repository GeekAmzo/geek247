import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/activityService';
import type { ActivityType } from '@/types/crm';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'activities';

export function useActivities(leadId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, leadId],
    queryFn: () => (leadId ? activityService.getByLeadId(leadId) : []),
    enabled: !!leadId,
  });
}

export function useRecentActivities(limit: number = 10) {
  return useQuery({
    queryKey: [QUERY_KEY, 'recent', limit],
    queryFn: () => activityService.getRecent(limit),
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: {
      leadId: string;
      type: ActivityType;
      title: string;
      description?: string;
    }) => activityService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.leadId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'recent'] });
      toast({
        title: 'Activity added',
        description: 'The activity has been logged.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add activity.',
        variant: 'destructive',
      });
      console.error('Error creating activity:', error);
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, leadId }: { id: string; leadId: string }) =>
      activityService.delete(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.leadId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'recent'] });
      toast({
        title: 'Activity deleted',
        description: 'The activity has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete activity.',
        variant: 'destructive',
      });
      console.error('Error deleting activity:', error);
    },
  });
}
