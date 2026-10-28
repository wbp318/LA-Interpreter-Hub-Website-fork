// Parish data and proposal generator. Status entries hold only what research confirmed; everything else is "unknown".
(()=>{
const names=['Acadia','Allen','Ascension','Assumption','Avoyelles','Beauregard','Bienville','Bossier','Caddo','Calcasieu','Caldwell','Cameron','Catahoula','Claiborne','Concordia','De Soto','East Baton Rouge','East Carroll','East Feliciana','Evangeline','Franklin','Grant','Iberia','Iberville','Jackson','Jefferson','Jefferson Davis','Lafayette','Lafourche','LaSalle','Lincoln','Livingston','Madison','Morehouse','Natchitoches','Orleans','Ouachita','Plaquemines','Pointe Coupee','Rapides','Red River','Richland','Sabine','St. Bernard','St. Charles','St. Helena','St. James','St. John the Baptist','St. Landry','St. Martin','St. Mary','St. Tammany','Tangipahoa','Tensas','Terrebonne','Union','Vermilion','Vernon','Washington','Webster','West Baton Rouge','West Carroll','West Feliciana','Winn'];
const WWNO='https://www.wwno.org/education/2024-10-14/france-renews-agreement-sending-teachers-to-work-in-louisianas-immersion-schools';
const status={
 'Orleans':{level:'read',note:'At least four immersion programs (WWNO, Oct 2024).',src:WWNO},
 'Caddo':{level:'read',note:'Started its own immersion program in recent years (WWNO, Oct 2024).',src:WWNO},
 'Lincoln':{level:'read',note:'Started its own immersion program in recent years (WWNO, Oct 2024).',src:WWNO},
 'Terrebonne':{level:'read',note:'Home of École Pointe-au-Chien, described as the state’s first Indigenous French immersion school. HB 350 (2026) would extend it to grade 8; final outcome not confirmed.',src:WWNO},
 'Lafayette':{level:'reported',note:'French immersion is reported as the district’s largest schools-of-choice option. Pre-K immersion at Myrtle Place Elementary was cut, then reinstated for 2025-26.'},
 'St. Martin':{level:'reported',note:'Cecilia Primary was state-certified as a world language immersion school in 2016 (historical; current status unconfirmed).'},
 'Iberia':{level:'reported',note:'Named in a 2016 state certification release (historical; current status unconfirmed).'},
 'East Baton Rouge':{level:'reported',note:'Immersion teachers were studied in 2014-15; current programs unconfirmed.'}
};
const unknown={level:'unknown',note:'No confirmed French immersion program found in this research. Check CODOFIL’s map and the district.'};
const get=n=>status[n]||unknown;

const defaults={school:'',grades:'K-2',cohort:'',model:'',teachers:'',route:['CODOFIL international associate teachers'],variety:'a blend of standard French and Louisiana French',costTeacher:'',costMaterials:'',costPD:'',costRecruit:'',funding:['District general fund'],partners:['CODOFIL']};
const money=v=>{const n=parseFloat(String(v).replace(/[$,\s]/g,''));return isFinite(n)?n:null};
const fmt=n=>'$'+n.toLocaleString('en-US',{maximumFractionDigits:0});
const tv=(v,label)=>v&&String(v).trim()?String(v).trim():`[TO VERIFY: ${label}]`;

function build(parish,o){
 o=Object.assign({},defaults,o||{});
 const st=get(parish);
 const t=money(o.teachers),ct=money(o.costTeacher),cm=money(o.costMaterials),cp=money(o.costPD),cr=money(o.costRecruit);
 const lines=[
  ['Teacher compensation and benefits',t!=null&&ct!=null?t*ct:null,t!=null&&ct!=null?`${t} teacher(s) x ${fmt(ct)}`:'teachers x cost per teacher'],
  ['Instructional materials in French',cm,''],
  ['Professional development and immersion training',cp,''],
  ['Recruitment, visa and relocation support',cr,'']];
 const known=lines.filter(l=>l[1]!=null);
 const total=known.reduce((s,l)=>s+l[1],0);
 const open=[];
 if(st.level==='unknown')open.push(`Confirm whether ${parish} Parish already has a French immersion program (CODOFIL map, district office).`);
 if(st.level==='reported')open.push(`Verify the reported status for ${parish} Parish with the district.`);
 if(!o.school.trim())open.push('Name the target school(s).');
 if(!String(o.cohort).trim())open.push('Estimate the first-year cohort size and demand (parent survey or interest list).');
 if(!o.model.trim())open.push('Choose the program model (for example the share of the school day taught in French).');
 if(t==null)open.push('Set the number of teachers needed.');
 lines.forEach(l=>{if(l[1]==null)open.push(`Provide a figure for: ${l[0].toLowerCase()}.`)});
 open.push('Confirm current statewide figures and teacher-program terms with CODOFIL.','Confirm current state funding rules with the Louisiana Department of Education and BESE.','Have heritage speakers review any Louisiana French content.');
 const md=`# Proposal: French Immersion in ${parish} Parish

*Draft generated ${new Date().toISOString().slice(0,10)} by the Louisiana Interpreters Hub. Items marked [TO VERIFY] must be confirmed before this is shared.*

## 1. Summary
We propose ${o.school.trim()?'a French immersion program at '+o.school.trim():'a French immersion program at '+tv('','target school(s)')} serving grades ${o.grades}, beginning with ${tv(o.cohort,'first-year cohort size')} students. The program would be staffed through ${o.route.join(', ')||tv('','staffing route')}, with ${o.partners.join(', ')||'community partners'} as partners.

## 2. Why now
- Louisiana’s French immersion enrollment has grown from roughly 400 students in the early 1990s to more than 5,500, according to CODOFIL (undated figure). [TO VERIFY: current count]
- Programs are concentrated in South Louisiana; Caddo and Lincoln parishes show interest elsewhere.
- Teacher supply is the main constraint. Many classroom teachers come from abroad on CODOFIL-sponsored J-1 visas, and France renewed its recruitment agreement in October 2024 for four years.
- Source: Hub research brief, https://wbp318.github.io/LA-Interpreter-Hub-Website-fork/french-immersion.html

## 3. Local context: ${parish} Parish
- Status: ${st.level==='unknown'?'Unknown':st.level==='read'?'Confirmed in a source we read':'Reported, not independently verified'}.
- ${st.note}
- [TO VERIFY: current enrollment, waitlists, and district interest]

## 4. Program design
- Target school(s): ${tv(o.school,'school name')}
- Grades: ${o.grades}
- First-year cohort: ${tv(o.cohort,'cohort size')}
- Model: ${tv(o.model,'program model')}
- Language variety: ${o.variety}. [TO VERIFY: who reviews materials]

## 5. Staffing plan
- Teachers needed: ${tv(o.teachers,'number of teachers')}
- Routes: ${o.route.join('; ')||tv('','routes')}
- International associate teachers apply through their home-country bodies and are placed by CODOFIL on J-1 visas (3 years, extendable by 2). [TO VERIFY: current application cycle]

## 6. Budget
| Item | Amount | Basis |
|---|---|---|
${lines.map(l=>`| ${l[0]} | ${l[1]!=null?fmt(l[1]):'[TO VERIFY]'} | ${l[2]||'provided by applicant'} |`).join('\n')}
| **Known total** | **${known.length?fmt(total):'[TO VERIFY]'}** | ${known.length<lines.length?'incomplete: some lines missing':'all lines provided'} |

Funding sources under consideration: ${o.funding.join('; ')||tv('','funding sources')}.

## 7. Timeline
\`\`\`mermaid
timeline
    title ${parish} Parish immersion launch
    Planning : Confirm demand and school : Secure board support
    Hiring : Apply for teachers : Plan visas and relocation
    Prepare : Training and materials : Family information sessions
    Launch : First cohort begins
    Review : Measure results and decide on growth
\`\`\`

## 8. Evaluation
- Enrollment, retention and waitlist length each year.
- Student proficiency in French, using a recognized assessment. [TO VERIFY: choose assessment]
- Family satisfaction and teacher retention.

## 9. Risks and mitigation
- **Teacher supply or visa delays:** apply early; line up a domestic certification route as a backup.
- **Budget cuts:** seek a multi-year commitment (Lafayette Parish’s pre-K cut and reversal shows the risk).
- **Language-variety disagreement:** decide early and document it.

## 10. Open items before submission
${open.map(x=>'- [ ] '+x).join('\n')}

---
*Prepared with AI assistance as a starting point. Not legal or policy advice.*
`;
 return md;
}
function buildAll(){
 const toc=names.map(n=>`- ${n} Parish`).join('\n');
 return `# French Immersion Proposals: All 64 Louisiana Parishes\n\nEach section is a draft with [TO VERIFY] markers. Local figures are blank until supplied.\n\n${toc}\n\n---\n\n`+names.map(n=>build(n)).join('\n\n---\n\n');
}
window.HubParishes={names,status,get,build,buildAll,defaults};
})();
