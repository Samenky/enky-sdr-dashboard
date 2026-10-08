'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function Login() {
  const [email, setEmail] = useState('');
  const [etat, setEtat] = useState('repos');
  const [msg, setMsg] = useState('');
  const refus = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('refus');

  async function envoyer(e) {
    e.preventDefault();
    setEtat('envoi');
    const sb = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
        const { error } = await sb.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: 'https://enky-sdr-dashboard-production.up.railway.app/auth/callback' }
    });
    if (error) { setEtat('erreur'); setMsg(error.message); }
    else { setEtat('envoye'); }
  }

  return (
    <main style={S.page}>
      <div style={S.carte}>
        <div style={S.marque}>enky<sup style={S.sup}>®</sup></div>
        <h1 style={S.titre}>Performance SDR</h1>
        <p style={S.sous}>Accès réservé à la direction commerciale.</p>

        {refus && (
          <div style={S.refus}>
            Cette adresse n'a pas accès au tableau de bord. Demande à Sam de l'ajouter.
          </div>
        )}

        {etat === 'envoye' ? (
          <div style={S.ok}>
            <b>Lien envoyé.</b> Ouvre ta boîte mail et clique sur le lien pour entrer.
            Il expire dans une heure.
          </div>
        ) : (
          <form onSubmit={envoyer}>
            <label style={S.label} htmlFor="email">Ton adresse Enky</label>
            <input id="email" type="email" required value={email} autoFocus
              onChange={e => setEmail(e.target.value)}
              placeholder="prenom@enky.com" style={S.input} />
            <button type="submit" disabled={etat === 'envoi'} style={S.bouton}>
              {etat === 'envoi' ? 'Envoi…' : 'Recevoir mon lien de connexion'}
            </button>
            {etat === 'erreur' && <div style={S.err}>{msg}</div>}
          </form>
        )}
      </div>
    </main>
  );
}

const S = {
  page: { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#FBFAF9',
    fontFamily: '"Plus Jakarta Sans",system-ui,sans-serif', padding: 24, color: '#06303F' },
  carte: { width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #E4E1DD',
    borderRadius: 14, padding: '34px 32px', boxShadow: '0 1px 2px rgba(6,54,71,.05)' },
  marque: { fontWeight: 800, fontSize: 19, letterSpacing: '-.025em' },
  sup: { fontSize: 8, color: '#E64F1E' },
  titre: { fontSize: 22, fontWeight: 700, letterSpacing: '-.015em', margin: '14px 0 6px' },
  sous: { fontSize: 14, color: '#4E626C', margin: '0 0 24px', lineHeight: 1.6 },
  label: { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#4E626C', marginBottom: 7 },
  input: { width: '100%', font: '500 15px/1 "Plus Jakarta Sans",sans-serif', color: '#06303F',
    border: '1px solid #D2CEC9', background: '#fff', padding: '13px 14px', borderRadius: 9,
    marginBottom: 14, boxSizing: 'border-box' },
  bouton: { width: '100%', border: 0, background: '#06303F', color: '#fff', cursor: 'pointer',
    font: '700 15px/1 "Plus Jakarta Sans",sans-serif', padding: '14px', borderRadius: 9 },
  ok: { background: '#FFF6DF', border: '1px solid #EBD9AC', borderRadius: 11, padding: '16px 18px',
    fontSize: 14, lineHeight: 1.65, color: '#3F3417' },
  refus: { background: '#FFF6DF', border: '1px solid #EBD9AC', borderRadius: 11, padding: '14px 16px',
    fontSize: 13.5, lineHeight: 1.6, color: '#3F3417', marginBottom: 20 },
  err: { marginTop: 12, fontSize: 13, color: '#B2380F' }
};
