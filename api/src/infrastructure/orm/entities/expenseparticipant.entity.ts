import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import { Expense } from './expenses.entity';
import { UserEntity } from './user.entity';

@Table({ tableName: 'expense_participants'})
export class ExpenseParticipant extends Model {
  @ForeignKey(() => Expense)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'expense_id'})
  expenseId: number;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  userId: number;
}