'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { addMemberToGroup, deleteGroup, leaveGroup } from '@/lib/action';

interface groupsProps {
  groups: Group[];
}

export default function GroupsPageContent({ groups }: groupsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [modalType, setModalType] = useState<'invite' | 'leave' | 'delete' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const filteredGroups = groups.filter((group) =>
    searchQuery
      ? group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  // Reset modal state when component unmounts
  useEffect(() => {
    return () => {
      setModalType(null);
      setSelectedGroupId(null);
      setInviteEmail('');
      setIsLoading(false);
    };
  }, []);

  const closeModal = () => {
    // Add a small delay to ensure state is properly reset
    setTimeout(() => {
      setModalType(null);
      setSelectedGroupId(null);
      setInviteEmail('');
      setIsLoading(false);
    }, 100);
  };

  const openModal = (type: 'invite' | 'leave' | 'delete', groupId: string) => {
    // Ensure any previous state is cleared before opening a new modal
    setModalType(null);
    setSelectedGroupId(null);
    setInviteEmail('');
    setIsLoading(false);

    // Small delay before opening the new modal
    setTimeout(() => {
      setModalType(type);
      setSelectedGroupId(groupId);
    }, 50);
  };

  const confirmInviteMember = async () => {
    if (!selectedGroupId || !inviteEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await addMemberToGroup(selectedGroupId, inviteEmail);
      if (result.success) {
        toast.success(result.message || `Invitation sent to ${inviteEmail}`);
        closeModal();
        // Refresh the page to get updated data
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error('An error occurred while sending the invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmLeaveGroup = async () => {
    if (!selectedGroupId) return;

    setIsLoading(true);
    try {
      const result = await leaveGroup(selectedGroupId);
      if (result.success) {
        toast.success(result.message || 'Successfully left the group');
        closeModal();
        // Refresh the page to get updated data
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to leave group');
      }
    } catch (err) {
      console.error('Error leaving group:', err);
      toast.error('An error occurred while leaving the group');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteGroup = async () => {
    if (!selectedGroupId) return;

    setIsLoading(true);
    try {
      const result = await deleteGroup(selectedGroupId);
      if (result.success) {
        toast.success(result.message || 'Group deleted successfully');
        closeModal();
        // Refresh the page to get updated data
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete group');
      }
    } catch (err) {
      console.error('Error deleting group:', err);
      toast.error('An error occurred while deleting the group');
    } finally {
      setIsLoading(false);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredGroups.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No groups found</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? 'No groups match your search criteria. Try a different search term.'
                : "You haven't created or joined any groups yet."}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/groups/new">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create a Group
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{group.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {group.description || 'No description provided'}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{group.members} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                    <span>{formatCurrency(group.totalAmount)} total</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={cn(group.userBalance >= 0 ? 'text-green-600' : 'text-red-600')}
                    >
                      {formatBalance(group.userBalance)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <div className="flex items-center justify-between border-t p-4">
                <Link href={`/dashboard/groups/${group.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => openModal('invite', group.id)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openModal('leave', group.id)}>
                      Leave Group
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openModal('delete', group.id)}
                      className="text-red-600"
                    >
                      Delete Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Invite Member Modal */}
      <Dialog open={modalType === 'invite'} onOpenChange={() => closeModal()}>
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
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={confirmInviteMember} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Group Modal */}
      <Dialog open={modalType === 'leave'} onOpenChange={() => closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group? You will no longer have access to its
              expenses.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLeaveGroup} disabled={isLoading}>
              {isLoading ? 'Leaving...' : 'Leave Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Modal */}
      <Dialog open={modalType === 'delete'} onOpenChange={() => closeModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteGroup} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
