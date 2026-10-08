import { chargerDonnees } from '@/lib/requetes';
import { supabaseSession } from '@/lib/supabase-server';
import { nomSdr } from '@/lib/sdr';
import Dashboard from '@/components/Dashboard';

// Rendu a chaque visite : les chiffres viennent de Supabase en direct.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const { data: { user } } = await supabaseSession().auth.getUser();

  let donnees = null, erreur = null;
  try { donnees = await chargerDonnees(); }
  catch (e) { erreur = e.message; }

  if (erreur) {
    return (
      <main style={{ padding: 40, fontFamily: '"Plus Jakarta Sans",sans-serif', color: '#06303F' }}>
        <h1 style={{ fontSize: 20 }}>Les données ne se chargent pas</h1>
        <p style={{ fontSize: 14, color: '#4E626C', maxWidth: '60ch', lineHeight: 1.7 }}>
          La base a répondu : <code>{erreur}</code><br /><br />
          Vérifie que le projet Supabase est actif et que les variables
          <code> NEXT_PUBLIC_SUPABASE_URL</code> et <code>SUPABASE_SERVICE_ROLE_KEY</code> sont
          renseignées dans Railway.
        </p>
      </main>
    );
  }

  const sdrs = (donnees.sdrs || []).map(nomSdr);
  return <Dashboard d={donnees} sdrs={sdrs} email={user?.email || ''} />;
}
