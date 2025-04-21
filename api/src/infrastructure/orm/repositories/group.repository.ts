import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupEntity } from '../entities/group.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class GroupRepository {
  constructor(
    @InjectModel(GroupEntity) private groupModel: typeof GroupEntity,
  ) {}

  async create(name: string, userIds: Array<number>) {
    return await this.groupModel.create({
      name,
      members: userIds,
    });
  }

  async findById(id: string) {
    return await this.groupModel.findByPk(id);
  }

  async findAll(userId: number) {
    return await this.groupModel.findAll({
      include: {
        model: UserEntity,
        where: { id: userId },
      },
    });
  }
}
