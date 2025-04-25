// // import { CustomSession, Token } from '@/types/user';
// // import { NextAuthOptions, User } from 'next-auth';
// // import CredentialsProvider from 'next-auth/providers/credentials';

// // const URL = process.env.NEXT_PUBLIC_API_URL; // Assuming you're using a base URL

// // export const authOptions: NextAuthOptions = {
// //   secret: process.env.AUTH_SECRET,
// //   session: {
// //     strategy: 'jwt',
// //   },
// //   providers: [
// //     CredentialsProvider({
// //       name: 'Credentials',
// //       credentials: {
// //         email: {
// //           label: 'Email',
// //           type: 'text',
// //         },
// //         password: {
// //           label: 'Password',
// //           type: 'password',
// //         },
// //       },
// //       async authorize(credentials) {
// //         try {
// //           const response = await fetch(`${URL}/auth/login`, {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({
// //               email: credentials?.email,
// //               password: credentials?.password,
// //             }),
// //           });

// //           const result = await response.json();

// //           if (!response.ok) {
// //             console.error('Error:', result);
// //             // Return a structured error instead of throwing
// //             return Promise.reject(
// //               new Error(result.message || result.error || 'Something went wrong'),
// //             );
// //           }

// //           if (result.success && result.user) {
// //             return {
// //               ...result.user,
// //               accessToken: result.accessToken,
// //               refreshToken: result.refreshToken,
// //             } as User;
// //           }

// //           return null;
// //         } catch (error) {
// //           console.error('Error during sign in:', error);
// //           throw new Error('Sign in failed. Please try again later.');
// //         }
// //       },
// //     }),
// //   ],
// //   callbacks: {
// //     // Transfer the user and token to JWT
// //     async jwt({
// //       token,
// //       user,
// //       trigger,
// //       session,
// //     }: {
// //       token: Token;
// //       user: User;
// //       trigger?: 'signIn' | 'update' | 'signUp';
// //       session?: CustomSession;
// //     }) {
// //       if (user) {
// //         token.user = user;
// //         token.accessToken = user.accessToken;
// //         token.refreshToken = user.refreshToken;
// //       }

// //       if (trigger === 'update' && session) {
// //         token.user = session.user;
// //       }

// //       // Handle token refresh
// //       if (token.refreshToken) {
// //         try {
// //           const response = await fetch(`${URL}/auth/refresh-token`, {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({
// //               refreshToken: token.refreshToken,
// //             }),
// //           });

// //           if (response.ok) {
// //             const data = await response.json();
// //             token.accessToken = data.accessToken;
// //             token.refreshToken = data.refreshToken;
// //           } else {
// //             // If refresh fails, clear the tokens
// //             console.log('Refresh failed');
// //             token.accessToken = undefined;
// //             token.refreshToken = undefined;
// //             token.user = undefined;
// //           }
// //         } catch (error) {
// //           console.error('Error refreshing token:', error);
// //           // If refresh fails, clear the tokens
// //           token.accessToken = undefined;
// //           token.refreshToken = undefined;
// //           token.user = undefined;
// //         }
// //       }

// //       return token;
// //     },
// //     // Transfer from JWT to session
// //     async session({ session, token }: { session: CustomSession; token: Token }) {
// //       session.user = token.user;
// //       session.accessToken = token.accessToken;
// //       session.refreshToken = token.refreshToken;
// //       return session;
// //     },
// //   },
// //   pages: {
// //     signIn: '/auth/signin',
// //   },
// //   events: {
// //     async signOut({ token }) {
// //       try {
// //         if (token.accessToken) {
// //           // Call the backend logout endpoint to clear refresh tokens
// //           await fetch(`${URL}/auth/logout`, {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               Authorization: `Bearer ${token.accessToken}`,
// //             },
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Error during logout:', error);
// //       }
// //     },
// //   },
// // };

// // auth/auth-options.ts
// import { CustomSession, Token } from '@/types/user';
// import { NextAuthOptions, User } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import jwt from 'jsonwebtoken';

// const URL = process.env.NEXT_PUBLIC_API_URL;

// // Helper function to extract expiration from JWT
// function getTokenExpiration(token: string): number | null {
//   try {
//     const decoded = jwt.decode(token);
//     if (decoded && typeof decoded === 'object' && decoded.exp) {
//       return decoded.exp;
//     }
//     return null;
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   secret: process.env.AUTH_SECRET,
//   session: {
//     strategy: 'jwt',
//     maxAge: 24 * 60 * 60, // 24 hours
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'text',
//         },
//         password: {
//           label: 'Password',
//           type: 'password',
//         },
//       },
//       async authorize(credentials) {
//         try {
//           const response = await fetch(`${URL}/auth/login`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               email: credentials?.email,
//               password: credentials?.password,
//             }),
//           });

//           const result = await response.json();

//           if (!response.ok) {
//             console.error('Login error:', result);
//             return Promise.reject(
//               new Error(result.message || result.error || 'Something went wrong'),
//             );
//           }

//           if (result.success && result.user) {
//             const expTime = getTokenExpiration(result.accessToken);

//             return {
//               ...result.user,
//               accessToken: result.accessToken,
//               refreshToken: result.refreshToken,
//               expiresAt: expTime || Math.floor(Date.now() / 1000) + 15 * 60, // Default 15 min if can't decode
//             } as User;
//           }

