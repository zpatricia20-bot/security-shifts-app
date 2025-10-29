// src/shops/shops.module.ts

import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShopsController],
  providers: [ShopsService],
})
export class ShopsModule {}
