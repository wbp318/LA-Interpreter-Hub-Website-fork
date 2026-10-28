const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Mobile menu
const menu=$('.menu'),nav=$('nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}))}
const yr=$('#year');if(yr)yr.textContent=new Date().getFullYear();

// Study library filter
const search=$('#search'),category=$('#category');
if(search&&category){const cards=$$('.card');const filter=()=>{const term=search.value.trim().toLowerCase();let count=0;cards.forEach(card=>{const ok=(category.value==='all'||card.dataset.category===category.value)&&card.textContent.toLowerCase().includes(term);card.hidden=!ok;if(ok)count++});$('#empty').hidden=count>0;$('#resource-status').textContent=`${count} ${count===1?'category':'categories'} · Starter catalog — study topics are illustrative; downloadable materials are not yet available.`};search.addEventListener('input',filter);category.addEventListener('change',filter)}

// Glossary (rendered from data.js)
const gBody=$('#gloss-body');
if(gBody&&window.HUB_DATA){
const rows=HUB_DATA.glossary.map(g=>{const r=document.createElement('div');r.className='gloss-row';r.setAttribute('role','row');r.dataset.domain=g.domain;r.innerHTML=`<span class="en" role="cell">${esc(g.en)}</span><span role="cell">${esc(g.es||'—')}</span><span role="cell">${esc(g.vi||'—')}</span><span role="cell">${esc(g.fr||'—')}</span><span class="dom" role="cell">${esc(g.domain)}</span>`;gBody.appendChild(r);return r});
const gSearch=$('#gloss-search'),gDomain=$('#gloss-domain');
const glossFilter=()=>{const term=gSearch.value.trim().toLowerCase();let count=0;rows.forEach(r=>{const ok=(gDomain.value==='all'||r.dataset.domain===gDomain.value)&&r.textContent.toLowerCase().includes(term);r.hidden=!ok;if(ok)count++});$('#gloss-empty').hidden=count>0};
gSearch.addEventListener('input',glossFilter);gDomain.addEventListener('change',glossFilter);
const dl=$('#gloss-download');
if(dl)dl.addEventListener('click',()=>{const q=v=>`"${String(v).replace(/"/g,'""')}"`;const csv='﻿English,Spanish,Vietnamese,French,Setting\r\n'+HUB_DATA.glossary.map(g=>[g.en,g.es,g.vi,g.fr,g.domain].map(q).join(',')).join('\r\n')+'\r\n';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='louisiana-interpreters-hub-glossary.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
}

// Contact form (opens the visitor's mail app once contactEmail is set in data.js)
const form=$('#contact-form');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const st=$('#contact-status');const to=window.HUB_DATA&&HUB_DATA.contactEmail;if(!to){st.textContent='The contact form is not connected yet, so nothing was sent. Please check back soon.';return}const f=new FormData(form);const body=`${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;location.href=`mailto:${to}?subject=${encodeURIComponent('[Hub] '+f.get('topic'))}&body=${encodeURIComponent(body)}`;st.textContent='Opening your email app…'});

// Checklist with remembered state + print
$$('.checklist input[type=checkbox]').forEach((cb,i)=>{const k='hub-check-'+i;try{cb.checked=localStorage.getItem(k)==='1'}catch(e){}cb.addEventListener('change',()=>{try{localStorage.setItem(k,cb.checked?'1':'0')}catch(e){}})});
const pr=$('#print-btn');if(pr)pr.addEventListener('click',()=>window.print());
const rs=$('#reset-btn');if(rs)rs.addEventListener('click',()=>$$('.checklist input').forEach(cb=>{cb.checked=false;cb.dispatchEvent(new Event('change'))}));

// Theme toggle: follows the system until the visitor picks one (remembered in this browser)
(()=>{const nav=document.querySelector('nav');if(!nav)return;const mq=matchMedia('(prefers-color-scheme: dark)');
const eff=()=>document.documentElement.dataset.theme||(mq.matches?'dark':'light');
const b=document.createElement('button');b.type='button';b.className='theme-toggle';
const paint=()=>{const d=eff()==='dark';b.textContent=d?'☀ Light':'☾ Dark';b.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode')};
b.addEventListener('click',()=>{const n=eff()==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('hub-theme',n)}catch(e){}paint();document.dispatchEvent(new Event('hubthemechange'))});
mq.addEventListener('change',()=>{paint();document.dispatchEvent(new Event('hubthemechange'))});
paint();nav.appendChild(b)})();
