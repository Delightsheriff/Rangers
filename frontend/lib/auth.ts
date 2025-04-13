import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const URL = process.env.NEXT_PUBLIC_API_URL; // Assuming you're using a base URL

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          console.log('credentials', credentials);
          const response = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: credentials?.identifier,
              password: credentials?.password,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error('Error:', result);
            throw new Error(result.message || result.error || 'Something went wrong');
          }

          console.log('Success:', result);

          if (result.user) {
            return {
              ...result.user,
              token: result.token,
            } as User;
          }

          return null;
        } catch (error) {
          console.error('Error during sign in:', error);
          throw new Error('Sign in failed. Please try again later.');
        }
      },
    }),
  ],
};
