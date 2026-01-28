import { FolderKanban } from 'lucide-react';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useClients } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { PortalProjectCard } from '@/components/portal/PortalProjectCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortalProjects() {
  const { user } = useUserAuth();

  // Find the client record linked to this user
  const { data: clients } = useClients();
  const userClient = clients?.find((c) => c.userProfileId === user?.id);

  const { data: projects, isLoading } = useProjects(
    userClient ? { clientId: userClient.id } : undefined
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground">Track the progress of your projects</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <PortalProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No projects yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Projects assigned to you will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
