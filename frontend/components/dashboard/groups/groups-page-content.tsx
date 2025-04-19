'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Group } from '@/interface/group';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  FileText,
  MoreHorizontal,
  Receipt,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

interface groupsProps {
  groups: Group[];
}

export default function GroupsPageContent({ groups }: groupsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter((group) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        group.name.toLowerCase().includes(query) || group.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleLeaveGroup = (groupId: string) => {
    console.log('Leave group:', groupId);
    toast.info('This feature is coming soon.');
  };

  const handleDeleteGroup = (groupId: string) => {
    console.log('Delete group:', groupId);
    toast.info('This feature is coming soon.');
  };

  return (
    <section className="w-full">
      {/* Search Bar */}
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
              {/* <TableHeader className="hidden md:table-header-group"> */}
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
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info('This feature is coming soon.');
                              }}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast('This feature is coming soon.');
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                              >
                                <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
                                <path d="M7 12h14l-3-3m0 6 3-3" />
                              </svg>
                              Leave Group
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
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

      {/* Footer */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 ">
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
              <Link href="/groups/new">
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
                onClick={() => {
                  toast.info('This feature is coming soon.');
                }}
              >
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
