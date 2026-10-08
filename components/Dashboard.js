'use client';
import { useEffect, useRef } from 'react';
import { monterDashboard } from '@/lib/rendu';
import { CSS } from '@/lib/styles';

export default function Dashboard({ d, sdrs, email }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = GABARIT;
    ref.current.dataset.root = '1';
    const nettoyer = monterDashboard(ref.current, d, sdrs);
    return nettoyer;
  }, [d, sdrs]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ position: 'fixed', top: 12, right: 18, zIndex: 60, fontSize: 12.5 }}>
        <form action="/deconnexion" method="post" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#4E626C' }}>{email}</span>
          <button type="submit" style={{
            border: '1px solid #D2CEC9', background: '#fff', color: '#06303F', cursor: 'pointer',
            font: '600 12px/1 "Plus Jakarta Sans",sans-serif', padding: '7px 11px', borderRadius: 9999
          }}>Se déconnecter</button>
        </form>
      </div>
      <div ref={ref} />
    </>
  );
}

const GABARIT = `
<div class="top"><div class="inner">
  <div class="brand">
    <div class="logo">enky<sup>&#174;</sup></div><div class="sep"></div><h1>Performance SDR</h1>
  </div>
  <div class="meta" id="meta">&mdash;</div>
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" data-p="decide" aria-selected="true">D&eacute;cider</button>
    <button class="tab" role="tab" data-p="team">&Eacute;quipe</button>
    <button class="tab" role="tab" data-p="origin">Origine des appels</button>
    <button class="tab" role="tab" data-p="when">Quand &amp; comment</button>
    <button class="tab" role="tab" data-p="trust">Fiabilit&eacute;</button>
  </div>
</div></div>

<div class="wrap">
  <div class="filters">
    <div class="fgroup"><span class="lbl">P&eacute;riode</span>
      <div class="seg" id="presets">
        <button data-p="7">7 j</button><button data-p="30">30 j</button>
        <button data-p="90">90 j</button><button data-p="all" aria-pressed="true">Tout</button>
      </div>
      <input type="date" id="from"><input type="date" id="to">
    </div>
    <div class="fgroup"><span class="lbl">SDR</span><span id="chips" style="display:flex;gap:5px;flex-wrap:wrap"></span></div>
    <div class="fgroup"><span class="lbl">Un num&eacute;ro compte comme &laquo; joint &raquo; &agrave; partir de</span>
      <div class="seg hot" id="thr">
        <button data-t="1">&ndash; d'1 min</button><button data-t="60">1 min</button>
        <button data-t="120">2 min</button><button data-t="180" aria-pressed="true">3 min</button>
        <button data-t="300">5 min</button>
      </div>
    </div>
    <button class="ghost" id="reset">Tout r&eacute;initialiser</button>
  </div>
  <div id="seuilbox"></div>
  <div id="app"></div>
</div>
<div id="tip" role="status" aria-live="polite"></div>
`;
