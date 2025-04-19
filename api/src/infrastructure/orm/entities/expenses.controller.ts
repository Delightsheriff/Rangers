import { Controller, Post, Body } from '@nestjs/common';
import { ExpenseService } from './expenses.service';
import { CreateExpenseDto } from './expenses.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async create(@Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpense(dto.amount, dto.payerId, dto.participantIds);
  }
}
