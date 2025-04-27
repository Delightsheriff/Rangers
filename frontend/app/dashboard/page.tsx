/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseSummary from '@/components/dashboard/expense-summary';
import CurrentActivities from '@/components/dashboard/current-activities';
import MyGroups from '@/app/dashboard/groups/page';
import { EmptyGroups } from '@/components/dashboard/groups/empty-groups';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [groups, setGroups] = useState([]); // Assuming you fetch groups data here

  return (
    <main className="flex-1 p-6">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.firstName}</p>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="groups">My Groups</TabsTrigger>
          <TabsTrigger value="activities">Current Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ExpenseSummary />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Invite friends</h3>
                  <p className="text-sm text-muted-foreground">
                    Add friends to start sharing expenses.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      toast('Invite sent');
                    }}
                  >
                    Send Invites
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Create a new group</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a group to track all expenses.
                  </p>
                  <Link href="/groups/new">
                    <Button variant="outline" className="mt-2 w-full">
                      Create Group
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Check expenses</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep tabs on what everyone owes in your group.
                  </p>
                  <Link href="/expenses">
                    <Button variant="outline" className="mt-2 w-full">
                      Check Expenses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <CurrentActivities />
        </TabsContent>
        <TabsContent value="groups" className="space-y-4">
          {groups.length > 0 ? <MyGroups /> : <EmptyGroups />}
        </TabsContent>
        <TabsContent value="activities" className="space-y-4">
          <CurrentActivities />
        </TabsContent>
      </Tabs>
    </main>
  );
}
