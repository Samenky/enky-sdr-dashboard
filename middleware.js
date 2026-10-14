import { NextResponse } from 'next/server';

const SITE = 'https://enky-sdr-dashboard-production.up.railway.app';

async function sha256Hex(valeur) {
  const data = new TextEncoder().encode(valeur);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/login') || path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const attendu = await sha256Hex(process.env.ACCESS_CODE || '');
  const cookie = request.cookies.get('sdr_auth')?.value;

  if (!cookie || cookie !== attendu) {
    return NextResponse.redirect(SITE + '/login');
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
