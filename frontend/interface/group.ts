export interface Group {
  id: string;
  name: string;
  members: number;
  expenses: number;
  totalAmount: number;
  youOwe: number;
  youAreOwed: number;
  isActive: boolean;
  description: string;
}
