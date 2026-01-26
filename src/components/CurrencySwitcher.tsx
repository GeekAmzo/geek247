import { useCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

interface CurrencySwitcherProps {
  className?: string;
}

export function CurrencySwitcher({ className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-muted rounded-lg', className)}>
      <button
        onClick={() => setCurrency('ZAR')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
          currency === 'ZAR'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        ZAR (R)
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
          currency === 'USD'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        USD ($)
      </button>
    </div>
  );
}
