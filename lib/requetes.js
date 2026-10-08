import { supabaseAdmin } from './supabase-server';

// Toutes les requetes partagent la MEME borne temporelle, pour que les trois
// jeux de donnees ne puissent jamais diverger. C est le defaut principal
// qu avait la version fichier statique.
export async function chargerDonnees() {
  const db = supabaseAdmin();

  const { data, error } = await db.rpc('dashboard_payload');
  if (error) throw new Error('Supabase : ' + error.message);

  return data;
}
