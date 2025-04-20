'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

interface creationFormProps {
  creatorEmail: string;
}

export default function GroupCreationForm({ creatorEmail }: creationFormProps) {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [members, setMembers] = useState([{ id: 'member-1', email: creatorEmail, isFixed: true }]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = () => {
    if (!newMemberEmail) return;
    if (members.find((m) => m.email === newMemberEmail)) {
      toast.warning('Member already added.');
      return;
    }

    setMembers([
      ...members,
      {
        id: `member-${members.length + 1}`,
        email: newMemberEmail,
        isFixed: false,
      },
    ]);
    setNewMemberEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) {
      toast.warning('Group name is required');
      return;
    }

    const submissionData = {
      groupName,
      groupDescription,
      members: members.map((m) => ({ email: m.email })),
    };

    console.log('🚀 Submitting:', submissionData);
    setIsLoading(true);

    setTimeout(() => {
      toast.success('Group created!');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Group Details</CardTitle>
            <CardDescription>Fill in group info and invite others via email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="e.g., Apartment Split"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-description">Group Description (optional)</Label>
              <Textarea
                id="group-description"
                placeholder="Add a short description..."
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Group Members</Label>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.email}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.email}</p>
                        {member.isFixed && <p className="text-xs text-muted-foreground">(you)</p>}
                      </div>
                    </div>
                    {!member.isFixed && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddMember}
                  disabled={!newMemberEmail}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !groupName}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
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
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A8 8 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Group'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
