import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupEntity } from './group.entity';
import { UserEntity } from './user.entity';

export class GroupService {
    constructor(
        @InjectModel(GroupEntity) private groupModel: typeof GroupEntity,
        @InjectModel(UserEntity) private userModel: typeof UserEntity,
      ) {}

  async createGroup(name: string, userIds: number[]) {
    const group = await GroupEntity.create({ name });
    const users = await UserEntity.findAll({ where: { id: userIds } });
    await group.$set('members', users);
    return group;
  }
}