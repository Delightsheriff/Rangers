import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup/swagger';
import { PORT } from './infrastructure/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  app.enableCors();

  await app.listen(PORT);
}
bootstrap();
