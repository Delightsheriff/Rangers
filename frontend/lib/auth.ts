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
        email: {
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
              email: credentials?.email,
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

          if (result.success && result.user) {
            return {
              ...result.user,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
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
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      if (trigger === 'update' && session) {
        token.user = session.user;
      }

      // Handle token refresh
      if (token.refreshToken) {
        try {
          const response = await fetch(`${URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }

      return token;
    },
    // Transfer from JWT to session
    async session({ session, token }: { session: CustomSession; token: Token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signOut({ token }) {
      try {
        // Call the backend logout endpoint to clear refresh tokens
        await fetch(`${URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.accessToken}`,
          },
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
  },
};
