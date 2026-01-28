import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectFilters } from '@/components/admin/ProjectFilters';
import { ProjectCard } from '@/components/admin/ProjectCard';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProjectStatus } from '@/types/projects';

const ProjectList = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [clientId, setClientId] = useState('all');

  const { data: projects, isLoading } = useProjects({
    search: search || undefined,
    status: status !== 'all' ? status : undefined,
    clientId: clientId !== 'all' ? clientId : undefined,
  });

  const { data: clients } = useClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your client projects</p>
        </div>
        <Link to="/admin/projects/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <ProjectFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        clientId={clientId}
        onClientChange={setClientId}
        clients={clients}
      />

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No projects found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create a project to start managing work.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
