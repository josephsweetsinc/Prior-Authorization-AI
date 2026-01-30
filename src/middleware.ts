import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const authRoutes = ['/login', '/sign-up', '/forgot-password'];

  const sensitiveRoutes = ['/create-new-password', '/enter-code'];

  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/requests-history');
  const providerOnlyRoutes = ['/new-request'];
  const adminOnlyRoutes = ['/user-management', '/requests', '/reports'];

  const isSegmentRouteMatch = (route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

  const isProviderOnlyRoute = providerOnlyRoutes.some(isSegmentRouteMatch);
  const isAdminOnlyRoute = adminOnlyRoutes.some(isSegmentRouteMatch);

  if (accessToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    !accessToken &&
    (isProtectedRoute || isProviderOnlyRoute || isAdminOnlyRoute)
  ) {
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
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isProviderOnlyRoute && userRole !== 'provider' && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminOnlyRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|icon.svg|.*\\.png|.*\\.svg).*)'],
};
