'use client';

import type React from 'react';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';

interface AddExpenseButtonProps {
  onSuccess?: () => void;
}

export default function AddExpenseButton({ onSuccess }: AddExpenseButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPeople, setSelectedPeople] = useState<string[]>([
    'member-1',
    'member-2',
    'member-3',
    'member-4',
  ]);

  // This would come from an API in a real app
  const groups = [
    { id: 'group-1', name: 'Apartment 304' },
    { id: 'group-2', name: 'Cancun Trip 2025' },
    { id: 'group-3', name: 'Dinner Club' },
    { id: 'group-4', name: 'Office Lunch Group' },
  ];

  // This would come from the selected group in a real app
  const members = [
    { id: 'member-1', name: 'You (Alex)', initials: 'AJ' },
    { id: 'member-2', name: 'Taylor Smith', initials: 'TS' },
    { id: 'member-3', name: 'Morgan Chen', initials: 'MC' },
    { id: 'member-4', name: 'Jordan Lee', initials: 'JL' },
    { id: 'member-5', name: 'Riley Davis', initials: 'RD' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setGroup('');
    setPaidBy('');
    setSplitType('equal');
    setDate(new Date());
    setSelectedPeople(['member-1', 'member-2', 'member-3', 'member-4']);
  };

  const togglePersonSelection = (memberId: string) => {
    setSelectedPeople((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    );
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
              <Select value={group} onValueChange={setGroup} required>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select group" />
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
              <Select value={paidBy} onValueChange={setPaidBy} required>
                <SelectTrigger id="paid-by">
                  <SelectValue placeholder="Who paid?" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Split between</Label>
              <div className="space-y-2 rounded-md border p-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`person-${member.id}`}
                      checked={selectedPeople.includes(member.id)}
                      onCheckedChange={() => togglePersonSelection(member.id)}
                    />
                    <Label
                      htmlFor={`person-${member.id}`}
                      className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                      </Avatar>
                      {member.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>How do you want to split the expense?</Label>
              <RadioGroup
                value={splitType}
                onValueChange={setSplitType}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="equal" id="split-equal" />
                  <Label
                    htmlFor="split-equal"
                    className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                  >
                    Split equally
                    <span className="text-xs text-muted-foreground">
                      (Everyone pays the same amount)
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="percentage" id="split-percentage" />
                  <Label
                    htmlFor="split-percentage"
                    className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                  >
                    Split by percentages
                    <span className="text-xs text-muted-foreground">
                      (Specify what percentage each person should pay)
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="custom" id="split-custom" />
                  <Label
                    htmlFor="split-custom"
                    className="flex cursor-pointer items-center gap-2 text-sm font-normal"
                  >
                    Split by custom amounts
                    <span className="text-xs text-muted-foreground">
                      (Specify exact amounts for each person)
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !amount ||
                !description ||
                !group ||
                !paidBy ||
                selectedPeople.length === 0
              }
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
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
