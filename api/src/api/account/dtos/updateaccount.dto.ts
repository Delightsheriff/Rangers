import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/infrastructure/orm/entities/user.entity';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
