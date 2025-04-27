'use client';

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
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

interface ExpenseDetailModalProps {
  expense: {
    id: string;
    name: string;
    description: string;
    amount: number;
    date: string;
    groupId: {
      id: string;
      name: string;
    };
    paidBy: Array<{
      userId: string;
      userName?: string;
      amountPaid: number;
      paidAt: string;
    }>;
    status: 'pending' | 'settled';
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExpenseDetailModal({
  expense,
  open,
  onOpenChange,
}: ExpenseDetailModalProps) {
  // Get the payer (first person in paidBy array)
  const payer = expense.paidBy[0];

  // Get other participants (excluding the payer)
  const participants = expense.paidBy.slice(1);

  // Calculate the amount each participant should pay
  const amountPerPerson = expense.amount / expense.paidBy.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{expense.name}</DialogTitle>
          <DialogDescription>
            Added on {formatDate(new Date(expense.date), 'long')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${(expense.amount || 0).toFixed(2)}</p>
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
              <p>{expense.groupId.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Description</p>
              <p>{expense.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Paid By</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {payer?.userName?.substring(0, 2).toUpperCase() ||
                      payer?.userId?.toString().substring(0, 2).toUpperCase() ||
                      'NA'}
                  </AvatarFallback>
                </Avatar>
                <span>{payer?.userName || payer?.userId?.toString() || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="font-medium">Participants</p>
              <div className="text-sm text-muted-foreground">
                {participants.length} other members
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {participants.map((participant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {participant.userName?.substring(0, 2).toUpperCase() ||
                          participant.userId?.toString().substring(0, 2).toUpperCase() ||
                          'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {participant.userName || participant.userId?.toString() || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(participant.amountPaid || 0) > 0 ? 'Paid' : 'Pending payment'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Should pay</p>
                      <p className="font-medium">${amountPerPerson.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Has paid</p>
                      <p className="font-medium">${(participant.amountPaid || 0).toFixed(2)}</p>
                    </div>
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
