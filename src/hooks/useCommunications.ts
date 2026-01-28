import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationService } from '@/services/communicationService';
import type { ClientCommunication } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'communications';

export function useClientCommunications(clientId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'client', clientId],
    queryFn: () => (clientId ? communicationService.getByClient(clientId) : []),
    enabled: !!clientId,
  });
}

export function useProjectCommunications(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'project', projectId],
    queryFn: () => (projectId ? communicationService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useCreateCommunication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<ClientCommunication, 'id' | 'createdAt' | 'authorName'>) =>
      communicationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Communication logged', description: 'The communication has been recorded.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to log communication.', variant: 'destructive' });
      console.error('Error creating communication:', error);
    },
  });
}
