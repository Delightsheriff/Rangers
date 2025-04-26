import { CreditCard } from 'lucide-react';
import { EmptyState } from '../empty-state';

interface EmptySettlementsProps {
  onRecordPayment?: () => void;
}

export function EmptySettlements({ onRecordPayment }: EmptySettlementsProps) {
  return (
    <EmptyState
      icon={<CreditCard className="h-6 w-6 text-primary" />}
      title="No settlements yet"
      description="Start recording payments to keep track of who owes what in your groups."
      actionText="Record a Payment"
      actionOnClick={onRecordPayment}
    />
  );
}
