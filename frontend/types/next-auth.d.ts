import 'next-auth';

declare module 'next-auth' {
  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;
    termsAccepted: boolean;
    token: string;
  }

  interface Session {
    user?: User;
    accessToken?: string;
    error?: string;
    accessTokenExpires?: number;
  }
}
