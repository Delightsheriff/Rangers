'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowRight,
  FileText,
  MoreHorizontal,
  Receipt,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { Group } from '@/interface/group';
import { cn } from '@/lib/utils';

interface groupsProps {
  groups: Group[];
}

export default function GroupsPageContent({ groups }: groupsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [modalType, setModalType] = useState<'invite' | 'leave' | 'delete' | null>(null);

  const filteredGroups = groups.filter((group) =>
    searchQuery
      ? group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  const closeModal = () => {
    setModalType(null);
    setSelectedGroupId(null);
    setInviteEmail('');
  };

  const openModal = (type: 'invite' | 'leave' | 'delete', groupId: string) => {
    setModalType(type);
    setSelectedGroupId(groupId);
  };

  const submitInvite = () => {
    if (selectedGroupId && inviteEmail) {
      console.log('Inviting to group:', selectedGroupId, 'Email:', inviteEmail);
      toast.success(`Invitation sent to ${inviteEmail}`);
      closeModal();
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const confirmLeaveGroup = () => {
    if (selectedGroupId) {
      console.log('Leaving group:', selectedGroupId);
      toast.info('This feature is coming soon.');
      closeModal();
    }
  };

  const confirmDeleteGroup = () => {
    if (selectedGroupId) {
      console.log('Deleting group:', selectedGroupId);
      toast.info('This feature is coming soon.');
      closeModal();
    }
  };

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No groups found</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first group to start tracking expenses'}
              </p>
              {!searchQuery && (
                <Link href="/groups/new" className="mt-4">
                  <Button>Create Group</Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span>{group.name}</span>
                          <span className="text-xs text-muted-foreground">{group.description}</span>
                        </div>
                        {group.isActive && (
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                            Active
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{group.members}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        {group.expenses}
                      </div>
                    </TableCell>
                    <TableCell>${group.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          'font-medium',
                          group.youOwe > 0
                            ? 'text-red-500'
                            : group.youAreOwed > 0
                            ? 'text-green-500'
                            : '',
                        )}
                      >
                        {group.youOwe > 0
                          ? `-$${group.youOwe.toFixed(2)}`
                          : group.youAreOwed > 0
                          ? `+$${group.youAreOwed.toFixed(2)}`
                          : '$0.00'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/groups/${group.id}`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            View
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openModal('invite', group.id)}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => openModal('leave', group.id)}
                            >
                              Leave Group
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => openModal('delete', group.id)}
                            >
                              Delete Group
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Create a New Group</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Start tracking expenses with friends, roommates, or colleagues.
              </p>
              <Link href="/dashboard/groups/new">
                <Button className="w-full">Create Group</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Join a Group</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Join an existing group with an invitation code.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info('This feature is coming soon.')}
              >
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite Member Modal */}
      <Dialog open={modalType === 'invite'} onOpenChange={(open) => (open ? null : closeModal())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>Enter the email of the person to invite.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={submitInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Group Modal */}
      <Dialog open={modalType === 'leave'} onOpenChange={(open) => (open ? null : closeModal())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group? You will lose access to its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeaveGroup}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Modal */}
      <Dialog open={modalType === 'delete'} onOpenChange={(open) => (open ? null : closeModal())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              This action is irreversible. All group data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteGroup}>
              Delete Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
