import { Controller, Post, Body } from '@nestjs/common';
import { ExpenseService } from './expenses.service';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() body: { amount: number; payerId: number; participantIds: number[] }) {
    return this.expenseService.createExpense(body.amount, body.payerId, body.participantIds);
  }
}