// localStorage abstraction layer for easy Supabase migration later

const STORAGE_PREFIX = 'geek247_crm_';

export const StorageKeys = {
  LEADS: `${STORAGE_PREFIX}leads`,
  ACTIVITIES: `${STORAGE_PREFIX}activities`,
  AUTH: `${STORAGE_PREFIX}auth`,
  SERVICES: `${STORAGE_PREFIX}services`,
  SUBSCRIPTIONS: `${STORAGE_PREFIX}subscriptions`,
  PAYMENT_HISTORY: `${STORAGE_PREFIX}payment_history`,
  LEGAL_DOCUMENTS: `${STORAGE_PREFIX}legal_documents`,
  USER_AGREEMENTS: `${STORAGE_PREFIX}user_agreements`,
  USER_PROFILE: `${STORAGE_PREFIX}user_profile`,
  USER_AUTH: `${STORAGE_PREFIX}user_auth`,
  CLIENTS: `${STORAGE_PREFIX}clients`,
  PROJECTS: `${STORAGE_PREFIX}projects`,
  PROJECT_MEMBERS: `${STORAGE_PREFIX}project_members`,
  PROJECT_TASKS: `${STORAGE_PREFIX}project_tasks`,
  TASK_COMMENTS: `${STORAGE_PREFIX}task_comments`,
  PROJECT_MILESTONES: `${STORAGE_PREFIX}project_milestones`,
  PROJECT_GOALS: `${STORAGE_PREFIX}project_goals`,
  PROJECT_DELIVERABLES: `${STORAGE_PREFIX}project_deliverables`,
  PROJECT_ATTACHMENTS: `${STORAGE_PREFIX}project_attachments`,
  CLIENT_COMMUNICATIONS: `${STORAGE_PREFIX}client_communications`,
  TICKETS: `${STORAGE_PREFIX}tickets`,
  TICKET_MESSAGES: `${STORAGE_PREFIX}ticket_messages`,
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export function getItem<T>(key: StorageKey): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

export function setItem<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
