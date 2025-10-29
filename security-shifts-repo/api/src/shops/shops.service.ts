// src/shops/shops.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.shop.findMany({
      include: { shifts: { take: 5, orderBy: { date: 'desc' } } },
    });
  }

  async findOne(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: { shifts: true, reviews: true },
    });

    if (!shop) {
      throw new NotFoundException(`Shop ${id} not found`);
    }

    return shop;
  }

  async create(data: any) {
    return this.prisma.shop.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.shop.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.shop.delete({ where: { id } });
  }
}
