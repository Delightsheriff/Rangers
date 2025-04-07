import { Module } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepository } from './user.repository';

@Module({
  imports: [SequelizeModule.forFeature([UserEntity])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
