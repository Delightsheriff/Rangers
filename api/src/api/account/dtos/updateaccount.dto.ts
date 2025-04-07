import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from 'src/infrastructure/orm/entities/user.entity';

export class UpdateAccountDto {
  @ApiProperty({
    description: 'firstName',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'lastName',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'middleName',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'username',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'phone',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'gender',
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
