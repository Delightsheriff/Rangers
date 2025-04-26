import { ArrowUpDown } from 'lucide-react';
import { EmptyState } from '../empty-state';

export function EmptyTransactions() {
  return (
    <EmptyState
      icon={<ArrowUpDown className="h-6 w-6 text-primary" />}
      title="No transactions yet"
      description="Your transaction history will appear here once you've made or received payments."
      actionText="Go to Settlements"
      actionLink="/settlements"
    />
  );
}
