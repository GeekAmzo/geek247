import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, File, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PortalProjectProgress } from '@/components/portal/PortalProjectProgress';
import { PortalTaskList } from '@/components/portal/PortalTaskList';
import { PortalMilestoneView } from '@/components/portal/PortalMilestoneView';
import { PortalCommunicationThread } from '@/components/portal/PortalCommunicationThread';

import { useProject } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useMilestones } from '@/hooks/useMilestones';
import { useDeliverables } from '@/hooks/useDeliverables';
import { useProjectAttachments } from '@/hooks/useProjectAttachments';
import { useProjectCommunications, useCreateCommunication } from '@/hooks/useCommunications';
import { projectAttachmentService } from '@/services/projectAttachmentService';

import type { ProjectStatus } from '@/types/projects';

const statusColors: Record<ProjectStatus, string> = {
  planning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  on_hold: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: 'Planning', active: 'Active', on_hold: 'On Hold', completed: 'Completed', cancelled: 'Cancelled',
};

export default function PortalProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading } = useProject(id);
  const { data: tasks } = useTasks(id);
  const { data: milestones } = useMilestones(id);
  const { data: deliverables } = useDeliverables(id);
  const { data: attachments } = useProjectAttachments(id);
  const { data: communications } = useProjectCommunications(id);
  const createCommunication = useCreateCommunication();

  const handleSendMessage = (content: string) => {
    if (!id || !project) return;
    createCommunication.mutate({
      clientId: project.clientId,
      projectId: id,
      type: 'message',
      direction: 'inbound',
      content,
    });
  };

  const handleDownload = async (storagePath: string) => {
    const url = await projectAttachmentService.getDownloadUrl(storagePath);
    if (url) window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Link to="/portal/projects">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/portal/projects"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <Badge variant="outline" className={statusColors[project.status]}>
            {statusLabels[project.status]}
          </Badge>
        </div>
        {project.description && (
          <p className="text-muted-foreground mt-1">{project.description}</p>
        )}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          {project.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(project.startDate), 'MMM d, yyyy')}
            </span>
          )}
          {project.endDate && (
            <span>to {format(new Date(project.endDate), 'MMM d, yyyy')}</span>
          )}
        </div>
      </div>

      {/* Progress */}
      {tasks && tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-card border border-border"
        >
          <PortalProjectProgress tasks={tasks} />
        </motion.div>
      )}

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <PortalTaskList tasks={tasks || []} />
          </motion.div>
        </TabsContent>

        <TabsContent value="milestones">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <PortalMilestoneView
              milestones={milestones || []}
              deliverables={deliverables || []}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="files">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            {attachments && attachments.length > 0 ? (
              <div className="space-y-2">
                {attachments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{a.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(a.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDownload(a.storagePath)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No files yet.</div>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="messages">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <PortalCommunicationThread
              communications={communications || []}
              onSendMessage={handleSendMessage}
              isSending={createCommunication.isPending}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
