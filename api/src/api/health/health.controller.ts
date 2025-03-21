import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('health')
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
