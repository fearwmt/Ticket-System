import { IsString, MinLength, MaxLength, IsEnum } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @IsString()
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  description: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
