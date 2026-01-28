import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectAttachmentService } from '@/services/projectAttachmentService';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'project-attachments';

export function useProjectAttachments(projectId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => (projectId ? projectAttachmentService.getByProject(projectId) : []),
    enabled: !!projectId,
  });
}

export function useTaskAttachments(taskId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'task', taskId],
    queryFn: () => (taskId ? projectAttachmentService.getByTask(taskId) : []),
    enabled: !!taskId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      file,
      projectId,
      uploadedBy,
      taskId,
      deliverableId,
    }: {
      file: File;
      projectId: string;
      uploadedBy?: string;
      taskId?: string;
      deliverableId?: string;
    }) => projectAttachmentService.upload(file, projectId, uploadedBy, taskId, deliverableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'File uploaded', description: 'The file has been uploaded successfully.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to upload file.', variant: 'destructive' });
      console.error('Error uploading file:', error);
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, storagePath }: { id: string; storagePath: string }) =>
      projectAttachmentService.delete(id, storagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'File deleted', description: 'The file has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete file.', variant: 'destructive' });
      console.error('Error deleting file:', error);
    },
  });
}
