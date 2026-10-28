// Hub Assistant: a self-contained, rule-based helper. No data leaves the browser.
(()=>{
const D=window.HUB_DATA||{glossary:[]};
const base=document.currentScript&&document.currentScript.src?new URL('../../',document.currentScript.src).href:'';
const u=p=>base+p;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const topics=[
{k:['immersion','cajun','louisiana french','codofil','french school','bilingual school'],a:'The French immersion brief summarizes Louisiana’s public-school immersion programs: scale, teacher pipeline, funding, language variety, and expansion levers.',l:['french-immersion.html','Open the French immersion brief']},
{k:['parish proposal','proposal','64 parishes','my parish','draft a proposal'],a:'The Parish proposals toolkit drafts a French immersion proposal for any of Louisiana’s 64 parishes and marks every unverified item.',l:['parishes.html','Open Parish proposals']},
{k:['ethic','confiden','impartial','boundary','conflict','code of','decision'],a:'The Ethics & standards page covers confidentiality, accuracy, impartiality and role boundaries, with a decision flowchart for tricky moments.',l:['ethics.html','Open Ethics & standards']},
{k:['prepare','preparation','checklist','assignment','before','debrief','workflow','lifecycle'],a:'The Assignment guide has a lifecycle chart, a turn-taking diagram, and a printable pre-assignment checklist.',l:['workflow.html','Open Assignment guide']},
{k:['glossary','terminology','term','vocabulary','csv','download'],a:'The Quick glossary has English, Spanish and Vietnamese terms by setting. You can download it as a CSV there too. Try asking me: “translate allergy”, or “translate good morning to Spanish”.',l:['index.html#glossary','Go to glossary']},
{k:['library','study','learn','practice','training','skill','note-taking','sight'],a:'The Study library groups topics into terminology, ethics, and skills & training, with search and a category filter.',l:['index.html#library','Go to study library']},
{k:['community','discussion','forum','post','account','join'],a:'The community board is a preview with fictional threads. Accounts and posting are not enabled yet.',l:['index.html#community','See the community preview']},
{k:['event','workshop','news','study group','ce ','continuing'],a:'News & events shows the planned layout only. Nothing is scheduled or published yet.',l:['index.html#events','See News & events']},
{k:['contact','email','message','feedback','suggest','reach'],a:'Use the contact form on the home page. It is not connected to an inbox yet, so messages are not delivered for now.',l:['index.html#contact','Go to contact form']},
{k:['about','who','what is','mission'],a:'Louisiana Interpreters Hub is an educational resource center so interpreters can find knowledge and connect. It is under development.',l:['index.html#about','About the hub']},
{k:['certif','license','credential','exam'],a:'The hub does not yet publish certification guidance. Please check your credentialing body for current requirements. Peer study groups are on the roadmap.'}
];

const LANGS={english:'en',spanish:'es',vietnamese:'vi',french:'fr'};
let tNotice=false;
function parseTranslate(q){
 let m=q.match(/^translate\s+(.+?)\s+(?:to|into)\s+(english|spanish|vietnamese|french)$/i);
 if(m)return{text:m[1].replace(/^["“]|["”]$/g,''),from:'en',to:LANGS[m[2].toLowerCase()]};
 m=q.match(/^translate\s+(.+?)\s+from\s+(spanish|vietnamese|french)$/i);
 if(m)return{text:m[1].replace(/^["“]|["”]$/g,''),from:LANGS[m[2].toLowerCase()],to:'en'};
 return null}
const chips=['translate good morning to Spanish','Enable offline translator','Translate a term','Pre-assignment checklist','Ethics decision chart','What can I do here?'];
const hello='Hi! I’m the Hub Assistant. I can look up glossary terms, point you to a section, or explain what’s available. I’m a simple built-in helper, not a live AI, and I can’t give legal, medical or certification advice.';

const root=document.createElement('div');root.className='asst';
root.innerHTML=`<button class="asst-fab" type="button" aria-expanded="false" aria-controls="asst-panel"><span aria-hidden="true">💬</span> Assistant</button>
<section class="asst-panel" id="asst-panel" role="dialog" aria-label="Hub Assistant" hidden>
<header class="asst-head"><strong>Hub Assistant</strong><button type="button" class="asst-x" aria-label="Close assistant">×</button></header>
<div class="asst-log" role="log" aria-live="polite"></div>
<div class="asst-chips"></div>
<form class="asst-form"><input type="text" aria-label="Ask the assistant" placeholder="Ask or type a term…" autocomplete="off"><button class="button" type="submit">Send</button></form></section>`;
document.body.appendChild(root);
const fab=root.querySelector('.asst-fab'),panel=root.querySelector('.asst-panel'),log=root.querySelector('.asst-log'),form=root.querySelector('form'),input=form.querySelector('input'),chipBox=root.querySelector('.asst-chips');

function say(html,who){const m=document.createElement('div');m.className='asst-msg '+who;m.innerHTML=html;log.appendChild(m);log.scrollTop=log.scrollHeight}
const link=l=>l?` <a href="${u(l[0])}">${esc(l[1])} →</a>`:'';
chips.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.addEventListener('click',()=>ask(c));chipBox.appendChild(b)});

