// src/operators/operators.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RbacGuard } from '@/auth/rbac.guard';
import { Roles } from '@/auth/roles.decorator';
import { CreateOperatorDto, UpdateOperatorDto } from './dto';

@ApiTags('Operators')
@Controller('operators')
@UseGuards(JwtAuthGuard, RbacGuard)
@ApiBearerAuth()
export class OperatorsController {
  constructor(private operatorsService: OperatorsService) {}

  @Get()
  async findAll(@Query('isActive') isActive?: string) {
    return this.operatorsService.findAll(
      isActive ? isActive === 'true' : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.operatorsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() dto: CreateOperatorDto) {
    return this.operatorsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  async update(@Param('id') id: string, @Body() dto: UpdateOperatorDto) {
    return this.operatorsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.operatorsService.delete(id);
  }

  @Get(':id/pay-summary')
  @Roles('ADMIN', 'MANAGER')
  async getPaySummary(@Param('id') id: string, @Query('periodKey') periodKey: string) {
    return this.operatorsService.getPaySummary(id, periodKey);
  }
}
