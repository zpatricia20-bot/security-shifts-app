// src/shifts/shifts.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: any = {}) {
    const where: any = {};

    if (filters.shopId) where.shopId = filters.shopId;
    if (filters.operatorId) {
      where.assignments = { some: { operatorId: filters.operatorId } };
    }
    if (filters.date) {
      const dateObj = new Date(filters.date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      where.date = { gte: dateObj, lt: nextDay };
    }
    if (filters.status) where.status = filters.status;

    return this.prisma.shift.findMany({
      where,
      include: {
        shop: true,
        assignments: { include: { operator: true } },
        attendanceLogs: true,
        breaks: true,
        payItems: true,
        reviews: true,
      },
      orderBy: { startAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      include: {
        shop: true,
        assignments: { include: { operator: true } },
        attendanceLogs: { orderBy: { timestamp: 'asc' } },
        breaks: true,
        payItems: true,
        reviews: { include: { creator: true } },
      },
    });

    if (!shift) {
      throw new NotFoundException(`Shift ${id} not found`);
    }

    return shift;
  }

  async create(data: any) {
    return this.prisma.shift.create({
      data,
      include: { shop: true, assignments: true },
    });
  }

  async update(id: string, data: any) {
    const shift = await this.findOne(id);

    return this.prisma.shift.update({
      where: { id },
      data,
      include: {
        shop: true,
        assignments: { include: { operator: true } },
        payItems: true,
      },
    });
  }

  async assignOperator(shiftId: string, operatorId: string) {
    return this.prisma.shiftAssignment.create({
      data: { shiftId, operatorId },
      include: { operator: true, shift: true },
    });
  }

  async recordAttendance(shiftId: string, operatorId: string, data: any) {
    const log = await this.prisma.attendanceLog.create({
      data: {
        shiftId,
        operatorId,
        ...data,
      },
    });

    // Update shift status if first check-in
    if (data.eventType === 'CHECK_IN') {
      await this.prisma.shift.update({
        where: { id: shiftId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return log;
  }

  async calculatePay(shiftId: string) {
    const shift = await this.findOne(shiftId);
    const logs = shift.attendanceLogs;

    // Get actual check-in/out times
    const checkIn = logs.find(l => l.eventType === 'CHECK_IN')?.timestamp;
    const checkOut = logs.find(l => l.eventType === 'CHECK_OUT')?.timestamp;

    if (!checkIn || !checkOut) {
      return null;
    }

    const grossMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60);
    const payableMinutes = Math.max(0, grossMinutes - shift.unpaidBreakMinutes);

    // Determine rate
    let rateCents =
      shift.assignments[0]?.operator?.hourlyRateCents ||
      shift.shop?.defaultHourlyRateCents ||
      parseInt(process.env.DEFAULT_HOURLY_RATE_CENTS || '1500', 10);

    const totalCents = Math.floor((payableMinutes * rateCents) / 60);

    return {
      shiftId,
      operatorId: shift.assignments[0]?.operatorId,
      payableMinutes: Math.floor(payableMinutes),
      rateCents,
      totalCents,
      calcSnapshot: {
        method: 'standard',
        grossMinutes,
        unpaidBreakMinutes: shift.unpaidBreakMinutes,
        periodKey: shift.date.toISOString().substring(0, 7),
      },
    };
  }
}
