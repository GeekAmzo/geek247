import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskCommentService } from '@/services/taskCommentService';
import type { TaskComment } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'task-comments';

export function useTaskComments(taskId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, taskId],
    queryFn: () => (taskId ? taskCommentService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useCreateTaskComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<TaskComment, 'id' | 'createdAt' | 'updatedAt' | 'authorName'>) =>
      taskCommentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Comment added', description: 'Your comment has been added.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to add comment.', variant: 'destructive' });
      console.error('Error creating comment:', error);
    },
  });
}

export function useDeleteTaskComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => taskCommentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Comment deleted', description: 'The comment has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete comment.', variant: 'destructive' });
      console.error('Error deleting comment:', error);
    },
  });
}
