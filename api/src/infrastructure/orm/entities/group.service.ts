// ...existing code...
import { GroupEntity } from './group.entity';
import { UserEntity } from './user.entity';

export class GroupService {
  async createGroup(name: string, userIds: number[]) {
    const group = await GroupEntity.create({ name });
    const users = await UserEntity.findAll({ where: { id: userIds } });
    await group.$set('members', users);
    return group;
  }
}