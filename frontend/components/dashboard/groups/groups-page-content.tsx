'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Group } from '@/interface/group';
import { FileText, Search, UserPlus, Users } from 'lucide-react';
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
  return (
    <>
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
    </>
  );
}