//           return null;
//         } catch (error) {
//           console.error('Error during sign in:', error);
//           throw new Error('Sign in failed. Please try again later.');
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({
//       token,
//       user,
//       trigger,
//       session,
//     }: {
//       token: Token;
//       user?: User;
//       trigger?: 'signIn' | 'update' | 'signUp';
//       session?: CustomSession;
//     }) {
//       // Initial sign-in: store the user data and tokens
//       if (user) {
//         token.user = user;
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;

//         // Extract or set expiration time
//         const expTime = getTokenExpiration(user.accessToken);
//         token.expiresAt = expTime || Math.floor(Date.now() / 1000) + 15 * 60; // Default 15 min if can't decode
//       }

//       // Update token when session is updated
//       if (trigger === 'update' && session) {
//         token.user = session.user;
//         if (session.accessToken) token.accessToken = session.accessToken;
//         if (session.refreshToken) token.refreshToken = session.refreshToken;
//       }

//       // Check if token needs refreshing (less than 1 minute before expiry)
//       const currentTime = Math.floor(Date.now() / 1000);
//       const shouldRefresh = token.expiresAt && currentTime > token.expiresAt - 60;

//       // Only attempt refresh if we need to and have a refresh token
//       if (shouldRefresh && token.refreshToken) {
//         console.log('Token about to expire, refreshing...');
//         try {
//           const response = await fetch(`${URL}/auth/refresh-token`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               refreshToken: token.refreshToken,
//             }),
//           });

//           if (response.ok) {
//             const data = await response.json();

//             // Update tokens in state
//             token.accessToken = data.accessToken;
//             token.refreshToken = data.refreshToken;

//             // Update expiration time
//             const newExpTime = getTokenExpiration(data.accessToken);
//             token.expiresAt = newExpTime || Math.floor(Date.now() / 1000) + 15 * 60;

//             console.log(
//               'Token refreshed successfully, expires at:',
//               new Date(token.expiresAt * 1000).toISOString(),
//             );
//           } else {
//             console.error('Failed to refresh token:', await response.text());
//             // Clear tokens on refresh failure
//             token.error = 'RefreshAccessTokenError';
//             // Keep user information but clear authentication tokens
//             token.accessToken = undefined;
//             token.refreshToken = undefined;
//           }
//         } catch (error) {
//           console.error('Error refreshing token:', error);
//           token.error = 'RefreshAccessTokenError';
//           token.accessToken = undefined;
//           token.refreshToken = undefined;
//         }
//       }

//       return token;
//     },

//     // Transfer data from JWT to session
//     async session({ session, token }: { session: CustomSession; token: Token }) {
//       session.user = token.user;
//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;
//       session.error = token.error;

//       // Add session expiry info based on token expiry
//       if (token.expiresAt) {
//         session.expires = new Date(token.expiresAt * 1000).toISOString();
//       }

//       return session;
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//   },
//   events: {
//     async signOut({ token }) {
//       try {
//         if (token.accessToken) {
//           // Call the backend logout endpoint to clear refresh tokens
//           await fetch(`${URL}/auth/logout`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token.accessToken}`,
//             },
//           });
//         }
//       } catch (error) {
//         console.error('Error during logout:', error);
//       }
//     },
//   },
// };

// auth.ts
import { CustomSession, Token } from '@/types/user'; // Your types
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

const URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to extract expiration from JWT
function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === 'object' && decoded.exp) {
      return decoded.exp;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

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

          if (result.success && result.user) {
            const expTime = getTokenExpiration(result.accessToken);

            return {
              ...result.user,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              expiresAt: expTime || Math.floor(Date.now() / 1000) + 15 * 60, // Default 15 min if can't decode
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
        token.user = user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        // Extract or set expiration time
        const expTime = getTokenExpiration(user.accessToken);
        token.expiresAt = expTime || Math.floor(Date.now() / 1000) + 15 * 60; // Default 15 min if can't decode
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        token.user = session.user;
        if (session.accessToken) token.accessToken = session.accessToken;
        if (session.refreshToken) token.refreshToken = session.refreshToken;
      }

      // Check if token needs refreshing (less than 1 minute before expiry)
      const currentTime = Math.floor(Date.now() / 1000);
      const shouldRefresh = token.expiresAt && currentTime > token.expiresAt - 60;

      // Only attempt refresh if we need to and have a refresh token
      if (shouldRefresh && token.refreshToken) {
        console.log('Token about to expire, refreshing...');
        try {
          const response = await fetch(`${URL}/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });

          if (response.ok) {
            const data = await response.json();

            // Update tokens in state
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;

            // Update expiration time
            const newExpTime = getTokenExpiration(data.accessToken);
            token.expiresAt = newExpTime || Math.floor(Date.now() / 1000) + 15 * 60;

            console.log(
              'Token refreshed successfully, expires at:',
              new Date(token.expiresAt * 1000).toISOString(),
            );
          } else {
            console.error('Failed to refresh token:', await response.text());
            // Clear tokens on refresh failure
            token.error = 'RefreshAccessTokenError';
            // Keep user information but clear authentication tokens
            token.accessToken = undefined;
            token.refreshToken = undefined;
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
          token.error = 'RefreshAccessTokenError';
          token.accessToken = undefined;
          token.refreshToken = undefined;
        }
      }

      return token;
    },

    // Transfer data from JWT to session
    async session({ session, token }: { session: CustomSession; token: Token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      // Add session expiry info based on token expiry
      if (token.expiresAt) {
        session.expires = new Date(token.expiresAt * 1000).toISOString();
      }

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
