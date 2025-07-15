import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;
}
