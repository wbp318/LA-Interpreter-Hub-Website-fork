// Dependency-free site checks: JS syntax, local references, duplicate ids, glossary data.
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
const errors=[];
const files=readdirSync('.');
const jsFiles=readdirSync('assets/js').map(f=>'assets/js/'+f);
for(const f of jsFiles){
  try{execFileSync(process.execPath,['--check',f],{stdio:'pipe'})}catch(e){errors.push(`${f}: syntax error\n${e.stderr}`)}
}
for(const f of files.filter(f=>f.endsWith('.html'))){
  const html=readFileSync(f,'utf8');
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
  ids.filter((id,i)=>ids.indexOf(id)!==i).forEach(id=>errors.push(`${f}: duplicate id "${id}"`));
  for(const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:#([^"]*))?"/g)){
    const [,path,frag]=m;
    if(/^(https?:|mailto:|data:)/.test(path))continue;
    const p=decodeURIComponent(path);
    if(!existsSync(p))errors.push(`${f}: missing file "${p}"`);
    else if(frag&&p.endsWith('.html')&&!readFileSync(p,'utf8').includes(` id="${frag}"`))errors.push(`${f}: missing anchor "${p}#${frag}"`);
  }
  for(const m of html.matchAll(/href="#([^"]+)"/g))if(m[1]&&!ids.includes(m[1]))errors.push(`${f}: missing in-page anchor "#${m[1]}"`);
}
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(readFileSync('assets/js/data.js','utf8'),ctx);
const g=ctx.window.HUB_DATA?.glossary;
if(!Array.isArray(g)||!g.length)errors.push('assets/js/data.js: glossary missing');
else g.forEach((t,i)=>{if(!t.en||!t.domain||!(t.es||t.vi||t.fr))errors.push(`assets/js/data.js: glossary[${i}] needs en, domain, and a translation`)});
const pc={window:{},Date,Intl};vm.createContext(pc);vm.runInContext(readFileSync('assets/js/parishes.js','utf8'),pc);
const HP=pc.window.HubParishes;
if(!HP||HP.names.length!==64||new Set(HP.names).size!==64)errors.push('parishes.js: expected 64 unique parishes');
else{Object.keys(HP.status).forEach(n=>{if(!HP.names.includes(n))errors.push(`parishes.js: status for unknown parish "${n}"`)});
 HP.names.forEach(n=>{const md=HP.build(n);if(!md.includes(n)||!md.includes('[TO VERIFY'))errors.push(`parishes.js: bad draft for ${n}`)});
 if(HP.buildAll().split('# Proposal: French Immersion in').length!==65)errors.push('parishes.js: buildAll should hold 64 proposals')}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`OK: ${files.filter(f=>f.endsWith('.html')).length} pages, ${g.length} glossary terms`);
