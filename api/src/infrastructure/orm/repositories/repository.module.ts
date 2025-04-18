import { Module } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepository } from './user.repository';
import { GroupMemberEntity} from '../entities/group-member.entity';
import { GroupEntity } from '../entities/group.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserEntity, GroupEntity, GroupMemberEntity])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoryModule {}
