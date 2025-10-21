import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Публічні маршрути (не потребують автентифікації)
  const publicRoutes = ['/auth/signin', '/auth/signup'];

  // Захищені маршрути (потребують автентифікації)
  const protectedRoutes = ['/recipes'];

  // Перевіряємо чи це захищений маршрут
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Перевіряємо чи це публічний маршрут
  const isPublicRoute = publicRoutes.includes(pathname);

  // Отримуємо токен з cookies
  const token = request.cookies.get('firebase-auth-token')?.value;

  // Якщо це захищений маршрут і немає токена - редирект на signin
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Якщо є токен і користувач намагається зайти на auth сторінки - редирект на recipes
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/recipes', request.url));
  }

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
