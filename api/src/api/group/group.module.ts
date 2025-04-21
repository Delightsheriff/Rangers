import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/orm/repositories/repository.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [RepositoryModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
