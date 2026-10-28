// Client-side translation router. Tries engines in order and reports which one answered:
//   1. Chrome's on-device Translator (already installed language packs only; nothing is downloaded or sent)
//   2. OPUS-MT in the browser via Transformers.js (opt-in; ~75 MB download per language pair, then cached)
//   3. MyMemory free web API (the text is sent to a third party)
(()=>{
const OPUS_URL='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.2/+esm';
const OPUS_PAIRS=new Set(['en-es','es-en','en-fr','fr-en','en-vi','vi-en']);
const KEY='hub-opus-optin';
const pipes=new Map();
const queues=new Map();
let lib=null;

const store={
 get(){try{return localStorage.getItem(KEY)==='1'}catch(e){return false}},
 set(v){try{localStorage.setItem(KEY,v?'1':'0')}catch(e){}}
};
let optIn=store.get();

async function viaChrome(text,from,to){
 if(!('Translator' in self))throw new Error('unsupported');
 const opts={sourceLanguage:from,targetLanguage:to};
 if(await Translator.availability(opts)!=='available')throw new Error('language pack not installed');
 const t=await Translator.create(opts);
 return {text:await t.translate(text),engine:'chrome',label:'your browser’s on-device translator',sent:false};
}

async function viaOpus(text,from,to,status){
 const pair=from+'-'+to;
 if(!optIn)throw new Error('not enabled');
 if(!OPUS_PAIRS.has(pair))throw new Error('pair unsupported');
 if(!pipes.has(pair)){
  pipes.set(pair,(async()=>{
   status('Loading the offline translator (first use downloads about 75 MB for this language pair)…');
   lib=lib||await import(OPUS_URL);
   lib.env.allowLocalModels=false;
   let last=-1;
   return lib.pipeline('translation','Xenova/opus-mt-'+pair,{progress_callback:p=>{
    if(p.status==='progress'&&p.progress!=null){const pct=Math.floor(p.progress/10)*10;if(pct!==last){last=pct;status('Downloading offline model… '+Math.floor(p.progress)+'%')}}
   }});
  })().catch(e=>{pipes.delete(pair);throw e}));
 }
 const pipe=await pipes.get(pair);
 status('Translating offline…');
 // ONNX sessions can't run two inferences at once, so queue calls per model.
 const run=(queues.get(pair)||Promise.resolve()).then(()=>pipe(text,{max_new_tokens:200}));
 queues.set(pair,run.catch(()=>{}));
 const out=await run;
 const t=out&&out[0]&&out[0].translation_text;
 if(!t)throw new Error('empty result');
 return {text:t,engine:'opus-mt',label:'OPUS-MT, running in your browser (nothing sent)',sent:false};
}

async function viaMyMemory(text,from,to){
 const r=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair='+from+'|'+to);
 if(!r.ok)throw new Error('http '+r.status);
 const j=await r.json();
 const t=j&&j.responseData&&j.responseData.translatedText;
 if(!t||j.responseStatus!=200)throw new Error('no result');
 return {text:t,engine:'mymemory',label:'the MyMemory free web service',sent:true};
}

async function translate(text,from,to,onStatus){
 const status=m=>{if(onStatus)onStatus(m)};
 const steps=[['Trying your browser’s translator…',viaChrome],['Trying the offline translator…',viaOpus],['Trying the MyMemory web service…',viaMyMemory]];
 const skipped=[];
 for(const [msg,fn] of steps){
  if(fn===viaOpus&&!optIn){skipped.push('offline translator is off');continue}
  status(msg);
  try{const r=await fn(text,from,to,status);r.skipped=skipped;return r}
  catch(e){skipped.push(fn.name.replace('via','')+': '+(e&&e.message||'failed'))}
 }
 const err=new Error('all engines failed');err.skipped=skipped;throw err;
}

window.HubTranslator={
 translate,
 isOptedIn:()=>optIn,
 setOptIn:v=>{optIn=!!v;store.set(optIn)},
 supportsOpus:(from,to)=>OPUS_PAIRS.has(from+'-'+to)
};
})();
