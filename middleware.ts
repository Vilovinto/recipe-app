import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Отримуємо токен з cookies
  const token = request.cookies.get('firebase-auth-token')?.value;

  console.log(`Middleware: ${pathname}, token: ${token ? 'exists' : 'none'}`);

  // Якщо користувач намагається зайти на кореневу сторінку
  if (pathname === '/') {
    if (token) {
      // Якщо авторизований - перенаправляємо на /recipes
      console.log('Redirecting / to /recipes (authenticated)');
      return NextResponse.redirect(new URL('/recipes', request.url));
    } else {
      // Якщо не авторизований - перенаправляємо на /auth/signin
      console.log('Redirecting / to /auth/signin (not authenticated)');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Якщо користувач намагається зайти на /recipes без токена
  if (pathname.startsWith('/recipes') && !token) {
    console.log('Redirecting /recipes to /auth/signin (not authenticated)');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Якщо користувач авторизований і намагається зайти на auth сторінки
  if ((pathname === '/auth/signin' || pathname === '/auth/signup') && token) {
    console.log(`Redirecting ${pathname} to /recipes (authenticated)`);
    return NextResponse.redirect(new URL('/recipes', request.url));
  }

  console.log(`Middleware: allowing ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
