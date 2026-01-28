import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/projectService';
import type { Project, ProjectFilters } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'projects';

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => projectService.getAll(filters),
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => (id ? projectService.getById(id) : null),
    enabled: !!id,
  });
}

export function useProjectStats() {
  return useQuery({
    queryKey: [QUERY_KEY, 'stats'],
    queryFn: () => projectService.getStats(),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'clientName'>) =>
      projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Project created', description: 'The project has been created successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create project.', variant: 'destructive' });
      console.error('Error creating project:', error);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Project updated', description: 'The project has been updated successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update project.', variant: 'destructive' });
      console.error('Error updating project:', error);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Project deleted', description: 'The project has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete project.', variant: 'destructive' });
      console.error('Error deleting project:', error);
    },
  });
}
