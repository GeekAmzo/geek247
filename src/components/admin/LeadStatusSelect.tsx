import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LEAD_STATUSES, type LeadStatus } from '@/types/crm';
import { cn } from '@/lib/utils';

interface LeadStatusSelectProps {
  value: LeadStatus;
  onValueChange: (value: LeadStatus) => void;
  disabled?: boolean;
  className?: string;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'text-blue-500',
  contacted: 'text-yellow-500',
  qualified: 'text-purple-500',
  proposal: 'text-orange-500',
  won: 'text-green-500',
  lost: 'text-red-500',
};

export function LeadStatusSelect({
  value,
  onValueChange,
  disabled,
  className,
}: LeadStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-[140px]', className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LEAD_STATUSES.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            <span className={cn('font-medium', statusColors[status.value])}>
              {status.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
