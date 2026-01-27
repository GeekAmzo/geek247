import { useParams, useNavigate } from 'react-router-dom';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { useServiceById, useCreateService, useUpdateService } from '@/hooks/useServices';
import { Skeleton } from '@/components/ui/skeleton';
import type { ServiceFormInput } from '@/schemas/serviceSchemas';

export default function AdminServiceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new' || !id;

  const { data: service, isLoading } = useServiceById(isNew ? undefined : id);
  const createService = useCreateService();
  const updateService = useUpdateService();

  const handleSubmit = (data: ServiceFormInput) => {
    if (isNew) {
      createService.mutate(data, {
        onSuccess: () => navigate('/admin/services'),
      });
    } else {
      updateService.mutate(
        { id: id!, data },
        { onSuccess: () => navigate('/admin/services') }
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
        {isNew ? 'Create Service' : 'Edit Service'}
      </h1>
      <ServiceForm
        service={isNew ? undefined : service ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={createService.isPending || updateService.isPending}
      />
    </div>
  );
}
