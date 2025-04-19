import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupEntity } from './group.entity';
import { UserEntity } from './user.entity';
import { BadRequestException } from '@nestjs/common';

export class GroupService {
    constructor(
        @InjectModel(GroupEntity) private groupModel: typeof GroupEntity,
        @InjectModel(UserEntity) private userModel: typeof UserEntity,
      ) {}

      async createGroup(name: string, userIds: number[]) {
        const users = await this.userModel.findAll({ where: { id: userIds } });
        const foundIds = users.map(u => u.id);
        const notFound = userIds.filter(id => !foundIds.includes(id));
        if (notFound.length > 0) {
          throw new BadRequestException(`User(s) not found: ${notFound.join(', ')}`);
        }
        const group = await this.groupModel.create({ name });
        await group.$set('members', users);
        return {group, users};
      }
    }