function findTerms(q){const t=q.toLowerCase();return D.glossary.filter(g=>[g.en,g.es,g.vi,g.fr].some(x=>x&&(t.includes(x.toLowerCase())||(t.length>=3&&x.toLowerCase().includes(t)))))}
function ask(raw){
const q=raw.trim();if(!q)return;say(esc(q),'me');
const stripped=q.replace(/^(translate|what is|what's|define|meaning of|how do you say)\s+/i,'').replace(/[?.!]+$/,'').trim();
const lc=q.toLowerCase();
if(/^(hi|hello|hey)\b/.test(lc)){say('Hello! What would you like to find?','bot');return}
if(/translate a term|look ?up/.test(lc)&&stripped.length<18&&/term/.test(lc)){say('Type an English, Spanish or Vietnamese word, like “allergy” or “fianza”, and I’ll look it up.','bot');return}
if(/what can i do|help|what.*(here|offer)/.test(lc)){say('Here you can: <br>• study topics in the library<br>• look up and download glossary terms<br>• walk through an ethics decision chart<br>• print a pre-assignment checklist<br>Ask about any of these.'+link(['index.html#library','Browse the library']),'bot');return}
const hits=findTerms(stripped);
if(hits.length&&stripped.split(/\s+/).length<=6){
const list=hits.slice(0,5).map(g=>`<strong>${esc(g.en)}</strong> (${esc(g.domain)})<br>ES: ${esc(g.es||'—')} · VI: ${esc(g.vi||'—')} · FR: ${esc(g.fr||'—')}`).join('<br><br>');
say(list+'<br><br><small>Study aid only. Confirm with certified references and context.</small>'+link(['index.html#glossary','Open glossary']),'bot');return}
if(/^(enable|turn on|use).*offline/.test(lc)){HubTranslator.setOptIn(true);say('Offline translator is <strong>on</strong>. The first translation for each language pair downloads about 75 MB (then it is cached), and after that the text stays in your browser. Say “disable offline translator” to turn it off.','bot');return}
if(/^(disable|turn off|stop).*offline/.test(lc)){HubTranslator.setOptIn(false);say('Offline translator is <strong>off</strong>. Already-downloaded models stay in your browser cache.','bot');return}
const tr=parseTranslate(q.replace(/[.!?]+$/,''));
if(tr){
 if(tr.text.length>200){say('Please keep translations under 200 characters.','bot');return}
 if(tr.from===tr.to){say('Pick two different languages.','bot');return}
 const wait=document.createElement('div');wait.className='asst-msg bot';wait.textContent='Translating…';log.appendChild(wait);log.scrollTop=log.scrollHeight;
 const status=m=>{wait.textContent=m;log.scrollTop=log.scrollHeight};
 HubTranslator.translate(tr.text,tr.from,tr.to,status).then(r=>{
  const hint=(r.engine==='mymemory'&&!HubTranslator.isOptedIn()&&HubTranslator.supportsOpus(tr.from,tr.to))?' <br><small>Tip: say “enable offline translator” to keep text on your device next time.</small>':'';
  wait.innerHTML='<strong>'+esc(r.text)+'</strong><br><small>Via '+esc(r.label)+(r.sent?' — your text was sent to it':'')+'. Machine translation is a quick aid, not a certified translation. Never enter confidential client information.</small>'+hint;
 }).catch(()=>{wait.textContent='Sorry, translation is unavailable right now. Try the glossary instead.'});
 return}
let best=null,score=0;topics.forEach(tp=>{const s=tp.k.filter(k=>lc.includes(k)).length;if(s>score){score=s;best=tp}});
if(best){say(esc(best.a)+link(best.l),'bot');return}
say('I couldn’t find that. Try a glossary word, or ask about the library, ethics, the assignment guide, events or contact.'+link(['index.html#contact','Send us a suggestion']),'bot')}

function setOpen(open){panel.hidden=!open;fab.setAttribute('aria-expanded',String(open));if(open){if(!log.children.length)say(esc(hello),'bot');input.focus()}else fab.focus()}
fab.addEventListener('click',()=>setOpen(panel.hidden));
root.querySelector('.asst-x').addEventListener('click',()=>setOpen(false));
root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)setOpen(false)});
form.addEventListener('submit',e=>{e.preventDefault();const v=input.value;input.value='';ask(v)});
})();
