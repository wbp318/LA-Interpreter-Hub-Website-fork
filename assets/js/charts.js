import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';
const light={primaryColor:'#e0e8ee',primaryTextColor:'#18304a',primaryBorderColor:'#244e6a',lineColor:'#56677a',secondaryColor:'#efe6d1',tertiaryColor:'#dcebe5',actorBkg:'#e0e8ee',actorBorder:'#244e6a',signalColor:'#18304a',textColor:'#18304a',noteBkgColor:'#efe6d1',noteTextColor:'#18304a',edgeLabelBackground:'#f7f8f9',cScale0:'#edf2f6',cScale1:'#f7f1e5',cScale2:'#edf4f1',cScale3:'#eef0f8',cScaleLabel0:'#142f48',cScaleLabel1:'#142f48',cScaleLabel2:'#142f48',cScaleLabel3:'#142f48'};
const dark={primaryColor:'#22364a',primaryTextColor:'#e3e9ef',primaryBorderColor:'#6fa3c7',lineColor:'#9aabbb',secondaryColor:'#3a321f',tertiaryColor:'#1c3a34',actorBkg:'#22364a',actorBorder:'#6fa3c7',signalColor:'#e3e9ef',textColor:'#e3e9ef',noteBkgColor:'#3a321f',noteTextColor:'#e3e9ef',edgeLabelBackground:'#16202b',mainBkg:'#22364a',clusterBkg:'#1a2531',titleColor:'#e3e9ef',cScale0:'#22364a',cScale1:'#3a321f',cScale2:'#1c3a34',cScale3:'#2a2c4a',cScaleLabel0:'#e3e9ef',cScaleLabel1:'#e3e9ef',cScaleLabel2:'#e3e9ef',cScaleLabel3:'#e3e9ef',xyChart:{backgroundColor:'#16202b',titleColor:'#e3e9ef',xAxisLabelColor:'#e3e9ef',xAxisTitleColor:'#e3e9ef',xAxisTickColor:'#9aabbb',xAxisLineColor:'#9aabbb',yAxisLabelColor:'#e3e9ef',yAxisTitleColor:'#e3e9ef',yAxisTickColor:'#9aabbb',yAxisLineColor:'#9aabbb',plotColorPalette:'#6fa3c7'}};
const scale=(cols,txt)=>Object.fromEntries(cols.flatMap((c,i)=>[['cScale'+i,c],['cScaleLabel'+i,txt]]));
Object.assign(light,scale(['#e0e8ee','#efe6d1','#dcebe5','#e2e4f1','#d6e3ee','#ecdfc6','#d3e6de','#dcdaee','#e0e8ee','#efe6d1','#dcebe5','#e2e4f1'],'#18304a'));
Object.assign(dark,scale(['#22364a','#3a321f','#1c3a34','#2a2c4a','#1e3550','#3a2630','#23403f','#2f2b45','#22364a','#3a321f','#1c3a34','#2a2c4a'],'#e3e9ef'));
const isDark=()=>(document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))==='dark';
const nodes=[...document.querySelectorAll('.mermaid')];
nodes.forEach(n=>{n.dataset.src=n.textContent});
async function render(){
  mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',themeVariables:Object.assign({fontFamily:'Arial, Helvetica, sans-serif'},isDark()?dark:light)});
  nodes.forEach(n=>{n.removeAttribute('data-processed');n.textContent=n.dataset.src});
  try{await mermaid.run({nodes})}catch(e){nodes.forEach(n=>{if(!n.querySelector('svg'))n.textContent='The chart could not be displayed. See the text version below.'})}
}
await render();
document.addEventListener('hubthemechange',render);
