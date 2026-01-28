import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectMemberService } from '@/services/projectMemberService';
import type { ProjectMemberRole } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'project-members';

export function useProjectMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => (projectId ? projectMemberService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useAddProjectMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ projectId, userId, role }: { projectId: string; userId: string; role?: ProjectMemberRole }) =>
      projectMemberService.addMember(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Member added', description: 'Team member has been added to the project.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to add member.', variant: 'destructive' });
      console.error('Error adding member:', error);
    },
  });
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (memberId: string) => projectMemberService.removeMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Member removed', description: 'Team member has been removed from the project.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to remove member.', variant: 'destructive' });
      console.error('Error removing member:', error);
    },
  });
}
