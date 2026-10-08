import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Client lie a la session du visiteur (lecture de l utilisateur connecte).
export function supabaseSession() {
  const store = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return store.getAll(); },
        setAll(list) {
          try { list.forEach(({ name, value, options }) => store.set(name, value, options)); }
          catch (e) { /* appele depuis un Server Component : ignore */ }
        }
      }
    }
  );
}

// Client administrateur : la cle service_role ne quitte JAMAIS le serveur.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
