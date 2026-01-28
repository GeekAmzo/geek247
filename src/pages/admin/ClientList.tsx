import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientFilters } from '@/components/admin/ClientFilters';
import { ClientTable } from '@/components/admin/ClientTable';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import type { ClientStatus } from '@/types/clients';

const ClientList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ClientStatus | 'all'>('all');

  const { data: clients, isLoading } = useClients({
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
  });

  const { data: projects } = useProjects();

  // Build project count map
  const projectCounts: Record<string, number> = {};
  projects?.forEach((p) => {
    projectCounts[p.clientId] = (projectCounts[p.clientId] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships</p>
        </div>
        <Link to="/admin/clients/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </Link>
      </div>

      <ClientFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <ClientTable clients={clients || []} projectCounts={projectCounts} />
        )}
      </motion.div>
    </div>
  );
};

export default ClientList;
