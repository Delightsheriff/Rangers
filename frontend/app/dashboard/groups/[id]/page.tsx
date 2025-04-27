'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Loader2, Receipt, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { getGroupDetails, addMemberToGroup } from '@/lib/action';
import { GroupDetails, GroupExpense } from '@/interface/group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AddExpenseButton from '@/components/dashboard/expenses/add-expense-button';
import { cn } from '@/lib/utils';

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviteLoading, setIsInviteLoading] = useState(false);

  const fetchGroupDetails = async () => {
    try {
      const result = await getGroupDetails(groupId);
      if (result.success && result.data) {
        setGroup(result.data.group);
      } else {
        toast.error(result.error || 'Failed to load group details');
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
      toast.error('Failed to load group details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
    setInviteEmail('');
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setIsInviteLoading(false);
  };

  const submitInvite = async () => {
    if (!inviteEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsInviteLoading(true);
    try {
      const result = await addMemberToGroup(groupId, inviteEmail);
      if (result.success) {
        toast.success(result.message || `Invitation sent to ${inviteEmail}`);
        // Refresh the group details
        const updatedResult = await getGroupDetails(groupId);
        if (updatedResult.success && updatedResult.data) {
          setGroup(updatedResult.data.group);
        }
        closeInviteModal();
      } else {
        toast.error(result.error || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error('An error occurred while sending the invitation');
    } finally {
      setIsInviteLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format balance display
  const formatBalance = (balance: number) => {
    const formattedAmount = formatCurrency(Math.abs(balance));
    return balance >= 0 ? `You are owed ${formattedAmount}` : `You owe ${formattedAmount}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Error Loading Group</h2>
            <p className="text-sm text-muted-foreground">{error || 'Group not found'}</p>
          </div>
          <Button onClick={() => router.push('/dashboard/groups')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Update the Member type to match the actual data structure
  type Member = {
    id: string | null;
    name: string | null;
    email: string;
    isActive: boolean;
    joinedAt: string;
    avatar?: string;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/groups')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{group.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openInviteModal}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
          <AddExpenseButton onSuccess={fetchGroupDetails} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Group Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{group.description || 'No description provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created by</p>
                <p>{group.creator.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created on</p>
                <p>{formatDate(group.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Expenses</h2>
            {group.expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Receipt className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No expenses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {group.expenses.map((expense: GroupExpense) => (
                  <div key={expense.id} className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{expense.name}</h3>
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(expense.amount)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">Paid by:</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {expense.paidBy.map((payment) => (
                          <Badge key={payment.userId} variant="outline">
                            {payment.amountPaid > 0
                              ? `${formatCurrency(payment.amountPaid)}`
                              : 'No payment'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-6 rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-semibold">{formatCurrency(group.totalAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Balance</p>
                <p
                  className={cn(
                    'text-xl font-semibold',
                    group.userBalance >= 0 ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {formatBalance(group.userBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Members</h2>
            <div className="space-y-4">
              {group.members.map((member: Member) => (
                <div key={member.email} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name || member.email}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  {member.isActive ? (
                    <Badge className="ml-auto">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="ml-auto">
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Enter the email address of the person you want to invite to this group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={isInviteLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeInviteModal} disabled={isInviteLoading}>
              Cancel
            </Button>
            <Button onClick={submitInvite} disabled={isInviteLoading}>
              {isInviteLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
