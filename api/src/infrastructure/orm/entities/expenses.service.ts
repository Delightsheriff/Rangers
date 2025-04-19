import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Expense } from './expenses.entity';
import { UserEntity } from './user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense) private expenseModel: typeof Expense,
    @InjectModel(UserEntity) private userModel: typeof UserEntity,
  ) {}

  async createExpense(amount: number, payerId: number, participantIds: number[]) {
    const expense = await this.expenseModel.create({ amount, payerId });
    if (participantIds && participantIds.length > 0) {
      await expense.$set('participants', participantIds);
    }
    return this.expenseModel.findByPk(expense.id, {
      include: [
        { model: UserEntity, as: 'payer' },
        { model: UserEntity, as: 'participants' },
      ],
    });
  }
}