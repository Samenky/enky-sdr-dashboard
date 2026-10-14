import { NextResponse } from 'next/server';
import crypto from 'crypto';

function sha256(valeur) {
  return crypto.createHash('sha256').update(valeur).digest();
}

function delai(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function POST(request) {
  const attendu = process.env.ACCESS_CODE || '';

  let code = '';
  try { ({ code = '' } = await request.json()); } catch (e) { code = ''; }

  // Compare des empreintes de longueur fixe pour eviter les attaques temporelles.
  const a = sha256(code);
  const b = sha256(attendu);
  const ok = attendu.length > 0 && crypto.timingSafeEqual(a, b);

  if (!ok) {
    await delai(1000); // freine le bruteforce
    return new NextResponse('Code incorrect.', { status: 401 });
  }

  const response = new NextResponse(null, { status: 200 });
  response.cookies.set('sdr_auth', sha256(attendu).toString('hex'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
