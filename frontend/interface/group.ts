export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  totalAmount: number;
  userBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GroupExpense {
  id: string;
  name: string;
  description: string;
  amount: number;
  date: string;
  paidBy: Array<{
    userId: string;
    amountPaid: number;
    paidAt: string;
  }>;
}

export interface GroupDetails {
  id: string;
  name: string;
  description: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  members: Array<{
    id: string | null;
    name: string | null;
    email: string;
    isActive: boolean;
    joinedAt: string;
  }>;
  invitedUsers: Array<{
    email: string;
    invitedAt: string;
  }>;
  expenses: GroupExpense[];
  totalAmount: number;
  userBalance: number;
  createdAt: string;
  updatedAt: string;
}
