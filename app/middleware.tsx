import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const url = request.nextUrl.clone();

  const pathnameParts = url.pathname.split('/');
  const profileUsername = pathnameParts[pathnameParts.length - 1];

  if (url.pathname.startsWith('/profile/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token.value !== profileUsername) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/', '/login'],
};