// Logique de rendu portee telle quelle depuis la version fichier v14.
// Les donnees arrivent de Supabase au lieu d etre figees dans le fichier.
export function monterDashboard(root, payload, sdrsAffiches) {
  const DATES = payload.dates;
  const SDRS  = sdrsAffiches;
  const RAW   = payload.appels;
  const CRAW  = payload.contacts;
  const BRAW  = payload.buckets;
  const NUNIQ = payload.numeros_uniques;
  const COUV  = (payload.couverture || []).map(c => ({
    b: ['inbound','compte_existant','outbound','agent_ia','autre','non_identifie'].indexOf(c.bucket),
    n: c.total, a: c.appeles
  })).filter(c => c.b >= 0);
  const MAJ = payload.maj;
  const $ = id => root.querySelector('#' + id);


const F=RAW.split(";").map(r=>{const p=r.split(".").map(Number);return{d:p[0],s:p[1],h:p[2],b:p[3],n:p[4],tk:p[5]};});
const C=CRAW.split(";").map(r=>{const p=r.split(".").map(Number);
  return{s:p[0],d:p[1],dials:p[2],t:{1:p[3],60:p[4],120:p[5],180:p[6],300:p[7]}};});
const B=BRAW.split(";").map(r=>{const p=r.split(".").map(Number);return{d:p[0],s:p[1],k:p[2],b:p[3],n:p[4]};});

const IN=[9], MACHINE=[1,2];
const BANDS={0:'Non abouti',1:'Répondeur détecté',2:'Répondeur probable',3:'Raccroché par le prospect',
  4:'Échange 10-29 s',5:'Échange 30-59 s',6:'Conversation 1-2 min',7:'Conversation 2-3 min',
  8:'Conversation 3-5 min',10:'Conversation 5 min et +'};
const BORD=[10,8,7,6,5,4,3,2,1,0];
const GREY=['#DEDBD7','#C9C5C0','#B4AFA9','#9E9892','#87817B'];
const SHADE=b=>({10:'#E64F1E',8:'#EE7449',7:'#F49A79',6:'#F8BFA9'}[b]||GREY[[5,4,3,2,1,0].indexOf(b)%5]||'#DEDBD7');
const BKN=['Inbound','Déjà dans le CRM','Outbound','Agent IA','Autre','Non identifié'];
const BKD=['Le prospect est venu à nous : formulaire, pub, référencement','Le numéro correspond à une fiche contact déjà enregistrée dans Odoo — client, ancien client, partenaire ou fournisseur. Ce n\'est pas un nouveau lead.','Prospection à froid : campagnes par segment, lemlist, cold call','Contacts produits par l\'agent Clay : signal détecté puis décideur enrichi','Réseau, bouche-à-oreille, upsell','Numéro absent d\'Odoo et de Clay : lemlist ou numérotation manuelle'];
const BKC=['#E64F1E','#0E4457','#7A8A93','#EE7449','#C9C5C0','#DEDBD7'];
const THRB={1:[2,3,4,5,6,7,8,10],60:[6,7,8,10],120:[7,8,10],180:[8,10],300:[10]};
const THRL={1:'moins d\'1 min',60:'1 min',120:'2 min',180:'3 min',300:'5 min'};
const THRS={1:'– d\'1 min',60:'1 min',120:'2 min',180:'3 min',300:'5 min'};
// Une phrase par seuil : ce que ca montre, et quoi en faire.
const THRTXT={
  1:['Un numéro compte comme joint dès qu\'une seconde de conversation a eu lieu — y compris un appel raccroché aussitôt.','À utiliser pour juger le FICHIER. Si ce taux est haut et que celui à 1 min s\'effondre, tes numéros sont bons : c\'est l\'accroche qui ne passe pas.'],
  60:['Un numéro compte comme joint dès qu\'une conversation a tenu une minute.','Le seuil le plus sûr pour décider quels numéros sortir de la base : sous une minute après 10 appels, il n\'y a rien à aller chercher.'],
  120:['Deux minutes : la conversation a dépassé la politesse.','Seuil intermédiaire. Utile pour comparer les SDR entre eux sans être trop sévère.'],
  180:['Trois minutes : le prospect a vraiment engagé la discussion.','Le seuil de référence pour juger la PERFORMANCE. Attention, la colonne des appels perdus devient trop sévère ici.'],
  300:['Cinq minutes : découverte en profondeur.','Très exigeant. Quelques dizaines de contacts seulement — à lire comme un signal de qualité, pas comme un objectif.']
};



const fr=n=>Math.round(n).toLocaleString('fr-FR');
const nm=e=>{const s=e.split('@')[0];return s.charAt(0).toUpperCase()+s.slice(1);};
const ini=e=>e.slice(0,2).toUpperCase();
const fd=s=>new Date(s+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
const dow=s=>{const d=new Date(s+'T00:00:00').getDay();return d===0?7:d;};


let st={from:DATES[0],to:DATES[DATES.length-1],sdrs:new Set(SDRS.map((_,i)=>i)),thr:180,panel:'decide'};

$('chips').innerHTML=SDRS.map((e,i)=>
  '<button class="who-chip" data-s="'+i+'" aria-pressed="true"><i class="pip"></i>'+nm(e)+'</button>').join('');
$('from').value=st.from;$('to').value=st.to;
$('from').min=DATES[0];$('from').max=DATES[DATES.length-1];
$('to').min=DATES[0];$('to').max=DATES[DATES.length-1];

root.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('.tab');if(!b)return;
  root.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected','false'));
  b.setAttribute('aria-selected','true');st.panel=b.dataset.p;show();});
