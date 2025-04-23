import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateGroupDto } from './dtos/group.dto';
import { GroupService } from './group.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth';
import { UserEntity } from 'src/infrastructure/orm/entities/user.entity';

@ApiBearerAuth()
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createGroup(@Body() dto: CreateGroupDto) {
    const group = await this.groupService.create(dto.name, dto.memberIds);
    return group;
  }

  @Get()
  async findGroups(@AuthUser() user: UserEntity) {
    return await this.groupService.find(user.id);
  }

  @Get('id')
  async findOneGroup(
    @AuthUser() user: UserEntity,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.groupService.findOne(id, user.id);
  }
}
