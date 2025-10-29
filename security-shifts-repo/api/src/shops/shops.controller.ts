// src/shops/shops.controller.ts

import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { RbacGuard } from '@/auth/rbac.guard';
import { Roles } from '@/auth/roles.decorator';

@ApiTags('Shops')
@Controller('shops')
@UseGuards(JwtAuthGuard, RbacGuard)
@ApiBearerAuth()
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  async findAll() {
    return this.shopsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  async create(@Body() dto: any) {
    return this.shopsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER')
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.shopsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.shopsService.delete(id);
  }
}
