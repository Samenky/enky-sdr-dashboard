'use client';
import { useState } from 'react';

export default function Login() {
  const [code, setCode] = useState('');
  const [etat, setEtat] = useState('repos');

  async function envoyer(e) {
    e.preventDefault();
    setEtat('envoi');
    const r = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    if (r.ok) { window.location.href = '/'; }
    else { setEtat('erreur'); }
  }

  return (
    <main style={S.page}>
      <div style={S.carte}>
        <div style={S.marque}>enky<sup style={S.sup}>®</sup></div>
        <h1 style={S.titre}>Performance SDR</h1>
        <p style={S.sous}>Accès réservé. Saisis le code fourni par Sam.</p>

        <form onSubmit={envoyer}>
          <label style={S.label} htmlFor="code">Code d'accès</label>
          <input id="code" type="password" required value={code} autoFocus
            onChange={e => setCode(e.target.value)}
            style={S.input} />
          <button type="submit" disabled={etat === 'envoi'} style={S.bouton}>
            {etat === 'envoi' ? 'Vérification…' : 'Entrer'}
          </button>
          {etat === 'erreur' && <div style={S.err}>Code incorrect.</div>}
        </form>
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
  err: { marginTop: 12, fontSize: 13, color: '#B2380F' }
};
