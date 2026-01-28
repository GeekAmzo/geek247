import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Plus,
  Calendar,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ProjectStatusBadge } from '@/components/admin/ProjectStatusBadge';
import { ProjectMembersList } from '@/components/admin/ProjectMembersList';
import { KanbanBoard } from '@/components/admin/KanbanBoard';
import { TaskListView } from '@/components/admin/TaskListView';
import { TaskForm } from '@/components/admin/TaskForm';
import { TaskDetailSheet } from '@/components/admin/TaskDetailSheet';
import { MilestoneTimeline } from '@/components/admin/MilestoneTimeline';
import { MilestoneForm } from '@/components/admin/MilestoneForm';
import { GoalCard } from '@/components/admin/GoalCard';
import { GoalForm } from '@/components/admin/GoalForm';
import { DeliverableCard } from '@/components/admin/DeliverableCard';
import { DeliverableForm } from '@/components/admin/DeliverableForm';
import { FileUploadZone } from '@/components/admin/FileUploadZone';
import { CommunicationTimeline } from '@/components/admin/CommunicationTimeline';
import { CommunicationForm } from '@/components/admin/CommunicationForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { useProject, useDeleteProject } from '@/hooks/useProjects';
import { useKanbanBoard, useTasks, useCreateTask, useReorderTask } from '@/hooks/useTasks';
import { useProjectMembers, useRemoveProjectMember } from '@/hooks/useProjectMembers';
import { useMilestones, useCreateMilestone, useDeleteMilestone } from '@/hooks/useMilestones';
import { useGoals, useCreateGoal, useDeleteGoal } from '@/hooks/useGoals';
import { useDeliverables, useCreateDeliverable, useDeleteDeliverable } from '@/hooks/useDeliverables';
import { useProjectAttachments, useUploadAttachment, useDeleteAttachment } from '@/hooks/useProjectAttachments';
import { useProjectCommunications, useCreateCommunication } from '@/hooks/useCommunications';

