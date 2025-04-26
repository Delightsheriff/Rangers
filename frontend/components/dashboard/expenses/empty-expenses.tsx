import { FilePlus } from 'lucide-react';
import { EmptyState } from '../empty-state';

interface EmptyExpensesProps {
  onAddExpense?: () => void;
}

export function EmptyExpenses({ onAddExpense }: EmptyExpensesProps) {
  return (
    <EmptyState
      icon={<FilePlus className="h-6 w-6 text-primary" />}
      title="No expenses yet"
      description="Start by adding your first expense to track your spending and split costs with others."
      actionText="Add First Expense"
      actionOnClick={onAddExpense}
      secondaryActionText="Learn More"
      secondaryActionOnClick={() => {
        // This would link to help docs in a real app
      }}
    />
  );
}
