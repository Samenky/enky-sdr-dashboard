import { NextResponse } from 'next/server';
import { supabaseSession } from '@/lib/supabase-server';

const SITE = 'https://enky-sdr-dashboard-production.up.railway.app';

export async function GET(request) {
  const code = new URL(request.url).searchParams.get('code');

  if (code) {
    const sb = supabaseSession();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(SITE + '/');
  }
  return NextResponse.redirect(SITE + '/login?refus=1');
}
