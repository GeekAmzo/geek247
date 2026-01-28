import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import type { ProjectTask, TaskStatus } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'tasks';

export function useTasks(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => (projectId ? taskService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => (id ? taskService.getById(id) : null),
    enabled: !!id,
  });
}

export function useKanbanBoard(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'kanban', projectId],
    queryFn: () => (projectId ? taskService.getKanbanBoard(projectId) : null),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt' | 'assigneeName' | 'commentCount'>) =>
      taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Task created', description: 'The task has been created successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create task.', variant: 'destructive' });
      console.error('Error creating task:', error);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectTask> }) =>
      taskService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Task updated', description: 'The task has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update task.', variant: 'destructive' });
      console.error('Error updating task:', error);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Task deleted', description: 'The task has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete task.', variant: 'destructive' });
      console.error('Error deleting task:', error);
    },
  });
}

export function useReorderTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, newStatus, newPosition }: { taskId: string; newStatus: TaskStatus; newPosition: number }) =>
      taskService.reorder(taskId, newStatus, newPosition),
    onMutate: async ({ taskId, newStatus, newPosition }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] });

      const previousData = queryClient.getQueriesData({ queryKey: [QUERY_KEY] });

      queryClient.setQueriesData({ queryKey: [QUERY_KEY, 'kanban'] }, (old: any) => {
        if (!old) return old;
        const newBoard = { ...old };
        // Remove task from all columns
        Object.keys(newBoard).forEach((status) => {
          newBoard[status] = newBoard[status].filter((t: ProjectTask) => t.id !== taskId);
        });
        // Find the task data from previous state
        let taskData: ProjectTask | undefined;
        Object.values(old).forEach((tasks: any) => {
          const found = tasks.find((t: ProjectTask) => t.id === taskId);
          if (found) taskData = found;
        });
        if (taskData) {
          const updatedTask = { ...taskData, status: newStatus, position: newPosition };
          newBoard[newStatus] = [...newBoard[newStatus], updatedTask].sort((a: ProjectTask, b: ProjectTask) => a.position - b.position);
        }
        return newBoard;
      });

      return { previousData };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
