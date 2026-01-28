import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { milestoneService } from '@/services/milestoneService';
import { goalService } from '@/services/goalService';
import { deliverableService } from '@/services/deliverableService';

export function useClientTasks(clientId: string | undefined) {
  return useQuery({
    queryKey: ['tasks', 'client', clientId],
    queryFn: () => (clientId ? taskService.getByClientId(clientId) : []),
    enabled: !!clientId,
  });
}

export function useClientMilestones(clientId: string | undefined) {
  return useQuery({
    queryKey: ['milestones', 'client', clientId],
    queryFn: () => (clientId ? milestoneService.getByClientId(clientId) : []),
    enabled: !!clientId,
  });
}

export function useClientGoals(clientId: string | undefined) {
  return useQuery({
    queryKey: ['goals', 'client', clientId],
    queryFn: () => (clientId ? goalService.getByClientId(clientId) : []),
    enabled: !!clientId,
  });
}

export function useClientDeliverables(clientId: string | undefined) {
  return useQuery({
    queryKey: ['deliverables', 'client', clientId],
    queryFn: () => (clientId ? deliverableService.getByClientId(clientId) : []),
    enabled: !!clientId,
  });
}
