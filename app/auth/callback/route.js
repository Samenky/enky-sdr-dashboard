import { NextResponse } from 'next/server';
import { supabaseSession } from '@/lib/supabase-server';

// Le lien magique renvoie ici avec un code a echanger contre une session.
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const sb = supabaseSession();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL('/', url.origin));
  }
  return NextResponse.redirect(new URL('/login?refus=1', url.origin));
}
