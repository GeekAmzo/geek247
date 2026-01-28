import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ClientForm } from '@/components/admin/ClientForm';
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/useClients';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClientFormInput } from '@/schemas/clientSchemas';

const ClientEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { data: client, isLoading } = useClient(id);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const handleSubmit = (data: ClientFormInput) => {
    if (isEditing && id) {
      updateClient.mutate(
        { id, data },
        { onSuccess: () => navigate(`/admin/clients/${id}`) }
      );
    } else {
      createClient.mutate(data as any, {
        onSuccess: (newClient) => navigate(`/admin/clients/${newClient.id}`),
      });
    }
  };

  if (isEditing && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={isEditing ? `/admin/clients/${id}` : '/admin/clients'}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {isEditing ? 'Back to Client' : 'Back to Clients'}
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Edit Client' : 'New Client'}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border max-w-2xl"
      >
        <ClientForm
          defaultValues={client || undefined}
          onSubmit={handleSubmit}
          isLoading={createClient.isPending || updateClient.isPending}
        />
      </motion.div>
    </div>
  );
};

export default ClientEdit;
