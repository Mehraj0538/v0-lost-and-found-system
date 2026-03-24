import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/jwt';

const protectedRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Redirect to login
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const decoded = verifyJWT(token);
      // Token is valid, continue
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token is invalid, redirect to login
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
