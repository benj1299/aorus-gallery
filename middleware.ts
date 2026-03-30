import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n middleware for admin and API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(fr|en|zh)/:path*', '/admin/:path*'],
};
