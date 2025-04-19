import { Module } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepository } from './user.repository';
import { Expense } from '../entities/expenses.entity';
import { ExpenseParticipant } from '../entities/expenseParticipant.entity';
import { ExpenseService } from '../entities/expenses.service';
import { ExpenseController } from '../entities/expenses.controller'

@Module({
  imports: [SequelizeModule.forFeature([UserEntity, Expense, ExpenseParticipant])],
  providers: [UserRepository, ExpenseService],
  controllers: [ExpenseController],
  exports: [UserRepository],
})
export class RepositoryModule {}
