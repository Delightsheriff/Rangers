import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

export interface CustomSession extends Session {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export interface Token extends JWT {
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}
