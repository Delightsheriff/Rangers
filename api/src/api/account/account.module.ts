import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/infrastructure/orm/repositories/repository.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [RepositoryModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
