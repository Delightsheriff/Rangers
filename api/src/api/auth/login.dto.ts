import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    readonly email: string;
    readonly password: string;
  }