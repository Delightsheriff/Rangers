/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddExpenseButton from '@/components/dashboard/expenses/add-expense-button';
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
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash,
  Edit,
  Eye,
  ArrowUpDown,
  Receipt,
  FileText,
} from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ExpenseDetailModal from '@/components/dashboard/expenses/expense-detail-modal';
import { EmptyExpenses } from '@/components/dashboard/expenses/empty-expenses';

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // This would come from an API in a real app
  const allExpenses = [
    {
      id: 'exp-1',
      description: 'Hotel Booking',
      amount: 780.0,
      date: new Date('2025-03-15'),
      paidBy: 'You (Alex)',
      paidByInitials: 'AJ',
      category: 'Accommodation',
      group: 'Cancun Trip 2025',
      split: 'Equal',
      participants: 5,
      receipt: true,
      status: 'settled',
    },
    {
      id: 'exp-2',
      description: 'Airport Taxi',
      amount: 58.5,
      date: new Date('2025-03-16'),
      paidBy: 'Morgan Chen',
      paidByInitials: 'MC',
      category: 'Transportation',
      group: 'Cancun Trip 2025',
      split: 'Equal',
      participants: 5,
      receipt: false,
      status: 'pending',
    },
    {
      id: 'exp-3',
      description: 'Dinner at Seafood Palace',
      amount: 145.75,
      date: new Date('2025-03-16'),
      paidBy: 'Taylor Smith',
      paidByInitials: 'TS',
      category: 'Food',
      group: 'Cancun Trip 2025',
      split: 'Equal',
      participants: 5,
      receipt: true,
      status: 'pending',
    },
    {
      id: 'exp-4',
      description: 'Rent - March',
      amount: 1800.0,
      date: new Date('2025-03-01'),
      paidBy: 'You (Alex)',
      paidByInitials: 'AJ',
      category: 'Housing',
      group: 'Apartment 304',
      split: 'Equal',
      participants: 4,
      receipt: false,
      status: 'settled',
    },
    {
      id: 'exp-5',
      description: 'Electricity Bill',
      amount: 120.0,
      date: new Date('2025-03-05'),
      paidBy: 'Jordan Lee',
      paidByInitials: 'JL',
      category: 'Utilities',
      group: 'Apartment 304',
      split: 'Equal',
      participants: 4,
      receipt: true,
      status: 'settled',
    },
    {
      id: 'exp-6',
      description: 'Groceries',
      amount: 85.2,
      date: new Date('2025-03-08'),
      paidBy: 'Riley Davis',
      paidByInitials: 'RD',
      category: 'Food',
      group: 'Apartment 304',
      split: 'Equal',
      participants: 4,
      receipt: true,
      status: 'pending',
    },
    {
      id: 'exp-7',
      description: 'Internet',
      amount: 60.0,
      date: new Date('2025-03-10'),
      paidBy: 'Morgan Chen',
      paidByInitials: 'MC',
      category: 'Utilities',
      group: 'Apartment 304',
      split: 'Equal',
      participants: 4,
      receipt: false,
      status: 'pending',
    },
    {
      id: 'exp-8',
      description: 'Movie Tickets',
      amount: 48.0,
      date: new Date('2025-03-12'),
      paidBy: 'You (Alex)',
      paidByInitials: 'AJ',
      category: 'Entertainment',
      group: 'Dinner Club',
      split: 'Equal',
      participants: 6,
      receipt: false,
      status: 'pending',
    },
  ];

  // Filter expenses based on search query and active tab
  const filteredExpenses = allExpenses
    .filter((expense) => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          expense.description.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query) ||
          expense.group.toLowerCase().includes(query) ||
          expense.paidBy.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((expense) => {
      // Filter by tab
      if (activeTab === 'all') return true;
      if (activeTab === 'paid-by-you') return expense.paidBy === 'You (Alex)';
      if (activeTab === 'you-owe')
        return expense.paidBy !== 'You (Alex)' && expense.status === 'pending';
      if (activeTab === 'pending') return expense.status === 'pending';
      if (activeTab === 'settled') return expense.status === 'settled';
      return true;
    })
    .sort((a, b) => {
      // Sort expenses
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'description') {
        return sortDirection === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewExpense = (expense: {
    id: string;
    description: string;
    amount: number;
    date: Date;
    paidBy: string;
    paidByInitials: string;
    category: string;
    group: string;
    split: string;
    participants: number;
    receipt: boolean;
    status: string;
  }) => {
    setSelectedExpense(expense);
    setIsDetailModalOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    console.log(`Deleting expense with ID: ${expenseId}`);
    toast.success('Expense deleted successfully');
  };

  const handleEditExpense = (expenseId: string) => {
    toast(`Edit expense with ID: ${expenseId}`);
  };

  const handleExportExpenses = () => {
    toast('Expenses exported');
  };

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
                toast.success('Expense added successfully');
              }}
            />
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
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
                        <TableHead>Category</TableHead>
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
                              <div className="flex items-center gap-2">
                                {expense.description}
                                {expense.receipt && (
                                  <Receipt className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell data-label="Amount" className="hidden sm:table-cell">
                              ${expense.amount.toFixed(2)}
                            </TableCell>
                            <TableCell data-label="Date">
                              {formatDate(expense.date, 'medium')}
                            </TableCell>
                            <TableCell data-label="Paid By" className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {expense.paidByInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{expense.paidBy}</span>
                              </div>
                            </TableCell>
                            <TableCell data-label="Group" className="hidden lg:table-cell">
                              {expense.group}
                            </TableCell>
                            <TableCell data-label="Category">
                              <Badge variant="outline">{expense.category}</Badge>
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
                                  <DropdownMenuItem onClick={() => handleEditExpense(expense.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit expense
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
