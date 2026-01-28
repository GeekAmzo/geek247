import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROJECT_STATUSES, type ProjectStatus } from '@/types/projects';
import type { Client } from '@/types/clients';
import { Search } from 'lucide-react';

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ProjectStatus | 'all';
  onStatusChange: (value: ProjectStatus | 'all') => void;
  clientId: string;
  onClientChange: (value: string) => void;
  clients?: Client[];
}

export function ProjectFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  clientId,
  onClientChange,
  clients,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={status} onValueChange={(val) => onStatusChange(val as ProjectStatus | 'all')}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {PROJECT_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {clients && clients.length > 0 && (
        <Select value={clientId} onValueChange={onClientChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.companyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
