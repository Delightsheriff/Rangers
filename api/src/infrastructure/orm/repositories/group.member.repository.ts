import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupMemberEntity } from '../entities/group-member.entity';

@Injectable()
export class GroupMemberRepository {
  constructor(
    @InjectModel(GroupMemberEntity)
    private readonly groupMemberModel: typeof GroupMemberEntity,
  ) {}

  async createGroupMembersBulk(
    groupId: string,
    userIds: number[],
  ): Promise<GroupMemberEntity[]> {
    const records = userIds.map((userId) => ({ userId, groupId }));
    return this.groupMemberModel.bulkCreate(records, {
      ignoreDuplicates: true,
    });
  }

  async createGroupMember(
    userId: string,
    groupId: number,
  ): Promise<GroupMemberEntity> {
    return this.groupMemberModel.create({ userId, groupId });
  }

  async findAllByGroup(groupId: number): Promise<GroupMemberEntity[]> {
    return this.groupMemberModel.findAll({ where: { groupId } });
  }

  async findAllByUser(userId: number): Promise<GroupMemberEntity[]> {
    return this.groupMemberModel.findAll({ where: { userId } });
  }

  async deleteGroupMember(userId: number, groupId: number): Promise<number> {
    return this.groupMemberModel.destroy({ where: { userId, groupId } });
  }

  async isMember(userId: number, groupId: string): Promise<boolean> {
    const count = await this.groupMemberModel.count({
      where: { userId, groupId },
    });
    return count > 0;
  }
}
