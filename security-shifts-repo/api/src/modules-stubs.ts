// src/documents/documents.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class DocumentsModule {}

// src/pay/pay.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class PayModule {}

// src/whatsapp/whatsapp.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class WhatsAppModule {}

// src/import/import.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';
import { ShiftsModule } from '@/shifts/shifts.module';

@Module({
  imports: [PrismaModule, ShiftsModule],
})
export class ImportModule {}

// src/files/files.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class FilesModule {}
