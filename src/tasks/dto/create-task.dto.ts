import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.NORMAL;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
}
