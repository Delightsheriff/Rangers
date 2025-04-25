import 'next-auth';

declare module 'next-auth' {
  interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}