import type { ProjectTask, TaskStatus } from '@/types/projects';
import type { TaskFormInput } from '@/schemas/projectSchemas';
import type { MilestoneFormInput } from '@/schemas/projectSchemas';
import type { GoalFormInput } from '@/schemas/projectSchemas';
import type { DeliverableFormInput } from '@/schemas/projectSchemas';
import type { CommunicationFormInput } from '@/schemas/projectSchemas';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Data hooks
  const { data: project, isLoading } = useProject(id);
  const { data: board } = useKanbanBoard(id);
  const { data: tasks } = useTasks(id);
  const { data: members } = useProjectMembers(id);
  const { data: milestones } = useMilestones(id);
  const { data: goals } = useGoals(id);
  const { data: deliverables } = useDeliverables(id);
  const { data: attachments } = useProjectAttachments(id);
  const { data: communications, isLoading: commsLoading } = useProjectCommunications(id);

  // Mutation hooks
  const deleteProject = useDeleteProject();
  const createTask = useCreateTask();
  const reorderTask = useReorderTask();
  const removeMember = useRemoveProjectMember();
  const createMilestone = useCreateMilestone();
  const deleteMilestone = useDeleteMilestone();
  const createGoal = useCreateGoal();
  const deleteGoal = useDeleteGoal();
  const createDeliverable = useCreateDeliverable();
  const deleteDeliverable = useDeleteDeliverable();
  const uploadAttachment = useUploadAttachment();
  const deleteAttachment = useDeleteAttachment();
  const createCommunication = useCreateCommunication();

  // UI state
  const [taskView, setTaskView] = useState<'kanban' | 'list'>('kanban');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskFormDefaultStatus, setTaskFormDefaultStatus] = useState<TaskStatus>('todo');
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const handleDeleteProject = () => {
    if (id) {
      deleteProject.mutate(id, { onSuccess: () => navigate('/admin/projects') });
    }
  };

  const handleCreateTask = (data: TaskFormInput) => {
    if (!id) return;
    createTask.mutate({
      projectId: id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      position: (tasks?.filter((t) => t.status === data.status).length || 0),
      assigneeId: data.assigneeId || undefined,
      dueDate: data.dueDate || undefined,
    });
  };

  const handleReorder = (taskId: string, newStatus: TaskStatus, newPosition: number) => {
    reorderTask.mutate({ taskId, newStatus, newPosition });
  };

  const handleTaskClick = (task: ProjectTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleAddTaskFromKanban = (status: TaskStatus) => {
    setTaskFormDefaultStatus(status);
    setTaskFormOpen(true);
  };

  const handleCreateMilestone = (data: MilestoneFormInput) => {
    if (!id) return;
    createMilestone.mutate({
      projectId: id,
      title: data.title,
      description: data.description,
      status: data.status,
      targetDate: data.targetDate || undefined,
    });
  };

  const handleCreateGoal = (data: GoalFormInput) => {
    if (!id) return;
    createGoal.mutate({
      projectId: id,
      title: data.title,
      description: data.description,
      status: data.status,
      targetValue: data.targetValue,
      currentValue: data.currentValue ?? 0,
      unit: data.unit,
    });
  };

  const handleCreateDeliverable = (data: DeliverableFormInput) => {
    if (!id) return;
    createDeliverable.mutate({
      projectId: id,
      title: data.title,
      description: data.description,
      status: data.status,
      milestoneId: data.milestoneId || undefined,
      acceptanceCriteria: data.acceptanceCriteria,
      dueDate: data.dueDate || undefined,
    });
  };

  const handleUploadFile = (file: File) => {
    if (!id) return;
    uploadAttachment.mutate({ file, projectId: id });
  };

  const handleCommunication = (data: CommunicationFormInput) => {
    if (!id || !project) return;
    createCommunication.mutate({
      clientId: project.clientId,
      projectId: id,
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
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button variant="outline" onClick={() => navigate('/admin/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
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
            to="/admin/projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {project.clientName && (
              <span className="text-muted-foreground">{project.clientName}</span>
            )}
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={`/admin/projects/${id}/edit`}>
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
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the project and all its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProject}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                {project.description && (
                  <div>
                    <p className="text-muted-foreground">Description</p>
                    <p className="text-foreground mt-1 whitespace-pre-wrap">{project.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="text-foreground mt-1">
                      {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p className="text-foreground mt-1">
                      {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Members
              </h3>
              <ProjectMembersList
                members={members || []}
                onRemove={(memberId) => removeMember.mutate(memberId)}
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={taskView === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTaskView('kanban')}
                >
                  <LayoutGrid className="w-4 h-4 mr-1" />
                  Kanban
                </Button>
                <Button
                  variant={taskView === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTaskView('list')}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
              <Button size="sm" onClick={() => { setTaskFormDefaultStatus('todo'); setTaskFormOpen(true); }}>
                <Plus className="w-4 h-4 mr-1" />
                New Task
              </Button>
            </div>

            {taskView === 'kanban' && board ? (
              <KanbanBoard
                board={board}
                onReorder={handleReorder}
                onTaskClick={handleTaskClick}
                onAddTask={handleAddTaskFromKanban}
              />
            ) : (
              <div className="p-6 rounded-xl bg-card border border-border">
                <TaskListView tasks={tasks || []} onTaskClick={handleTaskClick} />
              </div>
            )}

            <TaskForm
              open={taskFormOpen}
              onOpenChange={setTaskFormOpen}
              defaultStatus={taskFormDefaultStatus}
              onSubmit={handleCreateTask}
              isLoading={createTask.isPending}
            />

            <TaskDetailSheet
              task={selectedTask}
              open={taskDetailOpen}
              onOpenChange={setTaskDetailOpen}
            />
          </motion.div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Add Milestone</h3>
              <MilestoneForm onSubmit={handleCreateMilestone} isLoading={createMilestone.isPending} />
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Milestones</h3>
              <MilestoneTimeline
                milestones={milestones || []}
                onDelete={(mid) => deleteMilestone.mutate(mid)}
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Add Goal</h3>
              <GoalForm onSubmit={handleCreateGoal} isLoading={createGoal.isPending} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {(goals || []).map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={(gid) => deleteGoal.mutate(gid)} />
              ))}
            </div>
            {(!goals || goals.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">No goals yet.</div>
            )}
          </motion.div>
        </TabsContent>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Add Deliverable</h3>
              <DeliverableForm
                milestones={milestones || []}
                onSubmit={handleCreateDeliverable}
                isLoading={createDeliverable.isPending}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {(deliverables || []).map((d) => (
                <DeliverableCard key={d.id} deliverable={d} onDelete={(did) => deleteDeliverable.mutate(did)} />
              ))}
            </div>
            {(!deliverables || deliverables.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">No deliverables yet.</div>
            )}
          </motion.div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Project Files</h3>
              <FileUploadZone
                projectId={id!}
                attachments={attachments || []}
                onUpload={handleUploadFile}
                onDelete={(aid, path) => deleteAttachment.mutate({ id: aid, storagePath: path })}
                isUploading={uploadAttachment.isPending}
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Log Communication</h3>
              <CommunicationForm
                onSubmit={handleCommunication}
                isLoading={createCommunication.isPending}
              />
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Communication History</h3>
              <CommunicationTimeline
                communications={communications || []}
                isLoading={commsLoading}
              />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
