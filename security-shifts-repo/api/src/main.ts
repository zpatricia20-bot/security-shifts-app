// src/main.ts

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map(o => o.trim()),
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Security Shifts API')
    .setDescription('Security services shift management system')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Operators')
    .addTag('Shifts')
    .addTag('Attendance')
    .addTag('Pay')
    .addTag('WhatsApp')
    .addTag('Import')
    .addTag('Files')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.API_PORT || '4000', 10);
  const host = process.env.API_HOST || '0.0.0.0';

  await app.listen(port, host);

  console.log(`
╔════════════════════════════════════════════════╗
║  🔐 Security Shifts API started                ║
║  🌐 http://${host}:${port}                             ║
║  📚 Docs: http://${host}:${port}/api                  ║
╚════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
