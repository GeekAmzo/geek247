import type { ProjectMember, ProjectMemberRole } from '@/types/projects';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToMember(row: any): ProjectMember {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    role: row.role,
    createdAt: row.created_at,
    userName: row.user_profiles?.full_name || undefined,
    userEmail: row.user_profiles?.email || undefined,
  };
}

function getLocalMembers(): ProjectMember[] {
  return getItem<ProjectMember[]>(StorageKeys.PROJECT_MEMBERS) || [];
}

function saveLocalMembers(members: ProjectMember[]): void {
  setItem(StorageKeys.PROJECT_MEMBERS, members);
}

export const projectMemberService = {
  async getByProject(projectId: string): Promise<ProjectMember[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_members')
        .select('*, user_profiles(full_name, email)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return (data || []).map(dbRowToMember);
    }

    return getLocalMembers().filter((m) => m.projectId === projectId);
  },

  async addMember(projectId: string, userId: string, role: ProjectMemberRole = 'member'): Promise<ProjectMember> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_members')
        .insert({ project_id: projectId, user_id: userId, role })
        .select('*, user_profiles(full_name, email)')
        .single();

      if (error) {
        console.error('Error adding member:', error);
        throw error;
      }

      return dbRowToMember(data);
    }

    const members = getLocalMembers();
    const newMember: ProjectMember = {
      id: generateId(),
      projectId,
      userId,
      role,
      createdAt: new Date().toISOString(),
    };

    members.push(newMember);
    saveLocalMembers(members);
    return newMember;
  },

  async updateRole(memberId: string, role: ProjectMemberRole): Promise<ProjectMember | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('project_members')
        .update({ role })
        .eq('id', memberId)
        .select('*, user_profiles(full_name, email)')
        .single();

      if (error) {
        console.error('Error updating member role:', error);
        throw error;
      }

      return data ? dbRowToMember(data) : null;
    }

    const members = getLocalMembers();
    const index = members.findIndex((m) => m.id === memberId);
    if (index === -1) return null;

    members[index] = { ...members[index], role };
    saveLocalMembers(members);
    return members[index];
  },

  async removeMember(memberId: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('project_members').delete().eq('id', memberId);

      if (error) {
        console.error('Error removing member:', error);
        throw error;
      }

      return true;
    }

    const members = getLocalMembers();
    const filtered = members.filter((m) => m.id !== memberId);
    if (filtered.length === members.length) return false;
    saveLocalMembers(filtered);
    return true;
  },
};
