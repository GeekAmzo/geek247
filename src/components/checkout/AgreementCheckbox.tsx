import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AgreementCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  type: 'tos' | 'sla';
  error?: string;
}

const config = {
  tos: {
    label: 'Terms of Service',
    link: '/terms',
  },
  sla: {
    label: 'Service Level Agreement',
    link: '/sla',
  },
};

export function AgreementCheckbox({
  id,
  checked,
  onCheckedChange,
  type,
  error,
}: AgreementCheckboxProps) {
  const { label, link } = config[type];

  return (
    <div className="space-y-1">
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(val) => onCheckedChange(val === true)}
        />
        <Label htmlFor={id} className="text-sm leading-relaxed cursor-pointer">
          I agree to the{' '}
          <Link
            to={link}
            target="_blank"
            className="text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {label}
          </Link>
        </Label>
      </div>
      {error && <p className="text-sm text-destructive ml-7">{error}</p>}
    </div>
  );
}
