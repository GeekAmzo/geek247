import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addDays, isPast, isToday } from 'date-fns';
import {
  ArrowLeft,
  Mail,
  Phone,
  Edit,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  Milestone,
  CreditCard,
  MessageSquare,
  LayoutDashboard,
  Plus,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientStatusBadge } from '@/components/admin/ClientStatusBadge';
import { OverviewItemRow } from '@/components/admin/OverviewItemRow';
import { SubscriptionMiniCard } from '@/components/admin/SubscriptionMiniCard';
import { ProjectMiniCard } from '@/components/admin/ProjectMiniCard';
import { CommunicationTimeline } from '@/components/admin/CommunicationTimeline';
import { useClient } from '@/hooks/useClients';
import { useProjects } from '@/hooks/useProjects';
import { useClientCommunications } from '@/hooks/useCommunications';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import {
  useClientTasks,
  useClientMilestones,
  useClientGoals,
  useClientDeliverables,
} from '@/hooks/useClientOverview';
import {
  TASK_STATUSES,
  MILESTONE_STATUSES,
  GOAL_STATUSES,
  DELIVERABLE_STATUSES,
} from '@/types/projects';
import type {
  ProjectTask,
  ProjectMilestone,
  ProjectDeliverable,
  Project,
} from '@/types/projects';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof FolderKanban;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}

function getTaskStatusLabel(status: string) {
  return TASK_STATUSES.find((s) => s.value === status)?.label || status;
}
function getTaskStatusColor(status: string) {
  const colors: Record<string, string> = {
    backlog: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    todo: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    in_progress: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    in_review: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    done: 'bg-green-500/10 text-green-500 border-green-500/20',
  };
  return colors[status] || '';
}

function getMilestoneStatusLabel(status: string) {
  return MILESTONE_STATUSES.find((s) => s.value === status)?.label || status;
}
function getMilestoneStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    missed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return colors[status] || '';
}

function getDeliverableStatusLabel(status: string) {
  return DELIVERABLE_STATUSES.find((s) => s.value === status)?.label || status;
}
function getDeliverableStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    in_review: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return colors[status] || '';
}

