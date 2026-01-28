import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { useProject, useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { Skeleton } from '@/components/ui/skeleton';
import type { ProjectFormInput } from '@/schemas/projectSchemas';

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { data: project, isLoading } = useProject(id);
  const { data: clients } = useClients();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const defaultClientId = searchParams.get('clientId') || '';

  const handleSubmit = (data: ProjectFormInput) => {
    if (isEditing && id) {
      updateProject.mutate(
        { id, data },
        { onSuccess: () => navigate(`/admin/projects/${id}`) }
      );
    } else {
      createProject.mutate(
        { ...data, status: data.status } as any,
        { onSuccess: (newProject) => navigate(`/admin/projects/${newProject.id}`) }
      );
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
          to={isEditing ? `/admin/projects/${id}` : '/admin/projects'}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {isEditing ? 'Back to Project' : 'Back to Projects'}
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Edit Project' : 'New Project'}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-card border border-border max-w-2xl"
      >
        <ProjectForm
          defaultValues={project ? { ...project, clientId: project.clientId } : { clientId: defaultClientId }}
          clients={clients || []}
          onSubmit={handleSubmit}
          isLoading={createProject.isPending || updateProject.isPending}
        />
      </motion.div>
    </div>
  );
};

export default ProjectEdit;
