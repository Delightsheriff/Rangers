import { Body, Controller, Get, HttpStatus, Put, Res } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserEntity } from 'src/infrastructure/orm/entities/user.entity';
import { AccountService } from './account.service';
import { AuthUser } from 'src/decorators/auth';
import { UpdateAccountDto } from './dtos/updateaccount.dto';
import { Response } from 'express';

@Controller('account')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('profile')
  @ApiOkResponse({ type: UserEntity })
  @ApiNotFoundResponse({ description: 'User not found' })
  getProfile(@AuthUser() user: UserEntity) {
    const data = this.accountService.getAccountDetails(user.id.toString());

    return data;
  }

  @Put('profile')
  @ApiNoContentResponse({ description: 'User profile updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async updateProfile(
    @AuthUser() user: UserEntity,
    @Body() updateData: UpdateAccountDto,
    @Res() res: Response,
  ) {
    await this.accountService.updateAccountDetails(user.id.toString(), updateData);

    res.status(HttpStatus.NO_CONTENT).send();
  }
}
