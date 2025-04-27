export interface Expense {
  _id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  groupId: string;
  paidBy: {
    userId: string;
    amountPaid: number;
    paidAt: string;
  }[];
  status: 'pending' | 'settled';
  createdAt: string;
  updatedAt: string;
}
