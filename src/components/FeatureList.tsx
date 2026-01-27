import { Check, X } from 'lucide-react';
import type { ServiceFeature } from '@/types/services';

interface FeatureListProps {
  features: ServiceFeature[];
  variant?: 'included' | 'excluded';
}

export function FeatureList({ features, variant = 'included' }: FeatureListProps) {
  if (features.length === 0) return null;

  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          {variant === 'included' ? (
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-primary" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 mt-0.5">
              <X className="w-3 h-3 text-destructive" />
            </div>
          )}
          <span className={variant === 'excluded' ? 'text-muted-foreground' : 'text-foreground'}>
            {feature.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
