import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/auth';

@Controller('health')
@Public()
@ApiTags('Health')
export class HealthController {
  constructor() {}

  /**
   * Get Health Checks
   */
  @Get('/')
  async getHealth() {
    return 'OK';
  }
}
