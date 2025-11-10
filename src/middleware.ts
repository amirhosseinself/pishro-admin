// @/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection
 * Note: Simplified to avoid Prisma edge runtime issues
 * Auth protection is handled at page/component level using getServerSession
 */
export function middleware(request: NextRequest) {
  // Allow all requests - auth handled in pages/components
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
