'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';
import { getUserGroups } from '@/lib/action';
import { getGroupDetails } from '@/lib/action';
import { createExpense } from '@/lib/action';
import { toast } from 'sonner';
import { Group } from '@/interface/group';

interface Member {
  id: string | null;
  name: string | null;
  email: string;
  isActive: boolean;
  joinedAt: string;
  avatar?: string;
}

interface AddExpenseButtonProps {
  onSuccess?: () => void;
  groupId?: string;
}

export default function AddExpenseButton({ onSuccess, groupId }: AddExpenseButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Form state
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [paidBy, setPaidBy] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // Data state
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoadingGroups(true);
      try {
        const result = await getUserGroups();
        if (result.success && result.data) {
          setGroups(result.data.groups);

          // If groupId is provided, select it by default
          if (groupId && result.data.groups.some((g) => g.id === groupId)) {
            setSelectedGroupId(groupId);
            fetchMembers(groupId);
          }
        } else {
          toast.error(result.error || 'Failed to load groups');
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to load groups');
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchGroups();
  }, [groupId]);

  // Fetch members when a group is selected
  const fetchMembers = async (groupId: string) => {
    setIsLoadingMembers(true);
    try {
      const result = await getGroupDetails(groupId);
      if (result.success && result.data) {
        const groupMembers = result.data.group.members;
        setMembers(groupMembers);

        // Set all active members as selected by default
        const activeMemberIds = groupMembers
          .filter((member: Member) => member.isActive)
          .map((member: Member) => member.id || member.email);

        setSelectedPeople(activeMemberIds);

        // Set current user as the default payer
        if (activeMemberIds.length > 0) {
          setPaidBy(activeMemberIds[0]);
        }
      } else {
        toast.error(result.error || 'Failed to load group members');
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
      toast.error('Failed to load group members');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    fetchMembers(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calculate equal split amount
      const amountValue = parseFloat(amount);

      // Prepare paidBy data - only include the person who paid
      const paidByData = [
        {
          userId: paidBy,
          amountPaid: amountValue,
        },
      ];

      // Create expense
      const result = await createExpense({
        groupId: selectedGroupId,
        description,
        amount: amountValue,
        paidBy: paidByData,
      });

      if (result.success) {
        toast.success('Expense added successfully');
        setOpen(false);
        resetForm();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('An error occurred while adding the expense');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedGroupId(groupId || '');
    setPaidBy('');
    setDate(new Date());
    setSelectedPeople([]);
  };

  const togglePersonSelection = (memberId: string) => {
    setSelectedPeople((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    );
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a new expense</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new expense to your group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select
                value={selectedGroupId}
                onValueChange={handleGroupChange}
                required
                disabled={!!groupId || isLoadingGroups}
              >
                <SelectTrigger id="group">
                  <SelectValue
                    placeholder={isLoadingGroups ? 'Loading groups...' : 'Select group'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? formatDate(date, 'long') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="paid-by">Paid by</Label>
              <Select
                value={paidBy}
                onValueChange={setPaidBy}
                required
                disabled={isLoadingMembers || members.length === 0}
              >
                <SelectTrigger id="paid-by">
                  <SelectValue
                    placeholder={isLoadingMembers ? 'Loading members...' : 'Who paid?'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id || member.email} value={member.id || member.email}>
                      {member.name || member.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Split between</Label>
              <div className="space-y-2 rounded-md border p-4">
                {isLoadingMembers ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading members...</span>
                  </div>
                ) : members.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No members found in this group
                  </div>
                ) : (
                  members.map((member) => (
                    <div key={member.id || member.email} className="flex items-center space-x-2">
                      <Checkbox
                        id={`person-${member.id || member.email}`}
                        checked={selectedPeople.includes(member.id || member.email)}
                        onCheckedChange={() => togglePersonSelection(member.id || member.email)}
                        disabled={!member.isActive}
                      />
                      <Label
                        htmlFor={`person-${member.id || member.email}`}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 text-sm font-normal',
                          !member.isActive && 'text-muted-foreground',
                        )}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        {member.name || member.email}
                        {!member.isActive && ' (Pending)'}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="font-medium">Equal Split</p>
              <p className="text-muted-foreground">
                The expense will be split equally between all selected members.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !amount ||
                !description ||
                !selectedGroupId ||
                !paidBy ||
                selectedPeople.length === 0 ||
                isLoadingGroups ||
                isLoadingMembers
              }
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Expense'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
