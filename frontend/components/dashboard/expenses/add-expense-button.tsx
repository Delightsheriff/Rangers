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
import { getUserGroups, getGroupDetails, createExpense } from '@/lib/action';
import { toast } from 'sonner';
import type { Group as IGroup } from '@/interface/group';

interface Member {
  id: string | null;
  name: string | null;
  email: string;
  isActive: boolean;
  joinedAt: string;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
}

export function AddExpenseButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [paidBy, setPaidBy] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const result = await getUserGroups();
        if (result.success && result.data) {
          setGroups(result.data.groups);
        }
      } catch {
        toast.error('Failed to fetch groups');
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (selectedGroupId) {
        try {
          const result = await getGroupDetails(selectedGroupId);
          if (result.success && result.data) {
            setSelectedGroup(result.data.group);
          }
        } catch {
          toast.error('Failed to fetch group details');
        }
      }
    };
    fetchGroupDetails();
  }, [selectedGroupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createExpense({
        groupId: selectedGroupId,
        description,
        amount: parseFloat(amount),
        paidBy: [{ userId: paidBy, amountPaid: parseFloat(amount) }],
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create expense');
      }

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to your group. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a group" />
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
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter expense description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {selectedGroup?.members.map((member) => (
                    <SelectItem key={member.id} value={member.id || ''}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Split Between</Label>
              <div className="grid gap-2">
                {selectedGroup?.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={member.id || ''}
                      checked={selectedPeople.includes(member.id || '')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPeople([...selectedPeople, member.id || '']);
                        } else {
                          setSelectedPeople(selectedPeople.filter((id) => id !== member.id));
                        }
                      }}
                    />
                    <Label htmlFor={member.id || ''}>{member.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
