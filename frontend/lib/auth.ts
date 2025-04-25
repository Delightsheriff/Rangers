// auth.ts
import { CustomSession, Token } from '@/types/user'; // Your types
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            console.error('Login error:', result);
            return Promise.reject(
              new Error(result.message || result.error || 'Something went wrong'),
            );
          }

          if (result.user) {
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
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: Token;
      user?: User;
      trigger?: 'signIn' | 'update' | 'signUp';
      session?: CustomSession;
    }) {
      // Initial sign-in: store the user data and tokens
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        } as Token;
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        const updatedToken = {
          ...token,
          user: { ...(token.user as User), ...session.user },
        } as Token;
        return updatedToken;
      }
      //Handle token refresh
      const tokenWithType = token as Token;
      // Token has not expired yet, return it
      if (Date.now() < tokenWithType.accessTokenExpires) {
        return tokenWithType;
      }

      // Token has expired, refresh it
      const refreshedToken = await refreshAccessToken(tokenWithType);
      if (refreshedToken) {
        return refreshedToken;
      }

      // Refresh failed, redirect to login
      return {
        ...tokenWithType,
        error: 'RefreshAccessTokenError',
      };
    },

    // Transfer data from JWT to session
    async session({ session, token }: { session: CustomSession; token: Token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      session.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async signOut({ token }) {
      try {
        if (token.accessToken) {
          // Call the backend logout endpoint to clear refresh tokens
          await fetch(`${URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
  },
};

export async function refreshAccessToken(token: Token): Promise<Token | null> {
  try {
    const response = await fetch(`${URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to refresh token');
    }

    return {
      ...token,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken || token.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
