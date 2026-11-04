import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../public/art/retro-ragdoll/sketch.js',import.meta.url),'utf8');
function fixture({initialize=async()=>{},send=async()=>{},getUserMedia}={}){
  const events={},listeners={},elements={};
  const ctx=new Proxy({},{get:()=>()=>{}});
  for(const id of ['start','toggle-preview','reset','status','preview','hand-overlay','camera-wrap'])elements[id]={textContent:'',disabled:false,hidden:false,getContext:()=>ctx,play:async()=>{},pause(){},videoWidth:640,videoHeight:480,readyState:2};
  const canvas={dataset:{},setAttribute(){},addEventListener:(type,fn)=>listeners[type]=fn,getBoundingClientRect:()=>({left:100,top:200,right:500,bottom:550})};
  const stream={stopped:false,getTracks(){return [{stop:()=>stream.stopped=true}];}};
  let options,locateFile,sends=0,initialized=false;
  class Hands{
    constructor(o){locateFile=o.locateFile;}
    setOptions(o){options=o;}onResults(fn){this.results=fn;}
    async initialize(){await initialize();initialized=true;}
    async send(o){assert.ok(initialized);sends++;await send(o);}
    async close(){}
  }
  const sandbox={URL,console:{error(){},warn(){}},setTimeout,clearTimeout,performance:{now:()=>2000},Hands,
    document:{baseURI:'https://example.org/QuellaLivingStudio/art/retro-ragdoll/index.html',getElementById:id=>elements[id],addEventListener:(t,f)=>events[t]=f},
    window:{addEventListener:(t,f)=>events[t]=f},navigator:{mediaDevices:{getUserMedia:getUserMedia??(async()=>stream)}},
    createCanvas:()=>({elt:canvas,parent(){}}),WEBGL:'webgl',pixelDensity(){},frameRate(){},
    createGraphics:()=>({pixelDensity(){},noSmooth(){}}),requestAnimationFrame:()=>{},
    constrain:(v,a,b)=>Math.max(a,Math.min(b,v)),
  };
  const run=s=>vm.runInContext(s,context);
  const context=vm.createContext(sandbox);run(source);
  // Keep these interaction tests independent of the physics/rendering workload.
  run('resetModel=()=>{};initFlow=()=>{};initWarpStreams=()=>{};setup();');
  return {run,elements,canvas,listeners,events,stream,stats:()=>({options,locateFile,sends})};
}
test('only a left click inside the scaled artwork canvas changes mode; Space does not',()=>{
  const f=fixture(),click=(x,y,button=0,target=f.canvas)=>f.listeners.click({clientX:x,clientY:y,button,target});
  click(150,250);assert.equal(f.canvas.dataset.mode,'meteor');
  for(const point of [[99,250],[500,250],[150,199],[150,550]])click(...point);
  click(150,250,2);click(150,250,0,{});
  f.run("key=' ';keyPressed()");assert.equal(f.canvas.dataset.mode,'meteor');
  click(150,250);assert.equal(f.canvas.dataset.mode,'flock');
});
test('initializes tracker before inference and loads all resources from the project URL',async()=>{
  const f=fixture();await f.run('toggleTracking()');await new Promise(setImmediate);
  assert.equal(f.run('tracking'),true);assert.equal(f.elements.start.textContent,'STOP');assert.equal(f.stats().sends,1);
  assert.equal(f.stats().locateFile('hands.binarypb'),'https://example.org/QuellaLivingStudio/vendor/mediapipe/hands/hands.binarypb');
  f.run('stopTracking()');assert.ok(f.stream.stopped);assert.equal(f.elements.preview.srcObject,null);
});
test('model loading failures stop camera, remain visible and permit retry',async()=>{
  const f=fixture({initialize:async()=>{throw Error('model unavailable');}});await f.run('toggleTracking()');
  assert.equal(f.run('tracking'),false);assert.ok(f.stream.stopped);assert.match(f.elements.status.textContent,/model unavailable/);
  assert.equal(f.elements.start.disabled,false);assert.equal(f.run('handsModel'),null);
});
test('inference failures stop tracking rather than looping silently',async()=>{
  const f=fixture({send:async()=>{throw Error('inference failed');}});await f.run('toggleTracking()');await new Promise(setImmediate);
  assert.equal(f.run('tracking'),false);assert.ok(f.stream.stopped);assert.match(f.elements.status.textContent,/inference failed/);
});
test('camera rejection gives a persistent permission message',async()=>{
  const f=fixture({getUserMedia:async()=>{throw Object.assign(Error('denied'),{name:'NotAllowedError'});}});await f.run('toggleTracking()');
  assert.match(f.elements.status.textContent,/CAMERA BLOCKED/);assert.equal(f.elements.start.disabled,false);
});
test('leaving while camera permission is pending releases a late stream',async()=>{
  let resolve;const pending=new Promise(r=>resolve=r),f=fixture({getUserMedia:()=>pending});
  const start=f.run('toggleTracking()');f.events.pagehide();resolve(f.stream);await start;
  assert.ok(f.stream.stopped);assert.equal(f.run('tracking'),false);assert.equal(f.stats().sends,0);
});
test('runtime, models and both WASM variants ship with the build source',()=>{
  const root=new URL('../public/vendor/mediapipe/hands/',import.meta.url);
  for(const file of ['hands.js','hands.binarypb','hand_landmark_full.tflite','hand_landmark_lite.tflite','hands_solution_packed_assets_loader.js','hands_solution_packed_assets.data','hands_solution_wasm_bin.js','hands_solution_wasm_bin.wasm','hands_solution_simd_wasm_bin.js','hands_solution_simd_wasm_bin.wasm'])assert.ok(fs.statSync(new URL(file,root)).size>0,file);
});