$('presets').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  [...$('presets').children].forEach(x=>x.setAttribute('aria-pressed','false'));
  b.setAttribute('aria-pressed','true');const last=DATES[DATES.length-1];
  if(b.dataset.p==='all')st.from=DATES[0];
  else{const d=new Date(last+'T00:00:00');d.setDate(d.getDate()-Number(b.dataset.p)+1);
       st.from=d.toISOString().slice(0,10);}
  st.to=last;$('from').value=st.from;$('to').value=st.to;render();});
$('thr').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  [...$('thr').children].forEach(x=>x.setAttribute('aria-pressed','false'));
  b.setAttribute('aria-pressed','true');st.thr=Number(b.dataset.t);render();});
['from','to'].forEach(id=>$(id).addEventListener('change',e=>{st[id]=e.target.value;
  if(st.from>st.to){if(id==='from'){st.to=st.from;$('to').value=st.to;}else{st.from=st.to;$('from').value=st.from;}}
  [...$('presets').children].forEach(x=>x.setAttribute('aria-pressed','false'));render();}));
$('chips').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  toggleSdr(Number(b.dataset.s));});
$('reset').addEventListener('click',()=>{
  st={from:DATES[0],to:DATES[DATES.length-1],sdrs:new Set(SDRS.map((_,i)=>i)),thr:180,panel:st.panel};
  $('from').value=st.from;$('to').value=st.to;
  [...$('chips').children].forEach(b=>b.setAttribute('aria-pressed','true'));
  [...$('presets').children].forEach((x,i)=>x.setAttribute('aria-pressed',i===3));
  [...$('thr').children].forEach((x,i)=>x.setAttribute('aria-pressed',i===3));
  render();});

function toggleSdr(i){
  if(st.sdrs.size===SDRS.length){st.sdrs=new Set([i]);}                 // clic = isoler
  else if(st.sdrs.has(i)&&st.sdrs.size===1){st.sdrs=new Set(SDRS.map((_,k)=>k));} // reclic = tout
  else if(st.sdrs.has(i)){st.sdrs.delete(i);} else {st.sdrs.add(i);}
  [...$('chips').children].forEach((b,k)=>b.setAttribute('aria-pressed',st.sdrs.has(k)));
  render();
}
root.__toggleSdr=toggleSdr;

function show(){root.querySelectorAll('.panel').forEach(p=>
  p.classList.toggle('on',p.dataset.p===st.panel));}

function calc(){
  const T=st.thr,CONV=THRB[T];
  const rows=F.filter(r=>DATES[r.d]>=st.from&&DATES[r.d]<=st.to&&st.sdrs.has(r.s));
  const out=rows.filter(r=>!IN.includes(r.b)),inb=rows.filter(r=>IN.includes(r.b));
  const sum=(a,f)=>a.reduce((t,r)=>t+f(r),0),cnt=(a,p)=>sum(a.filter(p),r=>r.n);
  const dials=sum(out,r=>r.n);
  const CF=C.filter(c=>DATES[c.d]>=st.from&&DATES[c.d]<=st.to&&st.sdrs.has(c.s));
  const BF=B.filter(r=>DATES[r.d]>=st.from&&DATES[r.d]<=st.to&&st.sdrs.has(r.s));
  return {T,CONV,rows,out,inb,sum,cnt,dials,CF,BF,
    conv:cnt(out,r=>CONV.includes(r.b)),
    mach:cnt(out,r=>MACHINE.includes(r.b)),
    nonab:cnt(out,r=>r.b===0),
    talk:sum(rows,r=>r.tk),
    jours:new Set(rows.map(r=>r.d)).size};
}

function render(){
  const D=calc();
  if(!D.dials){$('app').innerHTML='<div class="card pad"><div class="void">Aucun appel sur cette sélection. Élargis la période ou réactive un SDR.</div></div>';
    $('meta').textContent='Aucune donnée';return;}
  const joints=D.CF.filter(c=>c.t[D.T]>0),nbC=D.CF.length||1;
  const pctJ=joints.length/nbC*100;
  const cDials=D.CF.reduce((t,c)=>t+c.dials,0)||1;
  const zomb=D.CF.filter(c=>c.dials>=10&&c.t[D.T]===0);
  const zD=zomb.reduce((t,c)=>t+c.dials,0);
  const MT=8,cad=new Array(MT+1).fill(0);
  joints.forEach(c=>{cad[Math.min(c.t[D.T],MT+1)-1]++;});
  let s95=MT,acc=0;for(let i=0;i<cad.length;i++){acc+=cad[i];
    if(joints.length&&acc/joints.length>=.95){s95=i+1;break;}}
  const apres=D.CF.reduce((t,c)=>t+Math.max(0,c.dials-s95),0);
  const bt=new Array(6).fill(0),bc=new Array(6).fill(0);
  D.BF.forEach(r=>{bt[r.k]+=r.n;if(D.CONV.includes(r.b))bc[r.k]+=r.n;});
  const bTot=bt.reduce((a,b)=>a+b,0)||1;

  $('seuilbox').innerHTML='<b>Seuil « '+THRS[D.T]+' » — '+THRTXT[D.T][0]+'</b>'+
    '<span class="quoi">'+THRTXT[D.T][1]+'</span>';

  $('meta').innerHTML='Du <b>'+fd(st.from)+'</b> au <b>'+fd(st.to)+'</b> · <b>'+D.jours+
    '</b> jours d\'activité · <b>'+st.sdrs.size+'/'+SDRS.length+'</b> SDR · <b>'+fr(D.dials)+
    '</b> appels sortants vers <b>'+(st.sdrs.size===SDRS.length?fr(NUNIQ):fr(D.CF.length))+'</b> numéros';

  $('app').innerHTML =
    panelDecide(D,{joints,nbC,pctJ,zomb,zD,cDials,s95,apres,bt,bTot,bc}) +
    panelTeam(D,{pctJ}) +
    panelOrigin(D,{bt,bc,bTot}) +
    panelWhen(D,{joints,cad,s95,MT}) +
    panelTrust();
  show();
}

