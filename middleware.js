import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SITE = 'https://enky-sdr-dashboard-production.up.railway.app';

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const allowed = (process.env.ALLOWED_EMAILS || '')
    .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

  const path = request.nextUrl.pathname;
  if (path.startsWith('/login') || path.startsWith('/auth')) return response;

  if (!user) return NextResponse.redirect(SITE + '/login');

  if (allowed.length && !allowed.includes((user.email || '').toLowerCase())) {
    return NextResponse.redirect(SITE + '/login?refus=1');
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
