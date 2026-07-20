import { betterFetch } from '@better-fetch/fetch';
import type { Session } from 'better-auth/types';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/settings', '/jobs'];
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute || isAuthRoute) {
    // Note: session data returned from Better Fetch encapsulates inner "session" and "user"
    const response = await betterFetch<{ user: any; session: Session }>(
      '/api/auth/get-session',
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      },
    );

    const session = response.data;

    if (isProtectedRoute && !session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && session?.user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
