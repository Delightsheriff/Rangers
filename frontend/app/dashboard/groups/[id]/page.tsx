'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Edit, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import { getGroupDetails, GroupDetails } from '@/lib/action';

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getGroupDetails(groupId);

        if (result.success && result.data) {
          setGroup(result.data.group);
        } else {
          setError(result.error || 'Failed to load group details');
          toast.error(result.error || 'Failed to load group details');
        }
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('An error occurred while loading the group');
        toast.error('An error occurred while loading the group');
      } finally {
        setIsLoading(false);
      }
    };

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading group details...</p>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Error Loading Group</h2>
          <p className="mt-2 text-muted-foreground">{error || 'Group not found'}</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/groups')}>
            Back to Groups
          </Button>
        </div>
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/groups">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <Badge variant="outline" className="ml-2">
                {group.members.length} members
              </Badge>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => {
                    toast('This feature is coming soon.');
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit Group
                </Button>
                <Button>Add Expense</Button>
              </div>
            </div>
            <p className="mt-1 text-muted-foreground">{group.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Members</h2>
            <div className="flex flex-wrap gap-2">
              {group.members.map((member) => (
                <div
                  key={member.email}
                  className="flex items-center gap-2 rounded-full border p-1 pr-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.name || member.email}</span>
                  {member.isActive ? (
                    <Badge variant="outline" className="ml-1 h-5 text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-1 h-5 text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-full"
                onClick={() => {
                  toast('This feature is coming soon.');
                }}
              >
                <UserPlus className="h-4 w-4" />
                Invite
              </Button>
            </div>
          </div>

          {group.invitedUsers.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-lg font-semibold">Pending Invitations</h2>
              <div className="rounded-md border">
                <div className="grid grid-cols-2 gap-4 p-4 text-sm font-medium text-muted-foreground">
                  <div>Email</div>
                  <div>Invited On</div>
                </div>
                {group.invitedUsers.map((invite) => (
                  <div key={invite.email} className="grid grid-cols-2 gap-4 border-t p-4">
                    <div>{invite.email}</div>
                    <div>{new Date(invite.invitedAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Group Information</h2>
            <div className="rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Created by</div>
                <div>{group.creator.name}</div>

                <div className="text-sm font-medium text-muted-foreground">Created on</div>
                <div>{new Date(group.createdAt).toLocaleDateString()}</div>

                <div className="text-sm font-medium text-muted-foreground">Last updated</div>
                <div>{new Date(group.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
