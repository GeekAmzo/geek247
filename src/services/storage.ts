// localStorage abstraction layer for easy Supabase migration later

const STORAGE_PREFIX = 'geek247_crm_';

export const StorageKeys = {
  LEADS: `${STORAGE_PREFIX}leads`,
  ACTIVITIES: `${STORAGE_PREFIX}activities`,
  AUTH: `${STORAGE_PREFIX}auth`,
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
