// src/operators/operators.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateOperatorDto, UpdateOperatorDto } from './dto';

@Injectable()
export class OperatorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(isActive?: boolean) {
    const where = isActive !== undefined ? { isActive } : {};

    return this.prisma.operator.findMany({
      where,
      include: {
        documents: {
          include: { file: true },
        },
        users: { select: { id: true, email: true, role: true } },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(id: string) {
    const operator = await this.prisma.operator.findUnique({
      where: { id },
      include: {
        documents: { include: { file: true } },
        users: { select: { id: true, email: true, role: true } },
        shiftAssignments: {
          include: {
            shift: { include: { shop: true } },
          },
          take: 10,
          orderBy: { shift: { date: 'desc' } },
        },
      },
    });

    if (!operator) {
      throw new NotFoundException(`Operator ${id} not found`);
    }

    return operator;
  }

  async create(dto: CreateOperatorDto) {
    return this.prisma.operator.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateOperatorDto) {
    const operator = await this.findOne(id);

    return this.prisma.operator.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.operator.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getPaySummary(id: string, periodKey: string) {
    const items = await this.prisma.payItem.findMany({
      where: {
        operatorId: id,
        periodKey,
      },
      include: { shift: { include: { shop: true } } },
    });

    const total = items.reduce((sum, item) => sum + item.totalCents, 0);

    return {
      operatorId: id,
      periodKey,
      items,
      totalCents: total,
      totalEur: (total / 100).toFixed(2),
    };
  }
}
