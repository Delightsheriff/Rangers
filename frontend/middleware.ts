import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard');
  try {
    // Get the token from the session
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    // If it's a dashboard route and there's no token, redirect to sign in
    if (isDashboardRoute && !token) {
      const signInUrl = new URL('/login', request.url);
      // Add the original URL as a callback parameter
      signInUrl.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(signInUrl);
    }

    if (token?.error) {
      // If the token has an error, redirect to sign in
      const signInUrl = new URL('/login', request.url);
      // Add the original URL as a callback parameter
      signInUrl.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(signInUrl);
    }

    // Allow the request to continue
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: ['/dashboard/:path*'],
};
