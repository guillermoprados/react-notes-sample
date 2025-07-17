import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsIn, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class NotesPaginationDto extends PartialType(PaginationDto) {
  @IsOptional()
  @IsIn(['archived', 'not-archived', 'all'])
  status?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
