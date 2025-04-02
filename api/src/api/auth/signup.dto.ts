import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly first_name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly last_name: string;
  }