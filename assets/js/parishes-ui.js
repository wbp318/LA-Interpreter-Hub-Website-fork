(()=>{
const P=window.HubParishes;if(!P)return;
const $=s=>document.querySelector(s);
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label={read:['Confirmed','ok'],reported:['Reported','rep'],unknown:['Unknown','unk']};
const body=$('#p-body'),sel=$('#g-parish'),form=$('#g-form'),out=$('#g-out'),status=$('#g-status');

P.names.forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n+' Parish';sel.appendChild(o)});
const rows=P.names.map(n=>{const s=P.get(n),[txt,cls]=label[s.level];const tr=document.createElement('tr');tr.dataset.level=s.level;tr.dataset.name=n.toLowerCase();
 const note=s.src?`${esc(s.note)} <a href="${s.src}">Source</a>`:esc(s.note);
 tr.innerHTML=`<th scope="row">${esc(n)}</th><td><span class="badge ${cls}">${txt}</span></td><td>${note}</td><td><button class="button ghost" type="button" data-p="${esc(n)}">Draft</button></td>`;body.appendChild(tr);return tr});

function filter(){const term=$('#p-search').value.trim().toLowerCase(),lv=$('#p-status').value;let c=0;rows.forEach(r=>{const ok=(lv==='all'||r.dataset.level===lv)&&r.dataset.name.includes(term);r.hidden=!ok;if(ok)c++});$('#p-count').textContent=`${c} of 64 parishes shown.`}
$('#p-search').addEventListener('input',filter);$('#p-status').addEventListener('change',filter);filter();

function opts(){const f=new FormData(form);return{school:f.get('school')||'',grades:f.get('grades')||'',cohort:f.get('cohort')||'',model:f.get('model')||'',teachers:f.get('teachers')||'',variety:f.get('variety'),costTeacher:f.get('costTeacher')||'',costMaterials:f.get('costMaterials')||'',costPD:f.get('costPD')||'',costRecruit:f.get('costRecruit')||'',route:f.getAll('route'),funding:f.getAll('funding'),partners:f.getAll('partners')}}
function make(){out.value=P.build(sel.value,opts());status.textContent=`Draft generated for ${sel.value} Parish. Verify every [TO VERIFY] item before sharing.`}
const save=(name,text)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

$('#g-make').addEventListener('click',make);
$('#g-copy').addEventListener('click',async()=>{if(!out.value)make();try{await navigator.clipboard.writeText(out.value);status.textContent='Copied to clipboard.'}catch(e){out.select();status.textContent='Select the text and copy it manually.'}});
$('#g-dl').addEventListener('click',()=>{if(!out.value)make();save(`french-immersion-proposal-${slug(sel.value)}-parish.md`,out.value)});
$('#dl-all').addEventListener('click',()=>save('french-immersion-proposals-all-64-parishes.md',P.buildAll()));
body.addEventListener('click',e=>{const b=e.target.closest('button[data-p]');if(!b)return;sel.value=b.dataset.p;make();$('#generator').scrollIntoView({behavior:'smooth'});out.focus({preventScroll:true})});
})();
