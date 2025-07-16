import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