function getGoalStatusLabel(status: string) {
  return GOAL_STATUSES.find((s) => s.value === status)?.label || status;
}
function getGoalStatusColor(status: string) {
  const colors: Record<string, string> = {
    not_started: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    on_track: 'bg-green-500/10 text-green-500 border-green-500/20',
    at_risk: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    achieved: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    missed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return colors[status] || '';
}

interface UpcomingItem {
  id: string;
  title: string;
  projectName?: string;
  dueDate?: string;
  status: string;
  statusColor: string;
  type: 'task' | 'milestone' | 'deliverable';
  isOverdue: boolean;
}

function buildUpcomingItems(
  tasks: ProjectTask[],
  milestones: ProjectMilestone[],
  deliverables: ProjectDeliverable[],
  projects: Project[]
): UpcomingItem[] {
  const now = new Date();
  const in7Days = addDays(now, 7);
  const in14Days = addDays(now, 14);
  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  const items: UpcomingItem[] = [];

  // Overdue tasks + tasks due within 7 days (not done)
  tasks
    .filter((t) => t.status !== 'done' && t.dueDate)
    .forEach((t) => {
      const due = new Date(t.dueDate!);
      const overdue = isPast(due) && !isToday(due);
      const upcoming = due <= in7Days;
      if (overdue || upcoming) {
        items.push({
          id: t.id,
          title: t.title,
          projectName: projectMap.get(t.projectId),
          dueDate: t.dueDate,
          status: getTaskStatusLabel(t.status),
          statusColor: getTaskStatusColor(t.status),
          type: 'task',
          isOverdue: overdue,
        });
      }
    });

  // Milestones approaching within 14 days (not completed/missed)
  milestones
    .filter((m) => m.status !== 'completed' && m.status !== 'missed' && m.targetDate)
    .forEach((m) => {
      const due = new Date(m.targetDate!);
      const overdue = isPast(due) && !isToday(due);
      const upcoming = due <= in14Days;
      if (overdue || upcoming) {
        items.push({
          id: m.id,
          title: m.title,
          projectName: projectMap.get(m.projectId),
          dueDate: m.targetDate,
          status: getMilestoneStatusLabel(m.status),
          statusColor: getMilestoneStatusColor(m.status),
          type: 'milestone',
          isOverdue: overdue,
        });
      }
    });

  // Overdue deliverables (not approved)
  deliverables
    .filter((d) => d.status !== 'approved' && d.dueDate)
    .forEach((d) => {
      const due = new Date(d.dueDate!);
      const overdue = isPast(due) && !isToday(due);
      const upcoming = due <= in7Days;
      if (overdue || upcoming) {
        items.push({
          id: d.id,
          title: d.title,
          projectName: projectMap.get(d.projectId),
          dueDate: d.dueDate,
          status: getDeliverableStatusLabel(d.status),
          statusColor: getDeliverableStatusColor(d.status),
          type: 'deliverable',
          isOverdue: overdue,
        });
      }
    });

  // Sort: overdue first, then by date ascending
  items.sort((a, b) => {
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return 0;
  });

  return items;
}

const ClientOverview = () => {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useClient(id);
  const { data: projects } = useProjects({ clientId: id });
  const { data: tasks } = useClientTasks(id);
  const { data: milestones } = useClientMilestones(id);
  const { data: goals } = useClientGoals(id);
  const { data: deliverables } = useClientDeliverables(id);
  const { data: communications, isLoading: commsLoading } = useClientCommunications(id);
  const { data: subscriptions } = useSubscriptions(client?.userProfileId);

  const stats = useMemo(() => {
    const allProjects = projects || [];
    const allTasks = tasks || [];
    const allMilestones = milestones || [];
    const allSubs = subscriptions || [];
    const allComms = communications || [];

    return {
      activeProjects: allProjects.filter((p) => p.status === 'active').length,
      totalTasks: allTasks.length,
      openTasks: allTasks.filter((t) => t.status !== 'done').length,
      upcomingMilestones: allMilestones.filter(
        (m) => m.status !== 'completed' && m.status !== 'missed' && m.targetDate
      ).length,
      activeSubscriptions: allSubs.filter(
        (s) => s.status === 'active' || s.status === 'trialing'
      ).length,
      totalCommunications: allComms.length,
    };
  }, [projects, tasks, milestones, subscriptions, communications]);

  const upcomingItems = useMemo(
    () => buildUpcomingItems(tasks || [], milestones || [], deliverables || [], projects || []),
    [tasks, milestones, deliverables, projects]
  );

  const activeSubscriptions = useMemo(
    () => (subscriptions || []).filter((s) => s.status === 'active' || s.status === 'trialing'),
    [subscriptions]
  );

  const recentComms = useMemo(
    () => (communications || []).slice(0, 5),
    [communications]
  );

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
        <Link to="/admin/clients">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </Link>
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
          <div className="flex items-center gap-2 text-muted-foreground mt-1 flex-wrap">
            <span>{client.contactName}</span>
            {client.email && (
              <>
                <span className="text-border">·</span>
                <a href={`mailto:${client.email}`} className="hover:text-primary inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {client.email}
                </a>
              </>
            )}
            {client.phone && (
              <>
                <span className="text-border">·</span>
                <a href={`tel:${client.phone}`} className="hover:text-primary inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {client.phone}
                </a>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ClientStatusBadge status={client.status} />
          <Link to={`/admin/clients/${id}/edit`}>
            <Button variant="outline" size="icon">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Link to={`/admin/clients/${id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Detail
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <StatCard icon={FolderKanban} label="Active Projects" value={stats.activeProjects} color="bg-green-500" />
        <StatCard icon={CheckSquare} label="Total Tasks" value={stats.totalTasks} color="bg-blue-500" />
        <StatCard icon={AlertCircle} label="Open Tasks" value={stats.openTasks} color="bg-yellow-500" />
        <StatCard icon={Milestone} label="Upcoming Milestones" value={stats.upcomingMilestones} color="bg-purple-500" />
        <StatCard icon={CreditCard} label="Active Subs" value={stats.activeSubscriptions} color="bg-indigo-500" />
        <StatCard icon={MessageSquare} label="Communications" value={stats.totalCommunications} color="bg-pink-500" />
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Upcoming & Overdue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5" />
              Upcoming & Overdue
            </h2>
            {upcomingItems.length > 0 ? (
              <div className="space-y-2">
                {upcomingItems.map((item) => (
                  <OverviewItemRow
                    key={`${item.type}-${item.id}`}
                    title={item.title}
                    projectName={item.projectName}
                    dueDate={item.dueDate}
                    status={item.status}
                    statusColor={item.statusColor}
                    type={item.type}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No upcoming or overdue items.
              </p>
            )}
          </motion.div>

          {/* Recent Communications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Communications
              </h2>
              <Link to={`/admin/clients/${id}`}>
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            </div>
            <CommunicationTimeline
              communications={recentComms}
              isLoading={commsLoading}
            />
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Subscriptions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5" />
              Active Subscriptions
            </h2>
            {!client.userProfileId ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No account linked to this client.
              </p>
            ) : activeSubscriptions.length > 0 ? (
              <div className="space-y-2">
                {activeSubscriptions.map((sub) => (
                  <SubscriptionMiniCard key={sub.id} subscription={sub} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active subscriptions.
              </p>
            )}
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Projects
              </h2>
              <Link to={`/admin/projects/new?clientId=${id}`}>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  New Project
                </Button>
              </Link>
            </div>
            {projects && projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map((project) => (
                  <ProjectMiniCard
                    key={project.id}
                    project={project}
                    tasks={tasks || []}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No projects yet.</p>
            )}
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <LayoutDashboard className="w-5 h-5" />
              Goals
            </h2>
            {goals && goals.length > 0 ? (
              <div className="space-y-3">
                {goals.map((goal) => {
                  const progress =
                    goal.targetValue && goal.targetValue > 0
                      ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                      : 0;
                  return (
                    <div
                      key={goal.id}
                      className="p-3 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-foreground truncate">
                          {goal.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${getGoalStatusColor(goal.status)}`}
                        >
                          {getGoalStatusLabel(goal.status)}
                        </span>
                      </div>
                      {goal.targetValue != null && goal.targetValue > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {goal.currentValue}/{goal.targetValue}
                            {goal.unit ? ` ${goal.unit}` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No goals yet.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClientOverview;
