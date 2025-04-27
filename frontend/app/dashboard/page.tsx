'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CurrentActivities from '@/components/dashboard/current-activities';
import { EmptyGroups } from '@/components/dashboard/groups/empty-groups';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { getUserGroups, getDashboardOverview, DashboardOverviewResult } from '@/lib/action';
import { Group } from '@/interface/group';
import { formatCurrency } from '@/lib/utils';
import { Loader2, ArrowRight } from 'lucide-react';

// Define types for dashboard data
type DashboardData = NonNullable<DashboardOverviewResult['data']>;
type RecentExpense = DashboardData['recentExpenses'][0];
type PendingInvitation = DashboardData['pendingInvitations'][0];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsLoadingDashboard(true);

        // Fetch groups
        const groupsResult = await getUserGroups();
        if (groupsResult.success && groupsResult.data) {
          setGroups(groupsResult.data.groups);
        } else {
          toast.error(groupsResult.error || 'Failed to load groups');
        }

        // Fetch dashboard overview
        const dashboardResult = await getDashboardOverview();
        if (dashboardResult.success && dashboardResult.data) {
          setDashboardData(dashboardResult.data);
        } else {
          toast.error(dashboardResult.error || 'Failed to load dashboard data');
        }
      } catch (error) {
        toast.error('An error occurred while loading data');
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsLoadingDashboard(false);
      }
    };

    fetchData();
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
          {isLoadingDashboard ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Groups</h3>
                      <p className="text-2xl font-bold">{dashboardData?.totalGroups || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Members</h3>
                      <p className="text-2xl font-bold">{dashboardData?.totalMembers || 0}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
                      <p className="text-2xl font-bold">
                        {formatCurrency(dashboardData?.totalAmount || 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-muted-foreground">Your Balance</h3>
                      <p
                        className={`text-2xl font-bold ${
                          (dashboardData?.userBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(dashboardData?.userBalance || 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Recent Expenses</h3>
                        <Link href="/dashboard/expenses">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            View All
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      {dashboardData?.recentExpenses && dashboardData.recentExpenses.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.recentExpenses.map((expense: RecentExpense) => (
                            <div key={expense._id} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{expense.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {expense.groupId.name}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(expense.amount)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-20 items-center justify-center text-muted-foreground">
                          No recent expenses
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Pending Invitations</h3>
                      </div>
                      {dashboardData?.pendingInvitations &&
                      dashboardData.pendingInvitations.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.pendingInvitations.map((invitation: PendingInvitation) => (
                            <div key={invitation._id} className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{invitation.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Invited by {invitation.creator.firstName}{' '}
                                  {invitation.creator.lastName}
                                </p>
                              </div>
                              <Link href={`/dashboard/groups/${invitation._id}`}>
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-20 items-center justify-center text-muted-foreground">
                          No pending invitations
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

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
            </>
          )}
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
