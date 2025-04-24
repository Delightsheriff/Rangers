'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date-utils';
import { Receipt, Download, Edit, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface ExpenseDetailModalProps {
  expense: {
    description: string;
    date: string;
    amount: number;
    participants: number;
    paidBy: string;
    paidByInitials: string;
    status: 'settled' | 'pending';
    group: string;
    category: string;
    split: string;
    receipt?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExpenseDetailModal({
  expense,
  open,
  onOpenChange,
}: ExpenseDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // This would come from an API in a real app
  const participants = [
    {
      name: 'You (Alex)',
      initials: 'AJ',
      amount: expense.amount / expense.participants,
      status:
        expense.paidBy === 'You (Alex)'
          ? 'paid'
          : expense.status === 'settled'
            ? 'paid'
            : 'pending',
    },
    {
      name: 'Taylor Smith',
      initials: 'TS',
      amount: expense.amount / expense.participants,
      status:
        expense.paidBy === 'Taylor Smith'
          ? 'paid'
          : expense.status === 'settled'
            ? 'paid'
            : 'pending',
    },
    {
      name: 'Morgan Chen',
      initials: 'MC',
      amount: expense.amount / expense.participants,
      status:
        expense.paidBy === 'Morgan Chen'
          ? 'paid'
          : expense.status === 'settled'
            ? 'paid'
            : 'pending',
    },
    {
      name: 'Jordan Lee',
      initials: 'JL',
      amount: expense.amount / expense.participants,
      status:
        expense.paidBy === 'Jordan Lee'
          ? 'paid'
          : expense.status === 'settled'
            ? 'paid'
            : 'pending',
    },
  ];

  if (expense.participants === 5) {
    participants.push({
      name: 'Riley Davis',
      initials: 'RD',
      amount: expense.amount / expense.participants,
      status:
        expense.paidBy === 'Riley Davis'
          ? 'paid'
          : expense.status === 'settled'
            ? 'paid'
            : 'pending',
    });
  }

  const paidCount = participants.filter((p) => p.status === 'paid').length;
  const progressPercentage = (paidCount / participants.length) * 100;

  const handleSettleExpense = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast( 'Payment recorded' );
    }, 1500);
  };

  const handleDownloadReceipt = () => {
    toast.success('Receipt downloaded successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{expense.description}</DialogTitle>
          <DialogDescription>Added on {formatDate(new Date(expense.date), 'long')}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${expense.amount.toFixed(2)}</p>
            </div>
            <Badge
              variant={expense.status === 'settled' ? 'secondary' : 'default'}
              className={
                expense.status === 'settled'
                  ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100'
                  : ''
              }
            >
              {expense.status === 'settled' ? 'Settled' : 'Pending'}
            </Badge>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Group</p>
              <p>{expense.group}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Category</p>
              <Badge variant="outline">{expense.category}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Split Method</p>
              <p>{expense.split}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Paid By</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{expense.paidByInitials}</AvatarFallback>
                </Avatar>
                <span>{expense.paidBy}</span>
              </div>
            </div>
            {expense.receipt && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Receipt</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={handleDownloadReceipt}
                >
                  <Receipt className="h-4 w-4" />
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">Participants</p>
              <div className="text-sm text-muted-foreground">
                {paidCount} of {participants.length} paid
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="mt-4 space-y-3">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{participant.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.status === 'paid' ? 'Paid' : 'Pending payment'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${participant.amount.toFixed(2)}</span>
                    {participant.status === 'pending' && participant.name === 'You (Alex)' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={handleSettleExpense}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-1">
                            <svg
                              className="h-3 w-3 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Paying...</span>
                          </div>
                        ) : (
                          <>
                            <CreditCard className="h-3 w-3" />
                            Pay
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            variant="outline"
            className="gap-1"
            onClick={() => {
              toast('Edit expense');
            }}
          >
            <Edit className="h-4 w-4" />
            Edit Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
