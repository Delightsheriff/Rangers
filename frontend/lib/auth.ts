import { CustomSession, Token } from '@/types/user';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const URL = process.env.NEXT_PUBLIC_API_URL; // Assuming you're using a base URL

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
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
            // Return a structured error instead of throwing
            return Promise.reject(
              new Error(result.message || result.error || 'Something went wrong'),
            );
          }

          console.log('🚀 ~ result:', result);
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
  callbacks: {
    // Transfer the user and token to JWT
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: Token;
      user: User;
      trigger?: 'signIn' | 'update' | 'signUp';
      session?: CustomSession;
    }) {
      if (user) {
        token.user = user;
        token.token = user.token;
      }

      if (trigger === 'update' && session) {
        token.user = session.user;
      }
      return token;
    },
    // Transfer from JWT to session
    async session({ session, token }: { session: CustomSession; token: Token }) {
      session.user = token.user;
      session.token = token.token;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
