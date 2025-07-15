import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  IsUUID,
} from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
