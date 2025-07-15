import { IsString, MinLength, IsUUID, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
