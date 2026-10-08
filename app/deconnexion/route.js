import { NextResponse } from 'next/server';
import { supabaseSession } from '@/lib/supabase-server';

export async function POST() {
  await supabaseSession().auth.signOut();
  return NextResponse.redirect(
    'https://enky-sdr-dashboard-production.up.railway.app/login',
    { status: 303 }
  );
}
