import { useParams, useNavigate } from 'react-router-dom';
import { LegalDocForm } from '@/components/admin/LegalDocForm';
import {
  useLegalDocument,
  useCreateLegalDocument,
  useUpdateLegalDocument,
} from '@/hooks/useLegalDocuments';
import { Skeleton } from '@/components/ui/skeleton';
import type { LegalDocumentFormInput } from '@/schemas/legalSchemas';

export default function AdminLegalDocEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;

  const { data: document, isLoading } = useLegalDocument(isNew ? undefined : id);
  const createDocument = useCreateLegalDocument();
  const updateDocument = useUpdateLegalDocument();

  const handleSubmit = (data: LegalDocumentFormInput) => {
    if (isNew) {
      createDocument.mutate(data, {
        onSuccess: () => navigate('/admin/legal'),
      });
    } else {
      updateDocument.mutate(
        { id: id!, data },
        { onSuccess: () => navigate('/admin/legal') }
      );
    }
  };

  if (!isNew && isLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        {isNew ? 'Create Legal Document' : 'Edit Legal Document'}
      </h1>
      <LegalDocForm
        document={isNew ? undefined : document ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={createDocument.isPending || updateDocument.isPending}
      />
    </div>
  );
}
