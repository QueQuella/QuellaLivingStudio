import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../public/art/retro-ragdoll/',import.meta.url);
const source=fs.readFileSync(new URL('sketch.js',root),'utf8');
const controllerSource=fs.readFileSync(new URL('hand-tracker.js',root),'utf8');
function camera({getStream,makeDetector}={}){
  const states=[],statuses=[],results=[],frames=new Map();let frameId=0;
  const stream={stopped:false,getTracks(){return [{stop:()=>stream.stopped=true,addEventListener(){}}];}};
  const video={play:async()=>{},pause(){},readyState:2,videoWidth:640,currentTime:1};
  const detector={closed:false,detectForVideo:()=>({landmarks:[Array(21).fill({x:.5,y:.5,z:0})]}),close(){this.closed=true;}};
  const sandbox={URL,console:{error(){}},document:{currentScript:{src:'https://example.org/QuellaLivingStudio/art/retro-ragdoll/hand-tracker.js'}},window:{},navigator:{mediaDevices:{getUserMedia(){}}},setTimeout,clearTimeout,requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id)};
  vm.runInNewContext(controllerSource,sandbox);
  const c=new sandbox.window.RetroCameraController({video,onState:s=>states.push(s),onStatus:s=>statuses.push(s),onResults:r=>results.push(r),getStream:getStream??(async()=>stream),makeDetector:makeDetector??(async()=>detector)});
  return {c,video,stream,detector,states,statuses,results,frames,tick(now){const f=[...frames.entries()].at(-1);frames.delete(f[0]);return f[1](now);}};
}
test('START immediately becomes cancellable STOP; STOP closes camera, detector and frame loop',async()=>{
  const f=camera();const start=f.c.toggle();assert.equal(f.c.state,'starting');
  await start;assert.equal(f.c.state,'running');await f.tick(100);assert.equal(f.results[0].landmarks[0].length,21);
  f.c.toggle();await new Promise(setImmediate);assert.equal(f.c.state,'stopped');assert.ok(f.stream.stopped);assert.ok(f.detector.closed);assert.equal(f.video.srcObject,null);assert.equal(f.frames.size,0);
});
test('STOP cancels a pending permission request and releases a late camera stream',async()=>{
  let resolve;const pending=new Promise(r=>resolve=r),f=camera({getStream:()=>pending});
  const start=f.c.start();f.c.stop();resolve(f.stream);await start;assert.ok(f.stream.stopped);assert.equal(f.c.state,'stopped');
});
test('STOP closes a camera immediately during model loading; a late detector cannot restart it',async()=>{
  let resolve;const pending=new Promise(r=>resolve=r),f=camera({makeDetector:()=>pending});
  const start=f.c.start();await new Promise(setImmediate);f.c.stop();assert.ok(f.stream.stopped);
  resolve(f.detector);await start;assert.ok(f.detector.closed);assert.equal(f.c.state,'stopped');assert.equal(f.frames.size,0);
});
test('camera denial returns to START and retains an actionable error',async()=>{
  const f=camera({getStream:async()=>{throw Object.assign(Error(),{name:'NotAllowedError'});}});await f.c.start();assert.equal(f.c.state,'stopped');assert.match(f.statuses.at(-1),/Allow camera access/);
});
test('model loading failure releases camera and supports a second START',async()=>{
  let attempts=0;const f=camera({makeDetector:async()=>{if(++attempts===1)throw Error('model unavailable');return f.detector;}});
  await f.c.start();assert.ok(f.stream.stopped);assert.match(f.statuses.at(-1),/model unavailable/);await f.c.start();assert.equal(f.c.state,'running');f.c.stop();
});
test('only new video frames are inferred, at most 20 times per second',async()=>{
  const f=camera();await f.c.start();await f.tick(100);await f.tick(160);assert.equal(f.results.length,1);
  f.video.currentTime=2;await f.tick(170);assert.equal(f.results.length,2);f.video.currentTime=3;await f.tick(190);assert.equal(f.results.length,2);f.c.stop();
});
test('inference errors release camera and remain visible',async()=>{
  const f=camera();f.detector.detectForVideo=()=>{throw Error('inference failure');};await f.c.start();await f.tick(100);assert.ok(f.stream.stopped);assert.equal(f.c.state,'stopped');assert.match(f.statuses.at(-1),/inference failure/);
});
function artwork({webgl=true}={}){
  const events={},listeners={},elements={};const ctx=new Proxy({},{get:()=>()=>{}});let options;
  for(const id of ['start','toggle-preview','reset','status','preview','hand-overlay','camera-wrap','stage'])elements[id]={textContent:'',disabled:false,getContext:()=>ctx,setAttribute(){}};
  const canvas={dataset:{},setAttribute(){},addEventListener:(t,f)=>listeners[t]=f,getBoundingClientRect:()=>({left:100,top:200,right:500,bottom:550})};
  class Controller{constructor(o){options=o;}toggle(){options.onState('starting');}stop(){options.onState('stopped');}}
  const sandbox={URL,performance:{now:()=>2000},RetroCameraController:Controller,document:{getElementById:id=>elements[id],addEventListener:(t,f)=>events[t]=f},window:{addEventListener:(t,f)=>events[t]=f},createCanvas:()=>{if(!webgl)throw Error('No WebGL');return {elt:canvas,parent(){}};},WEBGL:'webgl',noLoop(){},pixelDensity(){},frameRate(){},createGraphics:()=>({pixelDensity(){},noSmooth(){}})};
  const context=vm.createContext(sandbox),run=s=>vm.runInContext(s,context);run(source);run('resetModel=()=>{};initFlow=()=>{};initWarpStreams=()=>{};setup();');
  return {run,canvas,listeners,elements,events,options};
}
test('only left clicks inside scaled main canvas switch mode; Space, outside and preview clicks do not',()=>{
  const f=artwork(),click=(x,y,button=0,target=f.canvas)=>f.listeners.click({clientX:x,clientY:y,button,target});
  click(150,250);assert.equal(f.canvas.dataset.mode,'meteor');
  for(const p of [[99,250],[500,250],[150,199],[150,550]])click(...p);
  click(150,250,2);click(150,250,0,f.elements['hand-overlay']);f.run("key=' ';keyPressed()");assert.equal(f.canvas.dataset.mode,'meteor');click(150,250);assert.equal(f.canvas.dataset.mode,'flock');
});
test('camera button binds before WebGL initialization and toggles START / STOP even without WebGL',()=>{
  const f=artwork({webgl:false});f.elements.start.onclick();assert.equal(f.elements.start.textContent,'STOP');assert.equal(f.elements.start.disabled,false);f.events.pagehide();assert.equal(f.elements.start.textContent,'START');
});
test('all browser inference assets ship under the project-relative URL',()=>{
  const base=new URL('../public/vendor/mediapipe/tfjs/',import.meta.url);
  for(const p of ['hand-runtime.mjs','detector/model.json','detector/group1-shard1of1.bin','landmark/model.json','landmark/group1-shard1of1.bin','tfjs-backend-wasm.wasm','tfjs-backend-wasm-simd.wasm'])assert.ok(fs.statSync(new URL(p,base)).size>0,p);
});

