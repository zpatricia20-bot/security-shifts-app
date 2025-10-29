// src/operators/dto/index.ts

import { IsString, IsOptional, IsPhoneNumber, IsInt, Min, Max } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  fullName: string;

  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsString()
  codiceFiscale?: string;

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  contractStatus?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  hourlyRateCents?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOperatorDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  codiceFiscale?: string;

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  contractStatus?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  hourlyRateCents?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  isActive?: boolean;
}
