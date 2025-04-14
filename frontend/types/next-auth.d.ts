import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    _id: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    middleName?: string;
    username?: string;
    gender?: string;
    phone?: string;
    token: string;
  }

  interface Session {
    user?: User;
    token?: string;
    error?: string;
  }
}
