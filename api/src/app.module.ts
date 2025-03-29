import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthModule } from './api/health/health.module';
import { LoggerMiddleware } from './middlewares/logger';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeConfig } from './infrastructure/orm/sequelize.config';
import { AuthModule } from './api/auth/auth.module'

@Module({
  imports: [SequelizeModule.forRoot(SequelizeConfig), HealthModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
