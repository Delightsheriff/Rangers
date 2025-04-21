import { Module } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepository } from './user.repository';
import { GroupMemberEntity } from '../entities/group-member.entity';
import { GroupEntity } from '../entities/group.entity';
import { GroupRepository } from './group.repository';
import { GroupMemberRepository } from './group.member.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([UserEntity, GroupEntity, GroupMemberEntity]),
  ],
  providers: [UserRepository, GroupRepository, GroupMemberRepository],
  exports: [UserRepository, GroupRepository, GroupMemberRepository],
})
export class RepositoryModule {}
