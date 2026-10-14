import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(
    'https://enky-sdr-dashboard-production.up.railway.app/login',
    { status: 303 }
  );
  response.cookies.set('sdr_auth', '', { path: '/', maxAge: 0 });
  return response;
}
