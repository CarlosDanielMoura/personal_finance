import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  contextId?: string;
}
