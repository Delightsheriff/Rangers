import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { GroupMemberRepository } from 'src/infrastructure/orm/repositories/group.member.repository';
import { GroupRepository } from 'src/infrastructure/orm/repositories/group.repository';
import { UserRepository } from 'src/infrastructure/orm/repositories/user.repository';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async create(name: string, userIds: number[]) {
    const users = await this.userRepository.findAll(userIds);

    const foundIds = users.map((u) => u.id);
    const notFound = userIds.filter((id) => !foundIds.includes(id));

    if (notFound.length > 0) {
      throw new BadRequestException(
        `User(s) not found: ${notFound.join(', ')}`,
      );
    }

    const group = await this.groupRepository.create(name, foundIds);
    await this.groupMemberRepository.createGroupMembersBulk(group.id, userIds);
    return group;
  }

  async findOne(id: string, userId: number) {
    const group = await this.groupRepository.findById(id);

    const groupMember = await this.groupMemberRepository.isMember(
      userId,
      group.id,
    );

    if (groupMember) return group;

    if (!group) throw new UnauthorizedException();

    return group;
  }

  async find(userId: number) {
    return await this.groupRepository.findAll(userId);
  }
}
