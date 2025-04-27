/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import AddExpenseButton from '@/components/dashboard/expenses/add-expense-button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Search,
  Trash,
  Eye,
  ArrowUpDown,
  FileText,
  Download,
  Loader2,
} from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ExpenseDetailModal from '@/components/dashboard/expenses/expense-detail-modal';
import { EmptyExpenses } from '@/components/dashboard/expenses/empty-expenses';
import { getUserExpenses } from '@/lib/action';
import { AddExpenseButton } from '@/components/dashboard/expenses/add-expense-button';

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUserExpenses();
      if (result.success && result.data) {
        setExpenses(result.data.expenses);
      } else {
        setError(result.error || 'Failed to load expenses');
        toast.error(result.error || 'Failed to load expenses');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('An error occurred while loading expenses');
      toast.error('An error occurred while loading expenses');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter expenses based on search query and active tab
  const filteredExpenses =
    expenses && Array.isArray(expenses)
      ? expenses
          .filter((expense) => {
            // Filter by search query
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              return (
                (expense.name?.toLowerCase() || '').includes(query) ||
                (expense.description?.toLowerCase() || '').includes(query) ||
                (expense.groupId?.name?.toLowerCase() || '').includes(query)
              );
            }
            return true;
          })
          .filter((expense) => {
            // Filter by tab
            if (activeTab === 'all') return true;
            if (activeTab === 'paid-by-you')
              return expense.paidBy?.some((p: any) => p.userId === expense.currentUserId);
            if (activeTab === 'you-owe')
              return (
                !expense.paidBy?.some((p: any) => p.userId === expense.currentUserId) &&
                expense.status === 'pending'
              );
            if (activeTab === 'pending') return expense.status === 'pending';
            if (activeTab === 'settled') return expense.status === 'settled';
            return true;
          })
          .sort((a, b) => {
            // Sort expenses
            if (sortField === 'date') {
              return sortDirection === 'asc'
                ? new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
                : new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
            }
            if (sortField === 'amount') {
              return sortDirection === 'asc'
                ? (a.amount || 0) - (b.amount || 0)
                : (b.amount || 0) - (a.amount || 0);
            }
            if (sortField === 'description') {
              return sortDirection === 'asc'
                ? (a.name || '').localeCompare(b.name || '')
                : (b.name || '').localeCompare(a.name || '');
            }
            return 0;
          })
      : [];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewExpense = (expense: any) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    // TODO: Implement delete expense API call
    console.log(`Deleting expense with ID: ${expenseId}`);
    toast.success('Expense deleted successfully');
  };

  const handleExportExpenses = () => {
    toast('Expenses exported');
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3 text-destructive">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Error Loading Expenses</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={fetchExpenses}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">Manage and track all your expenses</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleExportExpenses}>
              <Download className="h-4 w-4" />
            </Button>
            <AddExpenseButton
              onSuccess={() => {
                fetchExpenses();
                toast.success('Expense added successfully');
              }}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="paid-by-you">Paid by You</TabsTrigger>
            <TabsTrigger value="you-owe">You Owe</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="settled">Settled</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader className="flex flex-row items-center">
                <CardTitle>
                  {activeTab === 'all' && 'All Expenses'}
                  {activeTab === 'paid-by-you' && 'Expenses Paid by You'}
                  {activeTab === 'you-owe' && 'Expenses You Owe'}
                  {activeTab === 'pending' && 'Pending Expenses'}
                  {activeTab === 'settled' && 'Settled Expenses'}
                </CardTitle>
                <div className="ml-auto text-sm text-muted-foreground">
                  {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 font-medium"
                            onClick={() => handleSort('description')}
                          >
                            Description
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 font-medium"
                            onClick={() => handleSort('amount')}
                          >
                            Amount
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 font-medium"
                            onClick={() => handleSort('date')}
                          >
                            Date
                            <ArrowUpDown className="h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Paid By</TableHead>
                        <TableHead className="hidden lg:table-cell">Group</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            {searchQuery ? (
                              <div className="flex flex-col items-center justify-center gap-1">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                                <p className="text-lg font-medium">No expenses found</p>
                                <p className="text-sm text-muted-foreground">
                                  Try adjusting your search query
                                </p>
                              </div>
                            ) : (
                              <EmptyExpenses
                                onAddExpense={() => {
                                  setIsDetailModalOpen(true);
                                  setSelectedExpense(null);
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExpenses.map((expense) => (
                          <TableRow key={expense.id} className="flex flex-col gap-2 sm:table-row">
                            <TableCell data-label="Description" className="font-medium">
                              <div className="flex items-center gap-2">{expense.name}</div>
                            </TableCell>
                            <TableCell data-label="Amount" className="hidden sm:table-cell">
                              ${expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell data-label="Date">
                              {formatDate(new Date(expense.date), 'medium')}
                            </TableCell>
                            <TableCell data-label="Paid By" className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {expense.paidBy[0]?.userName?.substring(0, 2).toUpperCase() ||
                                      expense.paidBy[0]?.userId
                                        ?.toString()
                                        .substring(0, 2)
                                        .toUpperCase() ||
                                      'NA'}
                                  </AvatarFallback>
                                </Avatar>
                                <span>
                                  {expense.paidBy[0]?.userName ||
                                    expense.paidBy[0]?.userId?.toString() ||
                                    'Unknown'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell data-label="Group" className="hidden lg:table-cell">
                              {expense.groupId.name}
                            </TableCell>
                            <TableCell data-label="Status">
                              <Badge
                                variant={expense.status === 'settled' ? 'secondary' : 'default'}
                                className={
                                  expense.status === 'settled'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100'
                                    : ''
                                }
                              >
                                {expense.status === 'settled' ? 'Settled' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell data-label="Actions" className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleViewExpense(expense)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteExpense(expense.id)}>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete expense
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      )}
    </div>
  );
}
