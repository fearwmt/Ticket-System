import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';

  @IsOptional()
  @IsEnum(['OPEN', 'IN_PROGRESS', 'RESOLVED'])
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
}
