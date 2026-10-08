export const CSS = `
:root{
  /* palette resserree : encre, orange, et des gris. rien d autre. */
  --ink:#06303F; --ink-2:#0E4457; --ink-3:#264E5E;
  --mute:#4E626C;      /* 7,3:1 sur papier — lisible en 12px */
  --mute-2:#697C86;    /* 5,1:1 — reserve aux graduations d axes */
  --accent:#E64F1E; --accent-soft:rgba(230,79,30,.12); --accent-deep:#B2380F;
  --paper:#FBFAF9; --card:#FFFFFF; --sunken:#F2F1EF;
  --line:#E4E1DD; --line-2:#D2CEC9;
  --warn-bg:#FFF6DF; --warn-line:#EBD9AC; --warn-ink:#6E5310;
  --sh:0 1px 2px rgba(6,54,71,.05);
  --sh-lift:0 6px 24px rgba(6,54,71,.10);
  --r:14px; --r-s:8px; --r-pill:9999px;
  --f:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif;
  --e:280ms cubic-bezier(.22,1,.36,1);
  box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px);
}
*,*::before,*::after{box-sizing:inherit}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
html{scroll-padding-top:env(safe-area-inset-top,0px);-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--f);
  font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.wrap{max-width:1180px;margin:0 auto;padding:0 22px 90px}

/* ── entete ─────────────────────────────── */
.top{position:sticky;top:0;z-index:40;background:rgba(251,250,249,.93);
  backdrop-filter:saturate(1.6) blur(14px);-webkit-backdrop-filter:saturate(1.6) blur(14px);
  border-bottom:1px solid var(--line-2);margin:0 -22px 26px;padding:16px 22px 0}
.top .inner{max-width:1180px;margin:0 auto}
.brand{display:flex;align-items:center;gap:11px;flex-wrap:wrap}
.logo{font-weight:800;font-size:19px;letter-spacing:-.025em}
.logo sup{font-size:8px;vertical-align:super;color:var(--accent)}
.sep{width:1px;height:20px;background:var(--line-2)}
h1{font-size:20px;font-weight:700;letter-spacing:-.015em;margin:0}
.meta{color:var(--mute);font-size:13.5px;margin:5px 0 14px;font-variant-numeric:tabular-nums}
.meta b{color:var(--ink);font-weight:700}

/* ── onglets ────────────────────────────── */
.tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{appearance:none;border:0;background:none;font:600 15px/1 var(--f);color:var(--mute);
  padding:13px 16px 15px;cursor:pointer;position:relative;white-space:nowrap;transition:color var(--e)}
.tab:hover{color:var(--ink-3)}
.tab[aria-selected="true"]{color:var(--ink);font-weight:700}
.tab::after{content:"";position:absolute;left:12px;right:12px;bottom:0;height:2px;
  background:var(--accent);border-radius:2px 2px 0 0;transform:scaleX(0);transition:transform var(--e)}
.tab[aria-selected="true"]::after{transform:scaleX(1)}
.tab .cnt{margin-left:6px;font-size:11px;color:var(--mute-2);font-variant-numeric:tabular-nums}

/* ── filtres ────────────────────────────── */
.filters{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:26px}
.fgroup{display:flex;align-items:center;gap:7px;background:var(--card);border:1px solid var(--line);
  border-radius:var(--r-pill);padding:4px 5px 4px 13px;box-shadow:var(--sh)}
.fgroup > .lbl{font-size:12.5px;font-weight:600;color:var(--mute);white-space:nowrap}
.seg{display:inline-flex;gap:1px;background:var(--sunken);padding:3px;border-radius:var(--r-pill)}
.seg button{border:0;background:none;font:600 13.5px/1 var(--f);color:var(--ink-3);
  padding:8px 14px;border-radius:var(--r-pill);cursor:pointer;transition:all var(--e)}
.seg button:hover{color:var(--ink)}
.seg button[aria-pressed="true"]{background:var(--card);color:var(--ink);box-shadow:var(--sh)}
.seg.hot button[aria-pressed="true"]{background:var(--ink);color:#fff}
input[type=date]{font:500 13.5px/1 var(--f);color:var(--ink);border:0;background:var(--sunken);
  padding:9px 11px;border-radius:var(--r-s);cursor:pointer;transition:background var(--e)}
input[type=date]:hover{background:var(--line)}
input[type=date]:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.who-chip{border:0;background:var(--sunken);color:var(--ink-3);font:600 13.5px/1 var(--f);
  padding:9px 14px;border-radius:var(--r-pill);cursor:pointer;display:inline-flex;align-items:center;
  gap:8px;transition:all var(--e)}
.who-chip:hover{background:var(--line)}
.who-chip[aria-pressed="true"]{background:var(--ink);color:#fff}
.who-chip .pip{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.45}
.who-chip[aria-pressed="true"] .pip{opacity:1}
.ghost{border:0;background:none;color:var(--accent-deep);font:600 13.5px/1 var(--f);
  cursor:pointer;padding:9px 12px;border-radius:var(--r-s);transition:background var(--e)}
.ghost:hover{background:var(--accent-soft)}

/* ── cartes ─────────────────────────────── */
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--sh)}
.pad{padding:24px 26px}
h2{font-size:17px;font-weight:700;margin:0 0 5px;letter-spacing:-.015em}
.sub{font-size:13.5px;color:var(--mute);margin:0 0 20px;line-height:1.55;max-width:62ch}
.foot{font-size:13px;color:var(--mute);margin-top:18px;padding-top:16px;
  border-top:1px solid var(--line);line-height:1.7;max-width:74ch}
.foot b{color:var(--ink-3)}
.grid{display:grid;gap:16px;margin-bottom:16px}
.g2{grid-template-columns:1.4fr 1fr}
.g11{grid-template-columns:1fr 1fr}
@media(max-width:940px){.g2,.g11{grid-template-columns:1fr}}

/* ── decisions ──────────────────────────── */
.decide{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:16px}
.dc{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px 24px;
  position:relative;overflow:hidden;transition:transform var(--e),box-shadow var(--e),border-color var(--e)}
.dc:hover{transform:translateY(-3px);box-shadow:var(--sh-lift);border-color:var(--line-2)}
.dc .tagline{font-size:12px;font-weight:700;letter-spacing:.04em;color:var(--mute)}
.dc .big{font-size:40px;font-weight:800;letter-spacing:-.035em;line-height:1;margin:12px 0 11px;
  font-variant-numeric:tabular-nums;display:inline-block;cursor:help;
  border-bottom:2px dotted rgba(230,79,30,.35);padding-bottom:2px}
.dc.key .big{border-bottom-color:rgba(255,255,255,.3)}
.dc .txt{font-size:14px;color:var(--ink-3);line-height:1.65}
.dc .txt b{color:var(--ink);font-weight:700}
.dc.alert{background:var(--warn-bg);border-color:var(--warn-line)}
.dc.alert .tagline{color:var(--warn-ink)} .dc.alert .txt{color:#3F3417} .dc.alert .txt b{color:#241C06}
.dc.key{background:var(--ink);border-color:var(--ink)}
.dc.key .tagline{color:rgba(255,255,255,.66)} .dc.key .big{color:#fff}
.dc.key .txt{color:rgba(255,255,255,.86)} .dc.key .txt b{color:#fff}

/* ── kpi ────────────────────────────────── */
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:12px}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:15px 17px;
  transition:border-color var(--e)}
.kpi:hover{border-color:var(--line-2)}
.kpi .k{font-size:12px;font-weight:600;color:var(--mute)}
.kpi .v{font-size:28px;font-weight:800;letter-spacing:-.025em;margin-top:8px;line-height:1;font-variant-numeric:tabular-nums}
.kpi .s{font-size:12.5px;color:var(--mute);margin-top:7px;line-height:1.5}

/* ── barres ─────────────────────────────── */
.rowbar{display:grid;grid-template-columns:minmax(140px,200px) 1fr 122px;align-items:center;gap:16px;
  padding:7px 8px;margin:0 -8px;border-radius:var(--r-s);transition:background var(--e)}
.rowbar:hover{background:var(--sunken)}
.rowbar .rl{font-size:14.5px;font-weight:600;display:flex;align-items:center;gap:10px;min-width:0;color:var(--ink)}
.rowbar .rl span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.track{height:30px;border-radius:var(--r-s);background:var(--sunken);overflow:hidden;position:relative}
.track i{display:block;height:100%;border-radius:var(--r-s);transition:width 620ms cubic-bezier(.22,1,.36,1)}
.track.multi i{position:absolute;top:0;bottom:0;border-radius:0;transition:none}
.rowbar .rv{text-align:right;font-variant-numeric:tabular-nums;font-size:14.5px;font-weight:700}
.rowbar .rv em{display:block;font-style:normal;font-weight:500;color:var(--mute);font-size:12px;margin-top:3px}

/* ── tableau ────────────────────────────── */
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -4px;padding:0 4px}
table{width:100%;border-collapse:collapse;font-size:15px;min-width:640px}
th{text-align:right;font-size:12.5px;font-weight:600;color:var(--mute);
  padding:0 12px 11px;border-bottom:1px solid var(--line-2);white-space:nowrap}
th:first-child,td:first-child{text-align:left;padding-left:2px}
td{padding:14px 12px;border-bottom:1px solid var(--line);text-align:right;font-variant-numeric:tabular-nums}
tbody tr{transition:background var(--e);cursor:pointer}
tbody tr:hover{background:var(--sunken)}
tbody tr.dim{opacity:.38}
tbody tr:last-child td{border-bottom:0}
.person{display:flex;align-items:center;gap:10px}
.ini{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;flex:none;
  font-size:11.5px;font-weight:700;background:var(--sunken);color:var(--ink-3);transition:all var(--e)}
tbody tr:hover .ini{background:var(--ink);color:#fff}
.pill{display:inline-block;padding:4px 12px;border-radius:var(--r-pill);font-size:13.5px;font-weight:700}
.pill.up{background:var(--accent-soft);color:var(--accent-deep)}
.pill.flat{background:var(--sunken);color:var(--ink-3)}
.mini{height:6px;border-radius:var(--r-pill);background:var(--sunken);overflow:hidden;min-width:60px}
.mini i{display:block;height:100%;border-radius:var(--r-pill);transition:width 620ms cubic-bezier(.22,1,.36,1)}
.cellbar{display:flex;align-items:center;gap:9px;justify-content:flex-end}

/* ── legende / donut ────────────────────── */
.split{display:flex;gap:26px;align-items:center;flex-wrap:wrap}
.keys{flex:1;min-width:172px;display:flex;flex-direction:column;gap:2px}
.krow{display:flex;align-items:center;gap:10px;font-size:14px;padding:7px 9px;border-radius:var(--r-s);
  transition:background var(--e);cursor:default;color:var(--ink-3)}
.krow:hover{background:var(--sunken)}
.sq{width:11px;height:11px;border-radius:3px;flex:none}
.krow b{margin-left:auto;font-variant-numeric:tabular-nums;font-weight:700}
.krow em{font-style:normal;color:var(--mute);font-size:13px;min-width:44px;text-align:right}

/* ── heatmap ────────────────────────────── */
.heat{display:grid;grid-template-columns:38px repeat(10,1fr);gap:4px;min-width:560px}
.heat .lab{font-size:11.5px;color:var(--mute);display:grid;place-items:center;font-weight:600}
.heat .cell{aspect-ratio:1/1;border-radius:6px;display:grid;place-items:center;font-size:12px;
  font-weight:700;transition:transform var(--e);cursor:default}
.heat .cell:hover{transform:scale(1.16);z-index:2;box-shadow:var(--sh-lift)}

/* ── divers ─────────────────────────────── */
.void{padding:54px 0;text-align:center;color:var(--mute);font-size:15px}
svg{display:block;max-width:100%}
.panel{display:none;animation:fade 300ms cubic-bezier(.22,1,.36,1)}
.panel.on{display:block}
@keyframes fade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
details.audit{background:var(--card);border:1px solid var(--line);border-radius:var(--r);
  padding:20px 26px;box-shadow:var(--sh)}
details.audit summary{cursor:pointer;font-weight:700;font-size:16px;list-style:none;
  display:flex;align-items:center;gap:11px;padding:2px 0}
details.audit summary::-webkit-details-marker{display:none}
details.audit summary::before{content:"+";width:19px;height:19px;border-radius:50%;background:var(--sunken);
  display:grid;place-items:center;font-size:13px;color:var(--mute);transition:transform var(--e)}
details.audit[open] summary::before{content:"−";transform:rotate(180deg)}
details.audit ul{margin:18px 0 0;padding-left:21px;font-size:14.5px;line-height:1.8;color:var(--ink-3);max-width:82ch}
details.audit li{margin-bottom:12px}
details.audit b{color:var(--ink)}
details.audit li::marker{color:var(--mute-2)}
.hint-inline{font-size:12.5px;color:var(--mute);margin-top:14px;line-height:1.6}
#seuilbox{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--accent);
  border-radius:var(--r);padding:16px 20px;margin-bottom:18px;font-size:14.5px;line-height:1.65;color:var(--ink-3)}
#seuilbox b{color:var(--ink)}
#seuilbox .quoi{display:block;margin-top:6px;color:var(--ink)}
#tip{position:fixed;z-index:90;pointer-events:none;opacity:0;transform:translate(-50%,-116%);white-space:normal;
  background:var(--ink);color:#fff;border-radius:11px;padding:11px 14px;font-size:13.5px;line-height:1.6;
  box-shadow:0 8px 28px rgba(6,54,71,.24);transition:opacity 140ms ease;max-width:300px}
#tip.on{opacity:1}
#tip .tt{font-weight:700;margin-bottom:7px;font-size:14px}
#tip .tl{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}
#tip .tl span{color:rgba(255,255,255,.78)}
#tip .tot{margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,.16);font-weight:700}
.chartbox{position:relative;padding-left:42px;padding-bottom:24px}
.yax{position:absolute;left:0;top:0;bottom:22px;width:34px;display:flex;flex-direction:column;
  justify-content:space-between;align-items:flex-end;font-size:12px;color:var(--mute);
  font-variant-numeric:tabular-nums;font-weight:600}
.xax{position:absolute;left:42px;right:0;bottom:0;display:flex;justify-content:space-between;
  font-size:12px;color:var(--mute);font-weight:600}
.gl{stroke:var(--line);stroke-width:1;stroke-dasharray:2 4}
[data-tip]{cursor:default}
`;
