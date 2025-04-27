/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpenseSummary from '@/components/dashboard/expense-summary';
import CurrentActivities from '@/components/dashboard/current-activities';
import { EmptyGroups } from '@/components/dashboard/groups/empty-groups';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { getUserGroups } from '@/lib/action';
import { Group } from '@/interface/group';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const result = await getUserGroups();
        if (result.success && result.data) {
          setGroups(result.data.groups);
        } else {
          toast.error(result.error || 'Failed to load groups');
        }
      } catch (error) {
        toast.error('An error occurred while loading groups');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

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
                  <Link href="dashboard/groups/new">
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
                  <Link href="/dashboard/expenses">
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
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : groups.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <Link href={`/dashboard/groups/${group.id}`} key={group.id}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <span className="text-sm text-muted-foreground">
                            {group.members} members
                          </span>
                          <span className="text-sm font-medium">
                            {group.totalAmount > 0
                              ? `$${group.totalAmount.toFixed(2)}`
                              : 'No expenses'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyGroups />
          )}
        </TabsContent>
        <TabsContent value="activities" className="space-y-4">
          <CurrentActivities />
        </TabsContent>
      </Tabs>
    </main>
  );
}
