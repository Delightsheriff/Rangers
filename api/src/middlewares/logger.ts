import { NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as morgan from 'morgan';

const logger = morgan(
  ':remote-addr :remote-user [:date[clf]] “:method :url HTTP/:http-version” :status :res[content-length] - :response-time ms “:referrer” “:user-agent ');

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    logger(req, res, next);
  }
}