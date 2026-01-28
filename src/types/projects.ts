// Project Management Types

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type CommunicationType = 'email' | 'call' | 'note' | 'message' | 'meeting';
export type CommunicationDirection = 'inbound' | 'outbound' | 'internal';
export type MilestoneStatus = 'pending' | 'in_progress' | 'completed' | 'missed';
export type GoalStatus = 'not_started' | 'on_track' | 'at_risk' | 'achieved' | 'missed';
export type DeliverableStatus = 'pending' | 'in_progress' | 'in_review' | 'approved' | 'rejected';
export type ProjectMemberRole = 'owner' | 'manager' | 'member' | 'viewer';

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientId: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  budgetCents?: number;
  budgetCurrency?: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  clientName?: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  assigneeId?: string;
  parentTaskId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  assigneeName?: string;
  commentCount?: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  authorName?: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  targetDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectGoal {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: GoalStatus;
  targetValue?: number;
  currentValue: number;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDeliverable {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description?: string;
  status: DeliverableStatus;
  acceptanceCriteria?: string;
  dueDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAttachment {
  id: string;
  projectId: string;
  taskId?: string;
  deliverableId?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  storagePath: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface ClientCommunication {
  id: string;
  clientId: string;
  projectId?: string;
  authorId?: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject?: string;
  content: string;
  createdAt: string;
  // Joined fields
  authorName?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  createdAt: string;
  // Joined fields
  userName?: string;
  userEmail?: string;
}

export interface ProjectFilters {
  clientId?: string;
  status?: ProjectStatus | 'all';
  search?: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  assigneeId?: string;
  search?: string;
}

// UI Constants

export const PROJECT_STATUSES: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'planning', label: 'Planning', color: 'bg-blue-500' },
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-yellow-500' },
  { value: 'completed', label: 'Completed', color: 'bg-purple-500' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
];

export const TASK_STATUSES: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', color: 'bg-gray-500' },
  { value: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500' },
  { value: 'in_review', label: 'In Review', color: 'bg-purple-500' },
  { value: 'done', label: 'Done', color: 'bg-green-500' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

export const KANBAN_COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];

export const MILESTONE_STATUSES: { value: MilestoneStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' },
  { value: 'missed', label: 'Missed', color: 'bg-red-500' },
];

export const GOAL_STATUSES: { value: GoalStatus; label: string; color: string }[] = [
  { value: 'not_started', label: 'Not Started', color: 'bg-gray-500' },
  { value: 'on_track', label: 'On Track', color: 'bg-green-500' },
  { value: 'at_risk', label: 'At Risk', color: 'bg-yellow-500' },
  { value: 'achieved', label: 'Achieved', color: 'bg-purple-500' },
  { value: 'missed', label: 'Missed', color: 'bg-red-500' },
];

export const DELIVERABLE_STATUSES: { value: DeliverableStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'in_review', label: 'In Review', color: 'bg-yellow-500' },
  { value: 'approved', label: 'Approved', color: 'bg-green-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

export const COMMUNICATION_TYPES: { value: CommunicationType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Phone Call' },
  { value: 'note', label: 'Note' },
  { value: 'message', label: 'Message' },
  { value: 'meeting', label: 'Meeting' },
];

export const COMMUNICATION_DIRECTIONS: { value: CommunicationDirection; label: string }[] = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'internal', label: 'Internal' },
];
