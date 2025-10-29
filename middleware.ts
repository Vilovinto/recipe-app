import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('firebase-auth-token')?.value;

  console.log(`Middleware: ${pathname}, token: ${token ? 'exists' : 'none'}`);

  if (pathname === '/') {
    if (token) {
      console.log('Redirecting / to /recipes (authenticated)');
      return NextResponse.redirect(new URL('/recipes', request.url));
    } else {
      console.log('Redirecting / to /auth/signin (not authenticated)');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  if (pathname.startsWith('/recipes') && !token) {
    console.log('Redirecting /recipes to /auth/signin (not authenticated)');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  if ((pathname === '/auth/signin' || pathname === '/auth/signup') && token) {
    console.log(`Redirecting ${pathname} to /recipes (authenticated)`);
    return NextResponse.redirect(new URL('/recipes', request.url));
  }

  console.log(`Middleware: allowing ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