test('STOP during an in-flight inference prevents late landmarks, status updates and frame scheduling',async()=>{
  let resolve;const pending=new Promise(r=>resolve=r),f=camera();
  f.detector.detectForVideo=()=>pending;
  await f.c.start();const frame=f.tick(100);f.c.stop();
  resolve({landmarks:[Array(21).fill({x:.5,y:.5,z:0})]});await frame;await new Promise(setImmediate);
  assert.equal(f.c.state,'stopped');assert.ok(f.stream.stopped);assert.ok(f.detector.closed);
  assert.equal(f.results.length,1);assert.equal(f.results[0].landmarks.length,0);
  assert.match(f.statuses.at(-1),/STOPPED/);assert.equal(f.frames.size,0);
});
test('original MediaPipe Hands video results feed 21 landmarks into the camera loop',async()=>{
  const frames=new Map(),statuses=[];let frameId=0,closed=0,sendCount=0;
  const landmarks=Array.from({length:21},(_,i)=>({x:.2+i*.01,y:.4,z:0}));
  class Hands{
    setOptions(options){assert.equal(options.modelComplexity,1);}
    onResults(callback){this.callback=callback;}
    async initialize(){}
    async send(){sendCount++;this.callback({multiHandLandmarks:[landmarks]});}
    close(){closed++;}
  }
  const sandbox={URL,console,window:{Hands},document:{currentScript:{src:'https://example.org/art/retro-ragdoll/hand-tracker.js'},createElement:()=>({}),head:{append(script){script.onload();}}},navigator:{mediaDevices:{}},setTimeout,clearTimeout,
    requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId;},cancelAnimationFrame:id=>frames.delete(id)};
  vm.runInNewContext(controllerSource,sandbox);
  const video={srcObject:null,play:async()=>{},pause(){},readyState:2,videoWidth:640,currentTime:1};
  const stream={getTracks:()=>[{stop(){},addEventListener(){}}]};
  const results=[];
  const camera=new sandbox.window.RetroCameraController({video,getStream:async()=>stream,onState(){},onStatus:s=>statuses.push(s),onResults:r=>results.push(r)});
  await camera.start();const first=[...frames.values()].at(-1);frames.clear();await first(100);
  assert.equal(results.at(-1).landmarks[0].length,21);
  assert.equal(results.at(-1).landmarks[0][0].x,.2);
  assert.match(statuses.at(-1),/HAND DETECTED/);
  video.currentTime=2;const second=[...frames.values()].at(-1);frames.clear();await second(160);
  assert.equal(sendCount,2);camera.stop();await new Promise(setImmediate);assert.equal(closed,1);
});
test('consecutive hand landmark positions move the ragdoll target and change torso direction',()=>{
  class Vector{
    constructor(x=0,y=0,z=0){Object.assign(this,{x,y,z});}
    copy(){return new Vector(this.x,this.y,this.z);}
    lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this;}
    set(v){Object.assign(this,v);return this;}
    static dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);}
  }
  const sandbox={performance:{now:()=>1000},p5:{Vector},createVector:(...args)=>new Vector(...args),constrain:(v,a,b)=>Math.max(a,Math.min(b,v))};
  const run=code=>vm.runInContext(code,context);
  const context=vm.createContext(sandbox);run(source);
  run('video={videoWidth:640,videoHeight:480};cameraCanvas={width:640,height:480};cameraCtx={clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fill(){},fillText(){}};tracking=true;artworkReady=true;anchorTarget=createVector(0,0,0);');
  const points=x=>Array.from({length:21},(_,i)=>({x:i===12?x+.06:i===17?x-.04:x,y:i===12?.3:.5,z:0}));
  sandbox.first=points(.25);run('onHands({landmarks:[first]})');
  const left=run('anchorTarget.x'),angleLeft=run('handAngle');
  sandbox.second=points(.75);run('onHands({landmarks:[second]})');
  assert.ok(run('anchorTarget.x')<left-100);
  assert.ok(Number.isFinite(angleLeft));
  assert.equal(run('handMode'), 'FLOAT'); // Updated in the animation loop.
  assert.equal(run('handPoints.length'),21);
});
