// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { OperatorsModule } from '@/operators/operators.module';
import { ShopsModule } from '@/shops/shops.module';
import { ShiftsModule } from '@/shifts/shifts.module';
import { DocumentsModule } from '@/documents/documents.module';
import { PayModule } from '@/pay/pay.module';
import { WhatsAppModule } from '@/whatsapp/whatsapp.module';
import { ImportModule } from '@/import/import.module';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      },
    ]),
    PrismaModule,
    AuthModule,
    OperatorsModule,
    ShopsModule,
    ShiftsModule,
    DocumentsModule,
    PayModule,
    WhatsAppModule,
    ImportModule,
    FilesModule,
  ],
})
export class AppModule {}