/* ════ onglet 1 : DÉCIDER ════ */
function panelDecide(D,x){
  const per=sdrStats(D);
  const rank=[...per].filter(p=>p.nc>=15).sort((p,q)=>(q.j/q.nc)-(p.j/p.nc));
  const best=rank[0], worst=rank[rank.length-1];
  const parContact=x.cDials/(D.CF.length||1);
  const gain=Math.round((x.zD+x.apres)/Math.max(parContact,1)*x.pctJ/100);
  const gaspi=x.zD+x.apres;
  const solo=st.sdrs.size===1?nm(SDRS[[...st.sdrs][0]]):null;

  const parJour = D.jours ? Math.round(D.dials / D.jours) : 0;
  const entrants = D.sum(D.inb, function(r){ return r.n; });
  const sansIssue = D.nonab + D.mach;

  const c0 = '<b>'+fr(D.dials)+' appels sortants</b> composés vers <b>'+(st.sdrs.size===SDRS.length?fr(NUNIQ):fr(D.CF.length))+
    '</b> numéros distincts, soit '+parJour+' par jour d\'activité. Ce total compte TOUT : les appels qui n\'ont jamais sonné, '+
    'ceux tombés sur un répondeur, et les vraies conversations. S\'y ajoutent <b>'+fr(entrants)+' appels entrants</b>.';

  const c1 = '<b>'+fr(x.joints.length)+' numéros sur '+fr(x.nbC)+'</b> ont donné au moins une conversation de <b>'+
    THRL[D.T]+'</b> ou plus. Les autres n\'ont jamais décroché, ou pas assez longtemps.'+
    (best && rank.length>1 ? ' Le plus régulier de l\'équipe : <b>'+nm(SDRS[best.si])+'</b>.' : '');

  const c2 = gaspi>0
    ? '<b>'+fr(gaspi)+' appels sur '+fr(x.cDials)+'</b> partaient perdus d\'avance. '+
      fr(x.zD)+' visaient un numéro déjà appelé 10 fois sans jamais aboutir. '+
      fr(x.apres)+' étaient des tentatives au-delà de la '+x.s95+'e, là où il ne reste que 5 % de chances.'
    : 'Aucun appel perdu d\'avance sur cette sélection.';

  const c3 = '<b>'+fr(x.bt[2]+x.bt[3])+' appels sur '+fr(x.bTot)+'</b> visent un prospect que personne chez Enky ne connaissait : '+
    fr(x.bt[2])+' en prospection classique, '+fr(x.bt[3])+' via l\'agent IA. Tout le reste va vers de l\'inbound, '+
    'un contact déjà au CRM, ou un numéro dont on ignore la provenance.';

  const fun=funnelCalc(D);
  const TT = function(s){ return s.replace(/"/g,'&quot;'); };
  const cards=[
    {cls:'',t:'Appels passés, tous confondus',v:fr(D.dials),x:c0,a:'var(--ink)',
     tip:TT('<div class="tt">Comment le lire</div>Le volume ne dit rien de la performance. Compare-le au nombre de numéros : au-delà de 4 appels par numéro, on relance plus qu\'on ne prospecte.')},
    {cls:'key',t:'Numéros qu\'on arrive à joindre',v:x.pctJ.toFixed(0)+' %',x:c1,
     tip:TT('<div class="tt">Comment le lire</div>C\'est LA métrique de performance : le volume d\'appels ne peut pas la gonfler. Bascule le seuil pour voir à quel point elle en dépend.')},
    {cls:gaspi>0?'alert':'',t:'Appels perdus d\'avance',v:gaspi>0?(gaspi/x.cDials*100).toFixed(0)+' %':'0 %',x:c2,
     tip:TT('<div class="tt">Comment le lire</div>Plus le seuil monte, plus ce chiffre gonfle. Regarde-le à « – d\'1 min » pour savoir quels numéros jeter, pas à 3 min.')},
    {cls:'',t:'Part de vraie prospection',v:((x.bt[2]+x.bt[3])/x.bTot*100).toFixed(0)+' %',x:c3,
     tip:TT('<div class="tt">Comment le lire</div>Ne bouge pas avec le seuil. S\'il est bas, l\'équipe entretient la base installée plutôt que d\'aller chercher du neuf.')},
    {cls:'',t:'Leads qu\'on n\'appelle jamais',v:'77 %',
     tip:TT('<div class="tt">Comment le lire</div>Ce chiffre ne dépend ni du seuil ni des filtres. C\'est de l\'acquisition payée puis jamais composée — la fuite la moins visible.'),
     x:'<b>593 des 775 leads</b> créés depuis le 29 juin avec un numéro de téléphone n\'ont jamais été composés. '+
       'Chez l\'agent IA c\'est <b>89 %</b>. Chiffre de période complète, il ne suit pas les filtres.'}
  ];

  const prio=[];
  if(x.apres>0) prio.push('Couper la cadence après la <b>'+x.s95+'e tentative</b> : au-delà, il ne reste que 5 % de chances de joindre le contact. <b>'+fr(x.apres)+' appels</b> à replacer.');
  if(x.zomb.length) prio.push('Sortir de la liste les <b>'+x.zomb.length+' numéros</b> appelés 10 fois ou plus sans une seule conversation. <b>'+fr(x.zD)+' appels</b> immobilisés.');
  if(worst&&rank.length>1&&worst.nc>=15) prio.push('Regarder la base travaillée par <b>'+nm(SDRS[worst.si])+
    '</b> : '+(worst.j/worst.nc*100).toFixed(0)+' % de contacts joints contre '+x.pctJ.toFixed(0)+
    ' % pour l\'équipe sur la même période. Question de liste avant d\'être une question de pitch.');
  prio.push('Router les contacts de l\'agent IA vers les SDR : <b>411 produits</b>, <b>37 appelés</b>. Deux des quatre tables Clay n\'ont jamais été ouvertes.');

  return '<div class="panel" data-p="decide">'+
    '<div class="decide">'+cards.map(c=>'<div class="dc '+c.cls+'"'+(c.a?' style="--a:'+c.a+'"':'')+
      '><div class="tagline">'+c.t+'</div><div class="big"'+(c.tip?' data-tip="'+c.tip+'"':'')+
      '>'+c.v+'</div><div class="txt">'+c.x+'</div></div>').join('')+'</div>'+
    '<div class="grid g2"><div class="card pad"><h2>Le parcours d\'un appel</h2>'+
      '<p class="sub">La première barre est le total de TOUS les appels sortants, y compris ceux qui n\'ont jamais abouti. '+
      'Attention : ces barres comptent des APPELS, pas des contacts — un numéro rappelé 20 fois y pèse 20 lignes. Survole pour le détail.</p>'+
      fun.html+
      '<p class="foot">Ringover marque un appel « décroché » dès que la ligne s\'ouvre — répondeur compris. '+
      'La zone hachurée de la 2e barre isole les <b>'+fr(fun.abouti-fun.humain)+' répondeurs</b> : détectés par Ringover, '+
      'ou identifiés par une sonnerie longue suivie d\'un raccroché immédiat du SDR.<br><br>'+
      'La dernière barre suit le seuil choisi en haut de page. Change-le et regarde la marche se déplacer : '+
      'c\'est la façon la plus rapide de voir où ton équipe perd réellement ses appels.</p></div>'+
      '<div class="card pad"><h2>Priorités</h2>'+
      '<p class="sub">Recalculées à partir de la période, des SDR et du seuil sélectionnés</p>'+
      '<ol style="margin:0;padding-left:21px;font-size:14.5px;line-height:1.75;color:var(--ink-3)">'+
      prio.map(p=>'<li style="margin-bottom:15px">'+p+'</li>').join('')+'</ol>'+
      '<p class="foot">Ces priorités sortent de la donnée, pas d\'objectifs que tu aurais fixés. '+
      'Tant qu\'on n\'a pas défini ensemble les cibles de l\'équipe, lis-les comme des constats, pas comme des verdicts.</p></div></div></div>';
}

/* ════ onglet 2 : ÉQUIPE ════ */
function sdrStats(D){
  return [...st.sdrs].map(si=>{
    const o2=D.out.filter(r=>r.s===si),a2=D.rows.filter(r=>r.s===si),c2=D.CF.filter(c=>c.s===si);
    const z2=c2.filter(c=>c.dials>=10&&c.t[D.T]===0);
    const d=D.sum(o2,r=>r.n),jours=new Set(o2.map(r=>r.d)).size;
    return{si,d,jours,parJour:jours?d/jours:0,nc:c2.length,j:c2.filter(c=>c.t[D.T]>0).length,
      dpc:c2.length?c2.reduce((t,c)=>t+c.dials,0)/c2.length:0,
      zd:z2.reduce((t,c)=>t+c.dials,0),zc:c2.reduce((t,c)=>t+c.dials,0)||1,
      talk:D.sum(a2,r=>r.tk)};}).filter(x=>x.d>0).sort((a,b)=>(b.nc?b.j/b.nc:0)-(a.nc?a.j/a.nc:0));
}
function panelTeam(D,x){
  const per=sdrStats(D);
  const moy=x.pctJ;
  const body=per.map(p=>{const pj=p.nc?p.j/p.nc*100:0,gp=p.zd/p.zc*100;
    return '<tr data-sdr="'+p.si+'" title="Cliquer pour isoler ce SDR" style="cursor:pointer">'+
      '<td><div class="person"><div class="ini">'+ini(SDRS[p.si])+'</div><b>'+nm(SDRS[p.si])+'</b></div></td>'+
      '<td>'+fr(p.nc)+'</td><td>'+fr(p.d)+'</td><td><b>'+fr(p.parJour)+'</b></td><td>'+p.dpc.toFixed(1)+'</td>'+
      '<td><div class="cellbar"><div class="mini"><i style="width:'+Math.min(pj*2,100).toFixed(0)+
        '%;background:var(--ink)"></i></div><b>'+pj.toFixed(0)+'%</b></div></td>'+
      '<td><span class="pill '+(pj>=moy*1.08?'up':'flat')+'">'+fr(p.j)+'</span></td>'+
      '<td><div class="cellbar"><div class="mini"><i style="width:'+gp.toFixed(0)+
        '%;background:'+(gp>20?'var(--accent)':'var(--mute-2)')+'"></i></div>'+gp.toFixed(0)+'%</div></td>'+
      '<td>'+fr(p.talk/3600)+' h</td></tr>';}).join('');
  return '<div class="panel" data-p="team">'+
    '<div class="card pad" style="margin-bottom:12px"><h2>Performance par SDR</h2>'+
    '<p class="sub">Trié par taux de contacts joints — la seule métrique que le volume de dials ne peut pas gonfler. Clique une ligne pour isoler ce SDR.</p>'+
    '<div class="scroll"><table><thead><tr><th>SDR</th><th>Contacts</th><th>Dials</th><th>Appels / jour</th>'+
    '<th>Dials / contact</th><th>% joints</th><th>Joints</th><th>Gaspillé</th><th>Temps parlé</th>'+
    '</tr></thead><tbody>'+body+'</tbody></table></div>'+
    '<p class="foot">« Gaspillé » = part des appels partis sur des numéros relancés 10 fois ou plus sans jamais atteindre le seuil choisi. '+
    'Un numéro est rattaché au SDR qui l\'a appelé et au jour de son premier appel. <b>44 numéros ont été travaillés par plusieurs SDR</b> : '+
    'ils comptent une fois chez chacun, donc la somme de cette colonne dépasse les 991 numéros distincts de l\'équipe. C\'est voulu — '+
    'chaque SDR doit voir sa propre charge.</p></div>'+
    '<div class="grid g11"><div class="card pad"><h2>Appels par jour</h2>'+
    '<p class="sub">Barres empilées, une nuance par SDR · survole pour le détail</p>'+dailyChart(D,per)+
    '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px">'+
    per.map((p,i)=>'<div class="krow" style="padding:7px 11px;background:var(--sunken)"><i class="sq" style="background:'+
      teamShade(i,per.length)+'"></i>'+nm(SDRS[p.si])+'<b style="margin-left:9px;color:var(--ink)">'+
      fr(p.parJour)+' appels / jour</b></div>').join('')+
    '</div></div>'+
    '<div class="card pad"><h2>Couverture de la base Odoo</h2>'+
    '<p class="sub">Leads créés depuis le 29 juin avec un téléphone · période complète, non filtrable</p>'+
    COUV.map(c=>'<div class="rowbar"><div class="rl"><i class="sq" style="background:'+BKC[c.b]+'"></i><span>'+
      BKN[c.b]+'</span></div><div class="track"><i style="width:'+(c.a/c.n*100).toFixed(1)+'%;background:'+BKC[c.b]+
      '"></i></div><div class="rv">'+(c.a/c.n*100).toFixed(0)+' %<em>'+c.a+' / '+c.n+'</em></div></div>').join('')+
    '<p class="foot"><b>593 leads sur 775 n\'ont jamais été composés.</b> Tu paies l\'acquisition de 623 leads inbound avec un numéro et 3 sur 4 ne sont jamais appelés.</p>'+
    '</div></div></div>';
}
function teamShade(i,n){return ['#063647','#E64F1E','#7A8A93','#EE7449','#B4AFA9'][i%5];}
function dailyChart(D,per){
  const order=per.map(p=>p.si);
  const day={};D.rows.forEach(r=>{if(IN.includes(r.b))return;const k=DATES[r.d];
    day[k]=day[k]||{};day[k][r.s]=(day[k][r.s]||0)+r.n;});
  const dk=Object.keys(day).sort();
  if(!dk.length)return'<div class="void">Pas de données</div>';
  const tot=k=>Object.values(day[k]).reduce((a,b)=>a+b,0);
  const mx=Math.max(...dk.map(tot),1);
  const step=(700)/dk.length, bw=Math.max(2.5,Math.min(15,step-3)), H=150, TOP=8, BASE=H-2;
  const y=v=>BASE-(v/mx)*(BASE-TOP);
  let bars='',hits='';
  dk.forEach((k,i)=>{
    const cx=i*step+step/2;
    let yy=BASE;
    order.forEach((si,oi)=>{const n=day[k][si]||0;if(!n)return;
      const h=(n/mx)*(BASE-TOP);yy-=h;
      bars+='<rect x="'+(cx-bw/2).toFixed(1)+'" y="'+yy.toFixed(1)+'" width="'+bw.toFixed(1)+
            '" height="'+h.toFixed(1)+'" rx="2" fill="'+teamShade(oi,order.length)+'"/>';});
    const lines=order.filter(si=>day[k][si]).map((si,oi)=>
      '<div class="tl"><span>'+nm(SDRS[si])+'</span><b>'+fr(day[k][si])+'</b></div>').join('');
    const lab=new Date(k+'T00:00:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'});
    const tip=('<div class="tt">'+lab+'</div>'+lines+'<div class="tl tot"><span>Total</span><b>'+
               fr(tot(k))+' appels</b></div>').replace(/"/g,'&quot;');
    hits+='<rect data-tip="'+tip+'" x="'+(i*step).toFixed(1)+'" y="0" width="'+step.toFixed(1)+
          '" height="'+BASE+'" fill="transparent"/>';
  });
  const grid=[0,.5,1].map(f=>'<line class="gl" x1="0" y1="'+y(mx*f).toFixed(1)+'" x2="700" y2="'+
    y(mx*f).toFixed(1)+'"/>').join('');
  const xl=[dk[0],dk[Math.floor(dk.length/2)],dk[dk.length-1]]
    .map(k=>'<span>'+fd(k)+'</span>').join('');
  return '<div class="chartbox"><div class="yax"><span>'+fr(mx)+'</span><span>'+fr(mx/2)+
    '</span><span>0</span></div>'+
    '<svg viewBox="0 0 700 '+H+'" preserveAspectRatio="none" style="width:100%;height:158px">'+
    grid+bars+hits+'<line x1="0" y1="'+BASE+'" x2="700" y2="'+BASE+'" stroke="#DAD7D3" stroke-width="1"/>'+
    '</svg><div class="xax">'+xl+'</div></div>'+
    '<p class="hint-inline">Axe vertical : nombre d\'appels sortants dans la journée. Axe horizontal : jours d\'activité, week-ends exclus.</p>';
}

/* ════ onglet 3 : ORIGINE ════ */
function panelOrigin(D,x){
  let a=0;
  const bar=x.bt.map((n,i)=>{if(!n)return'';const w=n/x.bTot*100,l=a;a+=w;
    return '<i data-tip="'+('<div class=&quot;tt&quot;>'+BKN[i]+'</div><div class=&quot;tl&quot;><span>Appels</span><b>'+
      fr(n)+'</b></div><div class=&quot;tl&quot;><span>Part</span><b>'+w.toFixed(1)+' %</b></div>')+
      '" style="left:'+l.toFixed(2)+'%;width:'+w.toFixed(2)+'%;background:'+BKC[i]+'"></i>';}).join('');
  const rows=x.bt.map((n,i)=>({i,n})).filter(v=>v.n).sort((p,q)=>q.n-p.n).map(v=>
    '<tr><td><div class="person"><i class="sq" style="width:10px;height:10px;background:'+BKC[v.i]+
    '"></i><div><b>'+BKN[v.i]+'</b><div style="font-size:11px;color:var(--mute);font-weight:400;line-height:1.4;max-width:330px;white-space:normal">'+
    BKD[v.i]+'</div></div></div></td><td>'+fr(v.n)+'</td><td><b>'+(v.n/x.bTot*100).toFixed(1)+
    ' %</b></td><td>'+fr(x.bc[v.i])+'</td><td>'+(x.bc[v.i]/v.n*100).toFixed(1)+' %</td></tr>').join('');
  const per=[...st.sdrs].map(si=>{const v=new Array(6).fill(0);
    D.BF.filter(r=>r.s===si).forEach(r=>v[r.k]+=r.n);
    return{si,v,t:v.reduce((p,q)=>p+q,0)};}).filter(p=>p.t).sort((p,q)=>q.t-p.t);
  const perRows=per.map(p=>{let l=0;
    const seg=p.v.map((n,i)=>{if(!n)return'';const w=n/p.t*100,x0=l;l+=w;
      return '<i data-tip="'+('<div class=&quot;tt&quot;>'+nm(SDRS[p.si])+' · '+BKN[i]+
        '</div><div class=&quot;tl&quot;><span>Appels</span><b>'+fr(n)+'</b></div><div class=&quot;tl&quot;><span>Part de ses dials</span><b>'+
        w.toFixed(1)+' %</b></div>')+'" style="left:'+x0.toFixed(2)+'%;width:'+w.toFixed(2)+
        '%;background:'+BKC[i]+'"></i>';}).join('');
    return '<div class="rowbar" data-sdr="'+p.si+'" style="cursor:pointer"><div class="rl">'+
      '<div class="ini" style="width:24px;height:24px;font-size:9px">'+ini(SDRS[p.si])+'</div><span>'+
      nm(SDRS[p.si])+'</span></div><div class="track multi">'+seg+'</div>'+
      '<div class="rv">'+fr(p.t)+'<em>'+(p.v[2]/p.t*100).toFixed(0)+' % outbound</em></div></div>';}).join('');
  return '<div class="panel" data-p="origin"><div class="card pad" style="margin-bottom:12px">'+
    '<h2>D\'où viennent les contacts appelés</h2>'+
    '<p class="sub">Origine déterminée par le Sheet Clay, puis le lien Odoo attaché par Ringover, puis le champ source du lead</p>'+
    '<div class="track multi" style="height:34px;margin-bottom:18px">'+bar+'</div>'+
    '<div class="scroll"><table style="min-width:auto"><thead><tr><th>Origine</th><th>Appels</th>'+
    '<th>Part</th><th>Conversations</th><th>Taux</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
    '<div style="margin-top:22px">'+perRows+'</div>'+
    '<p class="foot"><b>« Déjà dans le CRM »</b> : le numéro appelé correspond à une fiche contact Odoo (<code>res.partner</code>) et non à une piste. '+
    'Autrement dit quelqu\'un que l\'entreprise connaît déjà — client actuel, ancien client, partenaire, fournisseur, parfois un contact interne. '+
    'Ce n\'est ni de l\'inbound ni de la conquête : c\'est du travail sur la base installée.<br><br>'+
    'Les <b>'+(x.bt[5]/x.bTot*100).toFixed(0)+' % non identifiés</b> ne sont ni dans Odoo ni dans les 4 onglets Clay. '+
    'Ce sont vraisemblablement des leads lemlist ou de la numérotation manuelle. Tant que le sync lemlist n\'est pas branché, '+
    'la part réelle d\'outbound reste inconnue — elle est forcément supérieure aux '+(x.bt[2]/x.bTot*100).toFixed(1)+' % affichés.</p></div></div>';
}

/* ════ onglet 4 : QUAND & COMMENT ════ */
function funnelCalc(D){
  const ech30=D.cnt(D.out,r=>r.b>=5&&r.b!==9);
  const abouti=D.dials-D.nonab, humain=abouti-D.mach;
  const P=v=>(v/D.dials*100);
  const T=(ti,li)=>('<div class="tt">'+ti+'</div>'+li).replace(/"/g,'&quot;');
  const step=(label,val,prev,fill,tip,extra)=>
    '<div class="rowbar"><div class="rl"><span>'+label+'</span></div>'+
    '<div class="track multi" data-tip="'+tip+'">'+
      '<i style="left:0;width:'+P(val).toFixed(2)+'%;background:'+fill+'"></i>'+(extra||'')+
    '</div><div class="rv">'+fr(val)+
    (prev?'<em>'+(prev?(val/prev*100).toFixed(0):0)+' % de l\'étape avant</em>':'')+'</div></div>';

  let html='';
  html+=step('Numéros composés',D.dials,0,'#0E4457',
    T('Numéros composés',"<div class='tl'><span>Appels sortants</span><b>"+fr(D.dials)+"</b></div>"));
  // ligne decrochee : la partie machine est grisee A L INTERIEUR de la barre
  html+=step('Quelque chose a décroché',abouti,D.dials,'#2E5A6B',
    T('Quelque chose a décroché',
      "<div class='tl'><span>Un humain</span><b>"+fr(humain)+"</b></div>"+
      "<div class='tl'><span>Un répondeur</span><b>"+fr(D.mach)+"</b></div>"+
      "<div class='tl tot'><span>Total décroché</span><b>"+fr(abouti)+"</b></div>"),
    '<i style="left:'+P(humain).toFixed(2)+'%;width:'+P(D.mach).toFixed(2)+
    '%;background:repeating-linear-gradient(135deg,#B4AFA9 0 5px,#C9C5C0 5px 10px)"></i>');
  html+=step('Un humain a décroché',humain,abouti,'#7A8A93',
    T('Un humain a décroché',"<div class='tl'><span>Répondeurs retirés</span><b>−"+fr(D.mach)+"</b></div>"+
      "<div class='tl tot'><span>Humains joints</span><b>"+fr(humain)+"</b></div>"));
  html+=step('Conversation ≥ '+THRL[D.T],D.conv,humain,'#E64F1E',
    T('Conversation ≥ '+THRL[D.T],"<div class='tl'><span>Appels</span><b>"+fr(D.conv)+"</b></div>"+
      "<div class='tl'><span>Sur total composé</span><b>"+P(D.conv).toFixed(1)+" %</b></div>"));
  return {html,abouti,humain,ech30};
}

function panelWhen(D,x){
  let ang=-Math.PI/2,arcs='';
  BORD.forEach(b=>{const n=D.cnt(D.out,r=>r.b===b);if(!n)return;
    const sw=n/D.dials*Math.PI*2,e=ang+sw,R=82,r0=54,Cc=96;
    const p=(A,rr)=>[Cc+rr*Math.cos(A),Cc+rr*Math.sin(A)];
    const[x1,y1]=p(ang,R),[x2,y2]=p(e,R),[x3,y3]=p(e,r0),[x4,y4]=p(ang,r0);
    arcs+='<path d="M'+x1+' '+y1+'A'+R+' '+R+' 0 '+(sw>Math.PI?1:0)+' 1 '+x2+' '+y2+'L'+x3+' '+y3+
      'A'+r0+' '+r0+' 0 '+(sw>Math.PI?1:0)+' 0 '+x4+' '+y4+'Z" fill="'+SHADE(b)+'"><title>'+
      BANDS[b]+' : '+fr(n)+'</title></path>';ang=e;});
  const donut='<svg width="192" height="192" viewBox="0 0 192 192">'+arcs+
    '<text x="96" y="91" text-anchor="middle" font-size="25" font-weight="800" fill="#063647">'+
    (D.conv/D.dials*100).toFixed(1)+'%</text><text x="96" y="110" text-anchor="middle" font-size="9" '+
    'font-weight="600" fill="#7A8A93">≥ '+THRL[D.T].toUpperCase()+'</text></svg>';
  const keys=BORD.map(b=>{const n=D.cnt(D.out,r=>r.b===b);if(!n)return'';
    return '<div class="krow"><i class="sq" style="background:'+SHADE(b)+'"></i>'+BANDS[b]+'<b>'+fr(n)+
      '</b><em>'+(n/D.dials*100).toFixed(1)+'%</em></div>';}).join('');
  let cum=0;const cadRows=x.cad.map((n,i)=>{cum+=n;
    const cp=x.joints.length?cum/x.joints.length*100:0;
    return '<div class="rowbar"><div class="rl"><span>'+(i<x.MT?'Tentative '+(i+1):'9e et au-delà')+
      '</span></div><div class="track"><i style="width:'+cp.toFixed(1)+'%;background:'+
      (i+1<=x.s95?'#E64F1E':'#DEDBD7')+'"></i></div><div class="rv">'+cp.toFixed(0)+' %<em>'+n+
      ' contacts</em></div></div>';}).join('');
  const HM={};D.out.forEach(r=>{const w=dow(DATES[r.d]);if(w>5||r.h<9||r.h>18)return;
    const k=w+'-'+r.h;HM[k]=HM[k]||{d:0,c:0};HM[k].d+=r.n;if(D.CONV.includes(r.b))HM[k].c+=r.n;});
  const DW=['Lun','Mar','Mer','Jeu','Ven'],HR=[9,10,11,12,13,14,15,16,17,18];
  let best={r:-1},hm='<div class="lab"></div>'+HR.map(h=>'<div class="lab">'+h+'h</div>').join('');
  DW.forEach((lb,di)=>{hm+='<div class="lab">'+lb+'</div>';
    HR.forEach(h=>{const c=HM[(di+1)+'-'+h];
      if(!c||c.d<20){hm+='<div class="cell" style="background:var(--sunken)"></div>';return;}
      const rt=c.c/c.d;if(rt>best.r)best={r:rt,lb,h,n:c.d};
      const a=Math.min(rt/.15,1);
      hm+='<div class="cell" data-tip="'+('<div class=&quot;tt&quot;>'+lb+' '+h+'h — '+(h+1)+'h</div>'+
        '<div class=&quot;tl&quot;><span>Appels</span><b>'+fr(c.d)+'</b></div>'+
        '<div class=&quot;tl&quot;><span>Conversations</span><b>'+fr(c.c)+'</b></div>'+
        '<div class=&quot;tl tot&quot;><span>Taux</span><b>'+(rt*100).toFixed(0)+' %</b></div>')+
        '" style="background:rgba(230,79,30,'+
        (.06+a*.84).toFixed(2)+');color:'+(a>.55?'#fff':'#063647')+'">'+(rt*100).toFixed(0)+'</div>';});});
  return '<div class="panel" data-p="when">'+
    '<div class="grid g2"><div class="card pad"><h2>À quelle tentative le contact répond</h2>'+
    '<p class="sub">Cumul des '+fr(x.joints.length)+' contacts joints · en orange, la zone qui produit 95 % du résultat</p>'+
    cadRows+'<p class="foot">95 % des contacts joignables le sont dès la <b>'+x.s95+
    'e tentative</b>. Au-delà, le rendement est quasi nul : c\'est le seuil d\'arrêt à câbler dans la cadence.</p></div>'+
    '<div class="card pad"><h2>Issue réelle des appels</h2><p class="sub">Par durée de conversation effective</p>'+
    '<div class="split">'+donut+'<div class="keys">'+keys+'</div></div></div></div>'+
    '<div class="card pad"><h2>Quand appeler</h2>'+
    '<p class="sub">Taux de conversation par créneau · plus la case est dense, plus le créneau convertit</p>'+
    '<div class="scroll"><div class="heat">'+hm+'</div></div>'+
    '<p class="foot">'+(best.r>=0?'Meilleur créneau : <b>'+best.lb+' '+best.h+'h</b>, '+(best.r*100).toFixed(0)+
    ' % de conversations sur '+best.n+' dials. Les cases vides ont moins de 20 appels — trop peu pour conclure.'
    :'Pas assez de volume par créneau sur cette sélection.')+'</p></div></div>';
}

/* ════ onglet 5 : FIABILITÉ ════ */
function panelTrust(){
  return '<div class="panel" data-p="trust"><details class="audit" open>'+
    '<summary>Ce qui est prouvé</summary><ul>'+
    '<li><b>Les conversations sont réelles.</b> Durées étalées de 1 à 21 min, écart-type élevé, le SDR ne raccroche en premier que dans 50-60 % des cas. Un message vocal scripté donnerait un pic serré et 100 % de raccrochés par le SDR.</li>'+
    '<li><b>Ce ne sont pas des rappels entrants déguisés.</b> Sur 797 numéros, 11 seulement avaient appelé Enky avant le premier appel sortant.</li>'+
    '<li><b>Ce ne sont pas des standards.</b> 93 % des dials partent vers des mobiles ; les fixes ne pèsent que 58 appels. Conversation médiane : 3 min 42.</li>'+
    '<li><b>Aucun appel interne.</b> Zéro numéro appelé ne correspond à une des 5 lignes sortantes Enky.</li>'+
    '<li><b>Les répondeurs sont identifiables.</b> Les appels courts sonnent 18,3 s en médiane contre 9,5 s pour les vraies conversations, et 98 % sont raccrochés par le SDR.</li>'+
    '</ul></details>'+
    '<details class="audit" open style="margin-top:12px">'+
    '<summary>Ce qui ne l\'est pas</summary><ul>'+
    '<li><b>Savoir si l\'interlocuteur était la cible</b> ou un tiers. Non vérifiable avec Ringover seul : il faudrait les transcriptions, ou une issue d\'appel saisie par le SDR.</li>'+
    '<li><b>Le seuil est un choix, pas un fait.</b> À 1 min le taux de contacts joints double, à 5 min il s\'effondre. C\'est pour ça qu\'il est en haut de page. Piloter, c\'est le fixer et s\'y tenir.</li>'+
    '<li><b>Le RDV n\'est pas attribuable à l\'appel</b> en l\'état. Il y a plus de conversions piste → opportunité que de contacts joints : une partie vient d\'un mail ou d\'une saisie manuelle.</li>'+
    '<li><b>Les non identifiés</b> ne sont ni dans Odoo ni dans Clay. Le sync lemlist dira si ce sont des leads de séquence ou de la numérotation manuelle.</li>'+
    '<li><b>Les contacts sont datés à leur premier appel.</b> Les filtres de date découpent donc par cohorte d\'entrée, pas par date d\'appel — seul moyen de ne pas compter un contact deux fois.</li>'+
    '</ul></details>'+
    '<details class="audit" style="margin-top:12px">'+
    '<summary>Sources et fraîcheur</summary><ul>'+
    '<li><b>Ringover</b> — 4 063 appels, du 29 juin au 8 octobre 2026. Sync toutes les 15 min vers Supabase.</li>'+
    '<li><b>Odoo</b> — 556 fiches avec un numéro exploitable. Le rattachement se fait sur les 9 derniers chiffres, insensible au format de stockage.</li>'+
    '<li><b>Clay</b> — 421 numéros sur 4 onglets (LinkedIn FR, LinkedIn UK, SERP FR, SERP UK). Sync hebdomadaire le lundi, remplacement complet.</li>'+
    '<li><b>lemlist</b> — branché, mais ne remonte aucun numéro : les leads de séquence n\'ont pas de téléphone exploitable. Ce n\'est donc pas l\'explication des appels non identifiés.</li>'+
    '</ul></details></div>';
}

/* ════ tooltip ════ */
const TIP=root.querySelector('#tip');
document.addEventListener('mousemove',e=>{
  const el=e.target.closest('[data-tip]');
  if(!el){TIP.classList.remove('on');return;}
  TIP.innerHTML=el.getAttribute('data-tip');
  TIP.classList.add('on');
  const r=TIP.getBoundingClientRect();
  let x=e.clientX,y=e.clientY;
  x=Math.max(r.width/2+8,Math.min(window.innerWidth-r.width/2-8,x));
  TIP.style.left=x+'px';TIP.style.top=Math.max(r.height+14,y)+'px';
});
document.addEventListener('scroll',()=>TIP.classList.remove('on'),{passive:true});


  render();
  return () => { /* nettoyage : rien a demonter */ };
}
