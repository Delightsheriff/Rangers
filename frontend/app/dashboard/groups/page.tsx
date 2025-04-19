import GroupsPageContent from '@/components/dashboard/groups/groups-page-content';
import { Button } from '@/components/ui/button';
import { Group } from '@/interface/group';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const groups: Group[] = [
  {
    id: '1',
    name: 'Easter 2025 camp trip',
    members: 4,
    expenses: 12,
    totalAmount: 1245.6,
    youOwe: 0,
    youAreOwed: 320.0,
    isActive: true,
    description: 'Expenses for our shared apartment',
  },
  {
    id: '2',
    name: 'Spring Break 2024',
    members: 5,
    expenses: 8,
    totalAmount: 984.25,
    youOwe: 68.08,
    youAreOwed: 0,
    isActive: true,
    description: 'Our awesome spring break trip',
  },
  {
    id: '3',
    name: 'Dinner Club',
    members: 6,
    expenses: 15,
    totalAmount: 1325.5,
    youOwe: 0,
    youAreOwed: 120.0,
    isActive: true,
    description: 'Monthly dinner outings with friends',
  },
  {
    id: '4',
    name: 'Office Lunch Group',
    members: 8,
    expenses: 20,
    totalAmount: 845.75,
    youOwe: 0,
    youAreOwed: 80.0,
    isActive: true,
    description: 'Lunch rotation with coworkers',
  },
];

export default async function page() {
  return (
    <main className="w-full">
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
      <GroupsPageContent groups={groups} />
    </main>
  );
}
