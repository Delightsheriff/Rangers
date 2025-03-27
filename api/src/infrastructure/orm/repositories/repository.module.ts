import { Module } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([UserEntity])],
  providers: [],
  exports: [],
})
export class RepositoryModule {}
