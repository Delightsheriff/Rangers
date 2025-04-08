import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Rangers APP API')
    .setDescription('Rangers APP API Documentation')
    .setVersion('0.1')
    .addTag('rangers-api')
    .addBearerAuth()
    .addServer('https://rangers-xujq.onrender.com/', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
