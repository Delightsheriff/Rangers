import GroupsPageContent from '@/components/dashboard/groups/groups-page-content';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default async function page() {
  return (
    <main>
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage your expense sharing groups</p>
        </div>
        <Link href="/groups/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </Link>
      </div>
      <GroupsPageContent />
    </main>
  );
}
