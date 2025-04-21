import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './api/health/health.module';
import { LoggerMiddleware } from './middlewares/logger';
import { SequelizeConfig } from './infrastructure/orm/sequelize.config';
import { AuthModule } from './api/auth/auth.module';
import { AuthGuard } from './api/auth/auth.guard';
import { AccountModule } from './api/account/account.module';
import { GroupModule } from './api/group/group.module';

@Module({
  imports: [
    SequelizeModule.forRoot(SequelizeConfig),
    HealthModule,
    AuthModule,
    AccountModule,
    GroupModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
