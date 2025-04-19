import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { UserEntity } from './user.entity';
import { ExpenseParticipant } from './expense-participant.entity';

@Table
export class Expense extends Model<Expense> {
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  amount: number;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER, allowNull: false })
  payerId: number;

  @BelongsTo(() => UserEntity, 'payerId')
  payer: UserEntity;

  @BelongsToMany(() => UserEntity, () => ExpenseParticipant)
  participants: UserEntity[];
}