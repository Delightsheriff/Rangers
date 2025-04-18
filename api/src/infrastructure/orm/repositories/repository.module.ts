import { Module } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepository } from './user.repository';
import { GroupMemberEntity} from '../entities/group-member.entity';
import { GroupEntity } from '../entities/group.entity';
import { GroupService } from '../entities/group.service'
import { GroupController } from '../entities/group.controller'

@Module({
  imports: [SequelizeModule.forFeature([UserEntity, GroupEntity, GroupMemberEntity])],
  providers: [UserRepository, GroupService],
  controllers: [ GroupController ],
  exports: [UserRepository],
})
export class RepositoryModule {}
