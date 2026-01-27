import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { legalService } from '@/services/legalService';
import type { LegalDocumentInsert, LegalDocumentUpdate, AgreementType } from '@/types/legal';
import { useToast } from '@/hooks/use-toast';

const DOCS_KEY = 'legalDocuments';
const AGREEMENTS_KEY = 'userAgreements';

export function useLegalDocuments(type?: AgreementType, activeOnly = true) {
  return useQuery({
    queryKey: [DOCS_KEY, type, activeOnly],
    queryFn: () => legalService.getDocuments(type, activeOnly),
  });
}

export function useLegalDocument(id: string | undefined) {
  return useQuery({
    queryKey: [DOCS_KEY, 'detail', id],
    queryFn: () => (id ? legalService.getDocumentById(id) : null),
    enabled: !!id,
  });
}

export function useActiveLegalDocument(type: AgreementType, serviceId?: string) {
  return useQuery({
    queryKey: [DOCS_KEY, 'active', type, serviceId],
    queryFn: () => legalService.getActiveDocument(type, serviceId),
  });
}

export function useCreateLegalDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LegalDocumentInsert) => legalService.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCS_KEY] });
      toast({ title: 'Document created', description: 'The legal document has been created.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create document.', variant: 'destructive' });
      console.error('Error creating document:', error);
    },
  });
}

export function useUpdateLegalDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LegalDocumentUpdate }) =>
      legalService.updateDocument(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCS_KEY] });
      toast({ title: 'Document updated', description: 'The legal document has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update document.', variant: 'destructive' });
      console.error('Error updating document:', error);
    },
  });
}

export function useDeleteLegalDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => legalService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCS_KEY] });
      toast({ title: 'Document deleted', description: 'The legal document has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete document.', variant: 'destructive' });
      console.error('Error deleting document:', error);
    },
  });
}

export function useUserAgreements(userId?: string) {
  return useQuery({
    queryKey: [AGREEMENTS_KEY, userId],
    queryFn: () => legalService.getAgreements(userId),
  });
}

export function useAllAgreements() {
  return useQuery({
    queryKey: [AGREEMENTS_KEY, 'all'],
    queryFn: () => legalService.getAgreements(),
  });
}

export function useCreateAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      userId: string;
      documentId: string;
      subscriptionId?: string;
      ipAddress?: string;
    }) => legalService.createAgreement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGREEMENTS_KEY] });
    },
  });
}
