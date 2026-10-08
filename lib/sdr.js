// Correspondance email Ringover -> prenom affiche.
// Les emails servent uniquement de cle de jointure : rien ne leur est envoye.
export const SDR_NOMS = {
  'clement@enky.com': 'Clément',
  'hasceb@enky.com':  'Hasceb',
  'mikael@enky.com':  'Mikael',
  'rudy@enky.com':    'Rudy'
};

export function nomSdr(email) {
  if (!email) return '—';
  if (SDR_NOMS[email.toLowerCase()]) return SDR_NOMS[email.toLowerCase()];
  const s = email.split('@')[0];
  return s.charAt(0).toUpperCase() + s.slice(1);
}
