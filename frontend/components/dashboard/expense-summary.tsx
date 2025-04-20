import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BadgeDollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export default function ExpenseSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$451.92</div>
          <p className="text-xs text-muted-foreground">Net balance across all groups</p>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>Assets vs. Debts</span>
              <span className="font-medium">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">You Are Owed</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">$520.00</div>
          <p className="text-xs text-muted-foreground">From 3 people across 2 groups</p>
          <div className="mt-4 grid gap-1">
            <div className="flex justify-between text-xs">
              <span>Morgan Chen</span>
              <span className="font-medium">$320.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Jordan Lee</span>
              <span className="font-medium">$120.00</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Taylor Smith</span>
              <span className="font-medium">$80.00</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">You Owe</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">$68.08</div>
          <p className="text-xs text-muted-foreground">To 1 person in 1 group</p>
          <div className="mt-4 grid gap-1">
            <div className="flex justify-between text-xs">
              <span>Riley Davis</span>
              <span className="font-medium">$68.08</span>
            </div>
            <div className="flex justify-between text-xs text-transparent">
              <span>Placeholder</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-xs text-transparent">
              <span>Placeholder</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">5 expenses</div>
          <p className="text-xs text-muted-foreground">Added in the last 7 days</p>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>Groups Activity</span>
              <span className="font-medium">3/4 active</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
