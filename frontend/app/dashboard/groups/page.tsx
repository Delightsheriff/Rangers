import GroupsPageContent from '@/components/dashboard/groups/groups-page-content';
import { Button } from '@/components/ui/button';
import { getUserGroups } from '@/lib/action';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function GroupsPage() {
  const groupsResult = await getUserGroups();

  // Handle error case
  if (!groupsResult.success) {
    return (
      <main className="w-full">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="text-muted-foreground">Manage your expense sharing groups</p>
          </div>
          <Link href="/dashboard/groups/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </Link>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
          <p>Error loading groups: {groupsResult.error}</p>
        </div>
      </main>
    );
  }

  const groups = groupsResult.data?.groups || [];

  return (
    <main className="w-full">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage your expense sharing groups</p>
        </div>
        <Link href="/dashboard/groups/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </Link>
      </div>
      <GroupsPageContent groups={groups} />
    </main>
  );
}
