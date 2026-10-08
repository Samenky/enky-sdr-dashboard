import { NextResponse } from 'next/server';
import { supabaseSession } from '@/lib/supabase-server';

export async function POST(request) {
  const sb = supabaseSession();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL('/login', new URL(request.url).origin), { status: 303 });
}
