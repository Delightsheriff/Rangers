import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../infrastructure/orm/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    // ... other imports
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}