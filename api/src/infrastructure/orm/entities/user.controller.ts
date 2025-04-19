import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../api/auth/jwt.auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return (req as any).user; // This is set by JwtStrategy.validate
  }
}