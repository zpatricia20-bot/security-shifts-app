// src/shifts/shifts.controller.ts

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShiftsService } from './shifts.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RbacGuard } from '@/auth/rbac.guard';
import { Roles } from '@/auth/roles.decorator';

@ApiTags('Shifts')
@Controller('shifts')
@UseGuards(JwtAuthGuard, RbacGuard)
@ApiBearerAuth()
export class ShiftsController {
  constructor(private shiftsService: ShiftsService) {}

  @Get()
  async findAll(
    @Query('date') date?: string,
    @Query('shopId') shopId?: string,
    @Query('operatorId') operatorId?: string,
    @Query('status') status?: string,
  ) {
    return this.shiftsService.findAll({ date, shopId, operatorId, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shiftsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() dto: any) {
    return this.shiftsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.shiftsService.update(id, dto);
  }

  @Post(':id/assign-operator')
  @Roles('ADMIN', 'MANAGER')
  async assignOperator(
    @Param('id') shiftId: string,
    @Body() body: { operatorId: string },
  ) {
    return this.shiftsService.assignOperator(shiftId, body.operatorId);
  }

  @Post(':id/attendance')
  @Roles('OPERATOR', 'ADMIN', 'MANAGER')
  async recordAttendance(
    @Param('id') shiftId: string,
    @Body() body: any,
  ) {
    return this.shiftsService.recordAttendance(shiftId, body.operatorId, body);
  }

  @Get(':id/pay')
  async calculatePay(@Param('id') id: string) {
    return this.shiftsService.calculatePay(id);
  }
}
