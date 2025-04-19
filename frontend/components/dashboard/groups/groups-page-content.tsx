'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Group } from '@/interface/group';
import { Search, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface groupsProps {
  groups: Group[];
}

export default function GroupsPageContent({ groups }: groupsProps) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Groups</CardTitle>
        </CardHeader>
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
