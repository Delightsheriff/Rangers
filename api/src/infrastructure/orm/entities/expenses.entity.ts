import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { UserEntity } from './user.entity';
import { ExpenseParticipant } from './expenseparticipant.entity';

@Table
export class Expense extends Model {
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  amount: number;

  @ForeignKey(() => UserEntity)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'payer_id'})
  payerId: number;

  @Column({ field: 'created_at' })
  createdAt: Date;

  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsTo(() => UserEntity, 'payerId')
  payer: UserEntity;

  @BelongsToMany(() => UserEntity, () => ExpenseParticipant)
  participants: UserEntity[];
}