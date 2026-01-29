import type { Ticket, TicketMessage, TicketStatus, TicketPriority, TicketCategory, TicketFilters } from '@/types/tickets';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';

function dbRowToTicket(row: any): Ticket {
  return {
    id: row.id,
    subject: row.subject,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    userId: row.user_id,
    assigneeId: row.assignee_id || undefined,
    projectId: row.project_id || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    closedAt: row.closed_at || undefined,
    userName: row.user_profiles?.full_name || row.userName || undefined,
    assigneeName: row.assignee?.full_name || row.assigneeName || undefined,
  };
}

function dbRowToMessage(row: any): TicketMessage {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    authorId: row.author_id,
    content: row.content,
    isInternal: row.is_internal,
    createdAt: row.created_at,
    authorName: row.user_profiles?.full_name || row.authorName || undefined,
  };
}

function getLocalTickets(): Ticket[] {
  return getItem<Ticket[]>(StorageKeys.TICKETS) || [];
}

function saveLocalTickets(tickets: Ticket[]): void {
  setItem(StorageKeys.TICKETS, tickets);
}

function getLocalMessages(): TicketMessage[] {
  return getItem<TicketMessage[]>(StorageKeys.TICKET_MESSAGES) || [];
}

function saveLocalMessages(messages: TicketMessage[]): void {
  setItem(StorageKeys.TICKET_MESSAGES, messages);
}

function applyFilters(tickets: Ticket[], filters?: TicketFilters): Ticket[] {
  let result = tickets;

  if (filters?.status && filters.status !== 'all') {
    result = result.filter((t) => t.status === filters.status);
  }
  if (filters?.priority && filters.priority !== 'all') {
    result = result.filter((t) => t.priority === filters.priority);
  }
  if (filters?.category && filters.category !== 'all') {
    result = result.filter((t) => t.category === filters.category);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.subject.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search) ||
        t.userName?.toLowerCase().includes(search)
    );
  }

  return result;
}

export const ticketService = {
  async getAll(filters?: TicketFilters): Promise<Ticket[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('support_tickets')
        .select('*, user_profiles!user_id(full_name), assignee:user_profiles!assignee_id(full_name)')
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.search) {
        query = query.or(`subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tickets:', error);
        throw error;
      }

      return (data || []).map(dbRowToTicket);
    }

    const tickets = getLocalTickets().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return applyFilters(tickets, filters);
  },

  async getByUser(userId: string, filters?: TicketFilters): Promise<Ticket[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('support_tickets')
        .select('*, user_profiles!user_id(full_name), assignee:user_profiles!assignee_id(full_name)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user tickets:', error);
        throw error;
      }

      return (data || []).map(dbRowToTicket);
    }

    const tickets = getLocalTickets()
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return applyFilters(tickets, filters);
  },

  async getById(id: string): Promise<Ticket | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, user_profiles!user_id(full_name), assignee:user_profiles!assignee_id(full_name)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching ticket:', error);
        throw error;
      }

      return data ? dbRowToTicket(data) : null;
    }

    const tickets = getLocalTickets();
    return tickets.find((t) => t.id === id) || null;
  },

  async create(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'closedAt' | 'userName' | 'assigneeName'>): Promise<Ticket> {
    if (isSupabaseConfigured && supabase) {
      const { data: newTicket, error } = await supabase
        .from('support_tickets')
        .insert({
          subject: data.subject,
          description: data.description,
          status: data.status,
          priority: data.priority,
          category: data.category,
          user_id: data.userId,
          assignee_id: data.assigneeId || null,
          project_id: data.projectId || null,
        })
        .select('*, user_profiles!user_id(full_name), assignee:user_profiles!assignee_id(full_name)')
        .single();

      if (error) {
        console.error('Error creating ticket:', error);
        throw error;
      }

      return dbRowToTicket(newTicket);
    }

    const tickets = getLocalTickets();
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    tickets.push(newTicket);
    saveLocalTickets(tickets);
    return newTicket;
  },

  async update(id: string, data: Partial<Ticket>): Promise<Ticket | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.subject !== undefined) updateData.subject = data.subject;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.assigneeId !== undefined) updateData.assignee_id = data.assigneeId || null;
      if (data.projectId !== undefined) updateData.project_id = data.projectId || null;
      if (data.closedAt !== undefined) updateData.closed_at = data.closedAt;

      const { data: updated, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', id)
        .select('*, user_profiles!user_id(full_name), assignee:user_profiles!assignee_id(full_name)')
        .single();

      if (error) {
        console.error('Error updating ticket:', error);
        throw error;
      }

      return updated ? dbRowToTicket(updated) : null;
    }

    const tickets = getLocalTickets();
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTicket: Ticket = {
      ...tickets[index],
      ...data,
      id: tickets[index].id,
      createdAt: tickets[index].createdAt,
      updatedAt: new Date().toISOString(),
    };

    tickets[index] = updatedTicket;
    saveLocalTickets(tickets);
    return updatedTicket;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('support_tickets').delete().eq('id', id);

      if (error) {
        console.error('Error deleting ticket:', error);
        throw error;
      }

      return true;
    }

    const tickets = getLocalTickets();
    const filtered = tickets.filter((t) => t.id !== id);
    if (filtered.length === tickets.length) return false;
    saveLocalTickets(filtered);

    // Also clean up messages
    const messages = getLocalMessages().filter((m) => m.ticketId !== id);
    saveLocalMessages(messages);

    return true;
  },

  async getStats(): Promise<Record<TicketStatus, number>> {
    const stats: Record<TicketStatus, number> = {
      open: 0,
      in_progress: 0,
      waiting_on_customer: 0,
      resolved: 0,
      closed: 0,
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('status');

      if (error) {
        console.error('Error fetching ticket stats:', error);
        throw error;
      }

      (data || []).forEach((row) => {
        if (row.status in stats) {
          stats[row.status as TicketStatus]++;
        }
      });

      return stats;
    }

    const tickets = getLocalTickets();
    tickets.forEach((t) => {
      if (t.status in stats) {
        stats[t.status]++;
      }
    });

    return stats;
  },

  async addMessage(ticketId: string, data: Omit<TicketMessage, 'id' | 'createdAt' | 'authorName'>): Promise<TicketMessage> {
    if (isSupabaseConfigured && supabase) {
      const { data: newMessage, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: data.ticketId,
          author_id: data.authorId,
          content: data.content,
          is_internal: data.isInternal,
        })
        .select('*, user_profiles(full_name)')
        .single();

      if (error) {
        console.error('Error adding ticket message:', error);
        throw error;
      }

      // Update the ticket's updated_at timestamp
      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      return dbRowToMessage(newMessage);
    }

    const messages = getLocalMessages();
    const now = new Date().toISOString();

    const newMessage: TicketMessage = {
      ...data,
      id: generateId(),
      createdAt: now,
    };

    messages.push(newMessage);
    saveLocalMessages(messages);

    // Update ticket's updatedAt
    const tickets = getLocalTickets();
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets[ticketIndex].updatedAt = now;
      saveLocalTickets(tickets);
    }

    return newMessage;
  },

  async getMessages(ticketId: string): Promise<TicketMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, user_profiles(full_name)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching ticket messages:', error);
        throw error;
      }

      return (data || []).map(dbRowToMessage);
    }

    return getLocalMessages()
      .filter((m) => m.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },
};
