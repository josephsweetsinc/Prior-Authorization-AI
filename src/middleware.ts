import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const authRoutes = ['/login', '/sign-up', '/forgot-password'];

  const sensitiveRoutes = ['/create-new-password', '/enter-code'];

  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

  if (accessToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!accessToken && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sensitiveRoutes.includes(pathname)) {
    const hasToken = searchParams.has('token');
    const hasCode = searchParams.has('code');

    if (!hasToken && !hasCode) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
};
