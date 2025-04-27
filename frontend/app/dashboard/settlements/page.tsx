'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserExpenses } from '@/lib/action';
import { Expense } from '@/types/expense';
import { formatDate } from '@/lib/date-utils';

export default function SettlementsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const result = await getUserExpenses();
        if (result.success && result.data?.expenses) {
          // Transform the API response to match our Expense type
          const transformedExpenses = result.data.expenses.map((expense) => ({
            _id: expense.id,
            name: expense.name,
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            groupId: expense.groupId.id,
            paidBy: expense.paidBy,
            status: expense.status,
            createdAt: new Date().toISOString(), // These fields aren't in the API response
            updatedAt: new Date().toISOString(), // but are required by our type
          }));
          setExpenses(transformedExpenses);
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settlements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenses.map((expense) => (
          <Card key={expense._id}>
            <CardHeader>
              <CardTitle>{expense.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Date: {formatDate(new Date(expense.date))}</p>
                <p className="text-sm text-gray-500">Amount: ${expense.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Status: {expense.status}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
