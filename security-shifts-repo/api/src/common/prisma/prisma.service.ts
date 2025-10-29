// src/common/prisma/prisma.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app) {
    process.on('SIGTERM', async () => {
      await app.close();
    });
    process.on('SIGINT', async () => {
      await app.close();
    });
  }
}
