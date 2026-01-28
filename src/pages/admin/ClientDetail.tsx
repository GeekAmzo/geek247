import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Building2,
  Calendar,
  Trash2,
  Edit,
  FolderKanban,
  ArrowRight,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ClientStatusBadge } from '@/components/admin/ClientStatusBadge';
import { ProjectStatusBadge } from '@/components/admin/ProjectStatusBadge';
import { CommunicationTimeline } from '@/components/admin/CommunicationTimeline';
import { CommunicationForm } from '@/components/admin/CommunicationForm';
import { Separator } from '@/components/ui/separator';
import { useClient, useDeleteClient } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useClientCommunications, useCreateCommunication } from '@/hooks/useCommunications';
import { Skeleton } from '@/components/ui/skeleton';
import type { CommunicationFormInput } from '@/schemas/projectSchemas';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(id);
  const { data: projects } = useProjects({ clientId: id });
  const { data: communications, isLoading: commsLoading } = useClientCommunications(id);
  const createCommunication = useCreateCommunication();
  const deleteClient = useDeleteClient();

  const handleDelete = () => {
    if (id) {
      deleteClient.mutate(id, {
        onSuccess: () => navigate('/admin/clients'),
      });
    }
  };

  const handleCommunication = (data: CommunicationFormInput) => {
    if (!id) return;
    createCommunication.mutate({
      clientId: id,
      type: data.type,
      direction: data.direction,
      subject: data.subject,
      content: data.content,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Client not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/clients')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/admin/clients"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Clients
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{client.companyName}</h1>
          <p className="text-muted-foreground mt-1">{client.contactName}</p>
        </div>
        <div className="flex items-center gap-3">
          <ClientStatusBadge status={client.status} />
          <Link to={`/admin/clients/${id}/overview`}>
            <Button variant="outline" size="sm">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </Button>
          </Link>
          <Link to={`/admin/clients/${id}/edit`}>
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? This will also remove all associated projects and data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href={`mailto:${client.email}`} className="text-foreground hover:text-primary transition-colors">
                  {client.email}
                </a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${client.phone}`} className="text-foreground hover:text-primary transition-colors">
                    {client.phone}
                  </a>
                </div>
              )}
              {client.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                    {client.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {client.industry && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span>{client.industry}</span>
                </div>
              )}
            </div>
          </div>

          {client.notes && (
            <div className="p-6 rounded-xl bg-card border border-border">
              <h2 className="font-semibold text-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Created {format(new Date(client.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </motion.div>

        {/* Projects & Communications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Projects */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Projects
              </h2>
              <Link to={`/admin/projects/new?clientId=${id}`}>
                <Button variant="outline" size="sm">New Project</Button>
              </Link>
            </div>

            {projects && projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{project.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {project.startDate && format(new Date(project.startDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProjectStatusBadge status={project.status} />
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No projects yet.</p>
            )}
          </div>

          {/* Communications */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Log Communication</h2>
            <CommunicationForm
              onSubmit={handleCommunication}
              isLoading={createCommunication.isPending}
            />
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-semibold text-foreground mb-4">Communication History</h2>
            <CommunicationTimeline
              communications={communications || []}
              isLoading={commsLoading}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDetail;
