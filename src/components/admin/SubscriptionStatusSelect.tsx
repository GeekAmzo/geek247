import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SubscriptionStatus } from '@/types/subscriptions';

interface SubscriptionStatusSelectProps {
  value: SubscriptionStatus;
  onValueChange: (value: SubscriptionStatus) => void;
  disabled?: boolean;
}

const statuses: { value: SubscriptionStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'trialing', label: 'Trialing' },
];

export function SubscriptionStatusSelect({
  value,
  onValueChange,
  disabled,
}: SubscriptionStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange as (v: string) => void} disabled={disabled}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
