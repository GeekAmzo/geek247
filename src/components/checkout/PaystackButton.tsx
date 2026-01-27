import { Button } from '@/components/ui/button';
import { paystackService, type PaystackResponse } from '@/services/paystackService';
import { CreditCard } from 'lucide-react';

interface PaystackButtonProps {
  email: string;
  amountCents: number;
  currency: 'ZAR' | 'USD';
  planCode?: string;
  metadata?: Record<string, any>;
  onSuccess: (response: PaystackResponse) => void;
  onClose: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function PaystackButton({
  email,
  amountCents,
  currency,
  planCode,
  metadata,
  onSuccess,
  onClose,
  disabled,
  children,
}: PaystackButtonProps) {
  const handleClick = () => {
    paystackService.initializePayment({
      email,
      amountCents,
      currency,
      planCode,
      metadata,
      onSuccess,
      onClose,
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className="w-full"
    >
      <CreditCard className="w-4 h-4 mr-2" />
      {children || 'Pay Now'}
    </Button>
  );
}
