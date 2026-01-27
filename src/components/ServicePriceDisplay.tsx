import { useCurrency } from '@/contexts/CurrencyContext';
import type { BillingInterval } from '@/types/services';

interface ServicePriceDisplayProps {
  zarMinCents: number;
  zarMaxCents: number | null;
  usdMinCents: number;
  usdMaxCents: number | null;
  billingInterval: BillingInterval;
  size?: 'sm' | 'md' | 'lg';
}

const intervalLabels: Record<BillingInterval, string> = {
  monthly: '/month',
  once_off: 'once-off',
  custom: '',
};

function formatCents(cents: number, currencyCode: 'ZAR' | 'USD'): string {
  const amount = cents / 100;
  if (currencyCode === 'ZAR') {
    return `R${amount.toLocaleString('en-ZA')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function ServicePriceDisplay({
  zarMinCents,
  zarMaxCents,
  usdMinCents,
  usdMaxCents,
  billingInterval,
  size = 'md',
}: ServicePriceDisplayProps) {
  const { currency } = useCurrency();

  const minCents = currency === 'ZAR' ? zarMinCents : usdMinCents;
  const maxCents = currency === 'ZAR' ? zarMaxCents : usdMaxCents;

  const sizeClasses = {
    sm: 'text-lg font-bold',
    md: 'text-2xl font-bold',
    lg: 'text-4xl font-bold',
  };

  const intervalClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const formattedMin = formatCents(minCents, currency);
  const formattedMax = maxCents ? formatCents(maxCents, currency) : null;

  return (
    <div className="flex items-baseline gap-1">
      <span className={`${sizeClasses[size]} text-foreground`}>
        {formattedMin}
        {formattedMax && ` – ${formattedMax}`}
      </span>
      {billingInterval !== 'custom' && (
        <span className={`${intervalClass[size]} text-muted-foreground font-normal`}>
          {intervalLabels[billingInterval]}
        </span>
      )}
    </div>
  );
}
