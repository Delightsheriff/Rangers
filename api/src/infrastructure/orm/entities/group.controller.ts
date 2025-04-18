import { Body, Controller, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './group.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@Body() dto: CreateGroupDto) {
    const group = await this.groupService.createGroup(dto.name, dto.memberIds);
    return group;
  }
}
