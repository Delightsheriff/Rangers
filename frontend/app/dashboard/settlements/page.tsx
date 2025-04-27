'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  ArrowRight,
  CheckCircle,
  Clock,
  Filter,
  Search,
  FileText,
  BellRing,
  ArrowUpDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/date-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EmptySettlements } from '@/components/dashboard/settlements/empty-settlements';
import { EmptyTransactions } from '@/components/dashboard/settlements/empty-transactions';

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // This would come from an API in a real app
  const balances = [
    {
      id: 'balance-1',
      name: 'Morgan Chen',
      initials: 'MC',
      amount: 320.0,
      isOwed: true,
      group: 'Apartment 304',
    },
    {
      id: 'balance-2',
      name: 'Jordan Lee',
      initials: 'JL',
      amount: 120.0,
      isOwed: true,
      group: 'Apartment 304',
    },
    {
      id: 'balance-3',
      name: 'Taylor Smith',
      initials: 'TS',
      amount: 80.0,
      isOwed: true,
      group: 'Office Lunch Group',
    },
    {
      id: 'balance-4',
      name: 'Riley Davis',
      initials: 'RD',
      amount: 68.08,
      isOwed: false,
      group: 'Cancun Trip 2025',
    },
  ];

  const transactions = [
    {
      id: 'trans-1',
      from: 'Morgan Chen',
      fromInitials: 'MC',
      to: 'You (Alex)',
      toInitials: 'AJ',
      amount: 150.0,
      date: new Date('2025-03-10'),
      status: 'completed',
      method: 'Bank Transfer',
      group: 'Apartment 304',
    },
    {
      id: 'trans-2',
      from: 'You (Alex)',
      fromInitials: 'AJ',
      to: 'Riley Davis',
      toInitials: 'RD',
      amount: 42.5,
      date: new Date('2025-03-05'),
      status: 'completed',
      method: 'In-App Payment',
      group: 'Cancun Trip 2025',
    },
    {
      id: 'trans-3',
      from: 'Jordan Lee',
      fromInitials: 'JL',
      to: 'You (Alex)',
      toInitials: 'AJ',
      amount: 60.0,
      date: new Date('2025-03-02'),
      status: 'completed',
      method: 'Cash',
      group: 'Apartment 304',
    },
    {
      id: 'trans-4',
      from: 'Taylor Smith',
      fromInitials: 'TS',
      to: 'You (Alex)',
      toInitials: 'AJ',
      amount: 35.0,
      date: new Date('2025-02-28'),
      status: 'completed',
      method: 'Venmo',
      group: 'Office Lunch Group',
    },
    {
      id: 'trans-5',
      from: 'You (Alex)',
      fromInitials: 'AJ',
      to: 'Riley Davis',
      toInitials: 'RD',
      amount: 25.58,
      date: new Date('2025-02-25'),
      status: 'pending',
      method: 'In-App Payment',
      group: 'Cancun Trip 2025',
    },
  ];

  // Filter transactions based on search query
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.from.toLowerCase().includes(query) ||
          transaction.to.toLowerCase().includes(query) ||
          transaction.method.toLowerCase().includes(query) ||
          transaction.group.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort transactions
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
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

  const handleRecordPayment = () => {
    if (!selectedPerson || !paymentMethod || !paymentAmount) {
      toast('Missing information', {
        description: 'Please fill in all fields to record a payment.',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPaymentModalOpen(false);

      // Reset form
      setSelectedPerson('');
      setPaymentMethod('');
      setPaymentAmount('');

      toast('Payment recorded');
    }, 1500);
  };

  const handleSendReminder = (personId: string) => {
    toast(`Reminder sent to person with ID: ${personId}`);
  };

  return (
    <div>
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settlements</h1>
            <p className="text-muted-foreground">Manage payments and track settlements</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Record a Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Record a Payment</DialogTitle>
                  <DialogDescription>
                    Record a payment you&apos;ve made or received outside the app.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="person">Person</Label>
                    <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                      <SelectTrigger id="person">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        {balances.map((balance) => (
                          <SelectItem key={balance.id} value={balance.id}>
                            {balance.name} ({balance.isOwed ? 'owes you' : 'you owe'} $
                            {balance.amount.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        className="pl-7"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger id="method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleRecordPayment} disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Recording...</span>
                      </div>
                    ) : (
                      'Record Payment'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$451.92</div>
                  <p className="text-xs text-muted-foreground">Net balance across all groups</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">You Are Owed</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-500"
                  >
                    <path d="m5 12 5 5 9-9" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">$520.00</div>
                  <p className="text-xs text-muted-foreground">From 3 people across 2 groups</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">You Owe</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-red-500"
                  >
                    <path d="m19 5-14 14" />
                    <path d="m5 5 14 14" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">$68.08</div>
                  <p className="text-xs text-muted-foreground">To 1 person in 1 group</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Settlements</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">In the last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {balances.length === 0 && (
              <EmptySettlements onRecordPayment={() => setIsPaymentModalOpen(true)} />
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>People Who Owe You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {balances
                      .filter((balance) => balance.isOwed)
                      .map((balance) => (
                        <div
                          key={balance.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{balance.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{balance.name}</p>
                              <p className="text-xs text-muted-foreground">{balance.group}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-500">
                              ${balance.amount.toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => handleSendReminder(balance.id)}
                            >
                              <BellRing className="h-3 w-3" />
                              Remind
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>People You Owe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {balances
                      .filter((balance) => !balance.isOwed)
                      .map((balance) => (
                        <div
                          key={balance.id}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{balance.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{balance.name}</p>
                              <p className="text-xs text-muted-foreground">{balance.group}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-500">
                              ${balance.amount.toFixed(2)}
                            </span>
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={() => {
                                setSelectedPerson(balance.id);
                                setPaymentAmount(balance.amount.toString());
                                setIsPaymentModalOpen(true);
                              }}
                            >
                              <CreditCard className="h-3 w-3" />
                              Pay
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="transactions" className="space-y-4">
            <div className="mb-6 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
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

            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead></TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>
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
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Group</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24">
                          {searchQuery ? (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                              <p className="text-lg font-medium">No transactions found</p>
                              <p className="text-sm text-muted-foreground">
                                Try adjusting your search query
                              </p>
                            </div>
                          ) : (
                            <EmptyTransactions />
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{transaction.fromInitials}</AvatarFallback>
                              </Avatar>
                              <span>{transaction.from}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{transaction.toInitials}</AvatarFallback>
                              </Avatar>
                              <span>{transaction.to}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ${transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>{formatDate(transaction.date, 'medium')}</TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.status === 'completed' ? 'secondary' : 'default'}
                              className={
                                transaction.status === 'completed'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-100'
                                  : ''
                              }
                            >
                              <div className="flex items-center gap-1">
                                {transaction.status === 'completed' ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                                {transaction.status === 'completed' ? 'Completed' : 'Pending'}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.group}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
