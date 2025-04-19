import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './api/health/health.module';
import { LoggerMiddleware } from './middlewares/logger';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfig } from './infrastructure/orm/sequelize.config';
import { AuthModule } from './api/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './api/auth/auth.guard';
import { AccountModule } from './api/account/account.module';
import { UserModule } from './infrastructure/orm/entities/user.module';

@Module({
  imports: [
    SequelizeModule.forRoot(SequelizeConfig),
    HealthModule,
    AuthModule,
    AccountModule,
    UserModule,
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
