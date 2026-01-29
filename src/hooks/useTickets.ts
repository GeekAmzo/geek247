import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticketService';
import type { Ticket, TicketMessage, TicketFilters } from '@/types/tickets';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'tickets';
const MESSAGES_KEY = 'ticket-messages';

export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => ticketService.getAll(filters),
  });
}

export function useUserTickets(userId: string | undefined, filters?: TicketFilters) {
  return useQuery({
    queryKey: [QUERY_KEY, 'user', userId, filters],
    queryFn: () => (userId ? ticketService.getByUser(userId, filters) : []),
    enabled: !!userId,
  });
}

export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => (id ? ticketService.getById(id) : null),
    enabled: !!id,
  });
}

export function useTicketMessages(ticketId: string | undefined) {
  return useQuery({
    queryKey: [MESSAGES_KEY, ticketId],
    queryFn: () => (ticketId ? ticketService.getMessages(ticketId) : []),
    enabled: !!ticketId,
  });
}

export function useTicketStats() {
  return useQuery({
    queryKey: [QUERY_KEY, 'stats'],
    queryFn: () => ticketService.getStats(),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'closedAt' | 'userName' | 'assigneeName'>) =>
      ticketService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Ticket created', description: 'Your support ticket has been submitted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to create ticket.', variant: 'destructive' });
      console.error('Error creating ticket:', error);
    },
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ticket> }) =>
      ticketService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Ticket updated', description: 'The ticket has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update ticket.', variant: 'destructive' });
      console.error('Error updating ticket:', error);
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => ticketService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Ticket deleted', description: 'The ticket has been deleted.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to delete ticket.', variant: 'destructive' });
      console.error('Error deleting ticket:', error);
    },
  });
}

export function useAddTicketMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: Omit<TicketMessage, 'id' | 'createdAt' | 'authorName'> }) =>
      ticketService.addMessage(ticketId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY, variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast({ title: 'Reply sent', description: 'Your message has been added.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to send reply.', variant: 'destructive' });
      console.error('Error adding ticket message:', error);
    },
  });
}
