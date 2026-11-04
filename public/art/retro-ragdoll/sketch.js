/* RETRO TIME MACHINE — V12 CONTROLLED ZERO-G / GESTURE GUIDE
   p5.js WEBGL + MediaPipe Hands
   V12: improved palm control, gentle anatomical shape recovery and limb damping
   Original 16 cuboid dimensions and 15 anatomical connections
   from user-supplied Rag Doll P5 reference.
   Uses stable Verlet distance constraints rather than the
   reference's high-cost rigid-body torque solver.
*/
const CFG={W:800,H:700,depth:700,gravity:0,drag:0.965,
  iterations:14,chestPull:0.48,handSmooth:0.76,mirror:true,
  swarmCount:720,swarmEnabled:true,anchorSpeed:14.0,
  anchorStiffness:0.14,anchorDamping:0.12,
  bgGrid:8,bgFPS:30,
  poseRestore:0.035, limbRestore:0.008,
  directionSmooth:0.40, tiltGain:0.23, maxTiltStep:0.064, maxTiltAngle:1.25,
  palmRangeX:740,palmRangeY:600, handDepthRange:45,
  flockRadius:31, separationRadius:10,
  ribbonLength:42, ribbonSteps:15,
  flowResistance:0.63,modelScale:0.5};
let nodes=[],links=[],parts=[],chestAnchor=null,anchorTarget=null;
let handsModel=null,video=null,camStream=null,tracking=false,
    busy=false,trackingGeneration=0,lastSeen=0,handPoints=null;
let cameraCanvas,cameraCtx,swarm=[],warp=false,timePhase=0;
let bgLayer,scanLayer,smoothedAnchor,anchorVelocity,backgroundPalette;
let showRoom=false,reverseDirection=1,restPositions=[],lastAnchorPos=null;
let warpBlend=0,warpStreams=[],prevHandDest=null;
let startButton,camButton,resetButton,statusEl;
let restOffsets=[];
let trackingStatus='READY · PRESS START',starting=false;
const HAND_ASSET_BASE=new URL('../../vendor/mediapipe/hands/',document.baseURI).href;
let handMode='FLOAT', handAngle=0, handAngleValid=false;
let handDirectionStrength=0;
let lastPalmMotionTime=0, lastPalmInput=null;
const BODY_COLLISION = {padding:2.5, strength:0.16, passes:2};

function setup(){
  let c;
  try{c=createCanvas(CFG.W,CFG.H,WEBGL);}
  catch(e){
    document.getElementById('status').textContent='WEBGL UNAVAILABLE · Enable browser graphics acceleration and reload.';
    document.getElementById('start').disabled=true;
    noLoop();return;
  }
  c.parent('stage');
  c.elt.setAttribute('aria-label','Retro human field — click to switch flock / meteor mode');
  c.elt.dataset.mode='flock';
  c.elt.addEventListener('click',e=>{
    const rect=c.elt.getBoundingClientRect();
    if(e.target!==c.elt||e.button!==0||e.clientX<rect.left||e.clientX>=rect.right||e.clientY<rect.top||e.clientY>=rect.bottom)return;
    warp=!warp;reverseDirection*=-1;
    c.elt.dataset.mode=warp?'meteor':'flock';
  });
  pixelDensity(1);frameRate(60);
  bgLayer=createGraphics(CFG.W,CFG.H);bgLayer.pixelDensity(1);bgLayer.noSmooth();
  scanLayer=createGraphics(CFG.W,CFG.H);scanLayer.pixelDensity(1);
  backgroundPalette=[[11,12,16],[28,32,48],[72,84,120],[140,160,180],[220,200,120],[240,120,80]];
  video=document.getElementById('preview');
  cameraCanvas=document.getElementById('hand-overlay');
  cameraCtx=cameraCanvas.getContext('2d');
  startButton=document.getElementById('start');
  camButton=document.getElementById('toggle-preview');
  resetButton=document.getElementById('reset');
  statusEl=document.getElementById('status');
  startButton.onclick=toggleTracking;
  camButton.onclick=()=>{
    const wrap=document.getElementById('camera-wrap');
    wrap.hidden=!wrap.hidden;
    camButton.textContent=wrap.hidden?'SHOW CAM':'HIDE CAM';
  };
  resetButton.onclick=resetModel;
  resetModel();
  initFlow();
  initWarpStreams();
}

function N(x,y,z){const p=createVector(x,y,z);return {p:p.copy(),old:p.copy()};}
function L(a,b,stiff=1){links.push({a,b,len:p5.Vector.dist(nodes[a].p,nodes[b].p),stiff});}
function P(name,a,b,w,d,axis='y'){
  parts.push({name,a,b,w:w*CFG.modelScale,d:d*CFG.modelScale,axis});
}
function resetModel(){
  // Distinct segments for forearm/hand and torso/pelvis.
  // No duplicate boxes share the same two endpoints.
  nodes=[];links=[];parts=[];
  const add=(x,y,z)=>{nodes.push(N(x*CFG.modelScale,y*CFG.modelScale,z*CFG.modelScale));return nodes.length-1;};
  const hip=add(0,75,0), chest=add(0,-70,0), neck=add(0,-160,0),head=add(0,-220,0);
  const rs=add(86,-125,0),ls=add(-86,-125,0);
  const re=add(145,-25,10),le=add(-145,-25,10);
  const rw=add(190,45,25),lw=add(-190,45,25); // wrist, not hand tip
  const rk=add(52,172,0),lk=add(-52,172,0);
  const ra=add(62,270,10),la=add(-62,270,10);
  const rf=add(62,293,-36),lf=add(-62,293,-36);
  const rt=add(210,99,30),lt=add(-210,99,30); // distinct hand tips
  [[hip,chest],[chest,neck],[neck,head],[chest,rs],[chest,ls],
   [rs,re],[ls,le],[re,rw],[le,lw],[rw,rt],[lw,lt],
   [hip,rk],[hip,lk],[rk,ra],[lk,la],[ra,rf],[la,lf]].forEach(x=>L(...x));
  [[rs,ls,1],[rs,neck,.8],[ls,neck,.8],
   [hip,rs,.85],[hip,ls,.85],[rk,lk,.4]].forEach(x=>L(...x));
  P('head',neck,head,61,77);
  P('neck',chest,neck,55,55);
  P('trunk',hip,chest,131,90);
  P('hip',hip,chest,131,90,'hip'); // independently drawn at pelvis
  P('upperLegR',hip,rk,65.5,65.5);P('upperLegL',hip,lk,65.5,65.5);
  P('lowerLegR',rk,ra,46,46);P('lowerLegL',lk,la,46,46);
  P('upperArmR',rs,re,39,39);P('upperArmL',ls,le,39,39);
  P('lowerArmR',re,rw,39,39);P('lowerArmL',le,lw,39,39);
  P('footR',ra,rf,39,85);P('footL',la,lf,39,85);
  P('handR',rw,rt,20,44);P('handL',lw,lt,20,44);
  restPositions=nodes.map(n=>n.p.copy());
  restOffsets=restPositions.map(q=>p5.Vector.sub(q,restPositions[chest]));
  chestAnchor=chest;
  anchorTarget=createVector(0,-70*CFG.modelScale,0);
  smoothedAnchor=anchorTarget.copy();
  anchorVelocity=createVector(0,0,0);
  lastAnchorPos=smoothedAnchor.copy();
  lastSeen=0;prevHandDest=null;lastPalmInput=null;lastPalmMotionTime=0;
  handAngle=0;handAngleValid=false;handDirectionStrength=0;handMode='FLOAT';
  nodes.forEach((n,i)=>{if(i!==chestAnchor)n.old.sub(createVector(random(-.18,.18),random(-.18,.18),random(-.15,.15)));});
}

// V10: palm controls translation; middle finger direction steers torso tilt.
// All limbs remain free to drift through the same joint-length simulation.
function simulate(){
  const now=performance.now();
  const handActive=tracking && now-lastSeen<850;
  handMode=handActive?'PALM + DIRECTION':'FLOAT';

  if(handActive){
    const diff=p5.Vector.sub(anchorTarget,smoothedAnchor);
    anchorVelocity.add(diff.mult(0.22));
    anchorVelocity.limit(20);
    smoothedAnchor.add(anchorVelocity);
    anchorVelocity.mult(0.70);
  } else {
    // Retain a little momentum after losing the hand; no hard reset.
    anchorVelocity.mult(0.975);
    smoothedAnchor.add(anchorVelocity);
  }

  const chest=nodes[chestAnchor].p;
  const movingHand=handActive && now-lastPalmMotionTime<220;
  // When the palm settles, angular motion loses energy instead of spinning forever.
  const limbDrag= movingHand ? 0.940 : 0.865;
  const coreDrag= movingHand ? 0.932 : 0.855;
  const palmGrip=handActive?0.40:0;
  for(let i=0;i<nodes.length;i++){
    const n=nodes[i];
    const vel=p5.Vector.sub(n.p,n.old).mult(i===chestAnchor?coreDrag:limbDrag);
    vel.limit(i===chestAnchor?13:15);
    n.old=n.p.copy();
    n.p.add(vel);
    // No per-node idle noise: it previously fed perpetual angular rotation.
    // The inherited Verlet velocity gives natural zero-G drift on its own.
  }

  // Hand position pulls the chest while preserving limb momentum.
  if(handActive)chest.lerp(smoothedAnchor,palmGrip);
  if(handActive && handAngleValid)steerTorsoDirection();
  // Free-form anatomical constraints: lengths only, no rigid upright restoration.
  for(let k=0;k<CFG.iterations;k++){
    for(const l of links){
      const a=nodes[l.a].p,b=nodes[l.b].p;
      const delta=p5.Vector.sub(b,a);
      const distance=Math.max(0.0001,delta.mag());
      const corr=delta.mult((distance-l.len)/distance*0.5*l.stiff);
      a.add(corr);b.sub(corr);
    }
    if(handActive)chest.lerp(smoothedAnchor,.18);
    if(k%3===2)stabilizeAnatomy(handActive);
    // Keep reasonable torso volume while permitting rotation and tumbling.
    const hip=nodes[0].p,neck=nodes[2].p;
    const spine=p5.Vector.sub(neck,hip);
    if(spine.mag()<44){
      const dir=spine.mag()>.001?spine.normalize():createVector(0,-1,0);
      neck.add(dir.copy().mult(1.1));hip.sub(dir.mult(1.1));
    }
    // Volumetric clearance for non-neighboring cuboids.
    if(k%4===3)for(let pass=0;pass<BODY_COLLISION.passes;pass++)resolveBodyIntersections();
    for(const n of nodes)n.p.z=constrain(n.p.z,-45,45);
  }
  // Screen-space containment. Apply one shared translation to all nodes to
  // preserve the freely rotating body rather than clipping individual limbs.
  // The model is rendered with a camera at z=950; these limits leave generous
  // padding for the box widths as well as the skeleton endpoints.
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(const n of nodes){
    minX=Math.min(minX,n.p.x);maxX=Math.max(maxX,n.p.x);
    minY=Math.min(minY,n.p.y);maxY=Math.max(maxY,n.p.y);
  }
  const safeX=345,safeY=295;
  let dx=0,dy=0;
  if(minX<-safeX)dx=-safeX-minX;
  if(maxX+dx>safeX)dx+=safeX-(maxX+dx);
  if(minY<-safeY)dy=-safeY-minY;
  if(maxY+dy>safeY)dy+=safeY-(maxY+dy);
  if(dx||dy){
    for(const n of nodes){n.p.x+=dx;n.p.y+=dy;n.old.x+=dx;n.old.y+=dy;}
    smoothedAnchor.x+=dx;smoothedAnchor.y+=dy;
    if(handActive)anchorVelocity.mult(.75);
  }
  // Stop extreme numerical velocities, not natural ragdoll rotation.
  for(const n of nodes){
    if(!Number.isFinite(n.p.x+n.p.y+n.p.z)){resetModel();break;}
  }
}


// Recover recognizable anatomy without pinning the limbs into a fixed pose.
// Core bones retain a stable frame; peripheral segments have much weaker bias
// and remain free to swing with inertia. Targets rotate with the torso so
// pointing the middle finger sideways does not pull limbs to an upright T-pose.
function stabilizeAnatomy(handActive){
  const chest=nodes[chestAnchor].p;
  const hip=nodes[0].p;
  const ax=chest.x-hip.x, ay=chest.y-hip.y;
  let angle=Math.atan2(ax,-ay);
  if(!Number.isFinite(angle))angle=0;
  const c=Math.cos(angle),s=Math.sin(angle);
  const isMoving=handActive && performance.now()-lastPalmMotionTime<220;
  for(let i=0;i<nodes.length;i++){
    if(i===chestAnchor)continue;
    // Stronger torso scaffold: pelvis, neck, shoulders.
    // Head and limb endpoints retain significant free motion.
    const core=[0,2,4,5].includes(i);
    const head=i===3;
    const strength=core ? (isMoving?0.075:0.095)
       : head ? (isMoving?0.022:0.030)
       : (isMoving?CFG.limbRestore:CFG.limbRestore*1.4);
    const offset=restOffsets[i];
    const targetX=chest.x+offset.x*c-offset.y*s;
    const targetY=chest.y+offset.x*s+offset.y*c;
    const targetZ=chest.z+offset.z;
    const n=nodes[i];
    n.p.x+=(targetX-n.p.x)*strength;
    n.p.y+=(targetY-n.p.y)*strength;
    n.p.z+=(targetZ-n.p.z)*strength*.55;
  }
  // Keep the two knees apart enough to avoid a folded, inseparable mass.
  for(const [a,b] of [[10,11],[8,9]]){
    const pa=nodes[a].p,pb=nodes[b].p;
    const dist=p5.Vector.dist(pa,pb);
    const minDist=(a===10?30:21);
    if(dist<minDist){
      const d=p5.Vector.sub(pb,pa);
      if(d.mag()<.001)d.set(1,0,0);
      d.normalize().mult((minDist-dist)*.20);
      pa.sub(d);pb.add(d);
    }
  }
}

// Collision approximation between non-adjacent cuboid centerlines.
// Adjacent pieces may touch at a joint. Non-adjacent limbs cannot pass
// through the chest or each other without receiving separation impulses.
function resolveBodyIntersections(){
  const paths=parts.filter(p=>p.axis!=='hip');
  for(let i=0;i<paths.length;i++)for(let j=i+1;j<paths.length;j++){
    const a=paths[i],b=paths[j];
    if(a.a===b.a||a.a===b.b||a.b===b.a||a.b===b.b)continue;
    // Opposite anatomical parts can touch near the shoulders; keep
    // force soft so an IK-like solver doesn't tear the skeleton apart.
    const A=nodes[a.a].p, B=nodes[a.b].p,C=nodes[b.a].p,D=nodes[b.b].p;
    const hit=closestSegmentPair(A,B,C,D);
    const ra=Math.min(14,Math.max(a.w,a.d)*.36);
    const rb=Math.min(14,Math.max(b.w,b.d)*.36);
    const required=ra+rb+BODY_COLLISION.padding;
    if(hit.d>=required)continue;
    let delta=p5.Vector.sub(hit.p,hit.q);
    if(delta.magSq()<1e-6){delta=createVector(.01,0,.99);}
    const impulse=delta.normalize().mult(Math.min(3,(required-hit.d)*BODY_COLLISION.strength));
    const wa=1-hit.s,wb=hit.s,wc=1-hit.t,wd=hit.t;
    // Never produce torque by applying impulses to the previous pose alone.
    A.add(p5.Vector.mult(impulse,wa));B.add(p5.Vector.mult(impulse,wb));
    C.sub(p5.Vector.mult(impulse,wc));D.sub(p5.Vector.mult(impulse,wd));
  }
}
function closestSegmentPair(a,b,c,d){
  const u=p5.Vector.sub(b,a),v=p5.Vector.sub(d,c),w=p5.Vector.sub(a,c);
  const aa=u.dot(u),bb=u.dot(v),cc=v.dot(v),dd=u.dot(w),ee=v.dot(w);
  let s=0,t=0;
  const den=aa*cc-bb*bb;
  if(den>1e-8)s=constrain((bb*ee-cc*dd)/den,0,1);
  if(cc>1e-8)t=constrain((bb*s+ee)/cc,0,1);
  if(aa>1e-8)s=constrain((bb*t-dd)/aa,0,1);
  if(cc>1e-8)t=constrain((bb*s+ee)/cc,0,1);
  const p=p5.Vector.add(a,p5.Vector.mult(u,s));
  const q=p5.Vector.add(c,p5.Vector.mult(v,t));
  return {p,q,s,t,d:p5.Vector.dist(p,q)};
}

// Steer only the torso's overall direction. This does not assign any fingertip
// to a body joint and does not freeze the limbs into an upright pose.
// Rotate positions AND previous Verlet positions together to avoid injecting
// artificial angular velocity that could spin the ragdoll uncontrollably.
function steerTorsoDirection(){
  const hip=nodes[0].p, chest=nodes[chestAnchor].p;
  const upX=chest.x-hip.x, upY=chest.y-hip.y;
  if(Math.hypot(upX,upY)<5)return;
  const current=Math.atan2(upX,-upY);
  const error=wrapAngle(handAngle-current);
  const step=constrain(error*CFG.tiltGain,-CFG.maxTiltStep,CFG.maxTiltStep);
  if(Math.abs(step)<.0001)return;
  const pivot=chest.copy(),c=Math.cos(step),ss=Math.sin(step);
  for(const n of nodes){
    for(const q of [n.p,n.old]){
      const dx=q.x-pivot.x,dy=q.y-pivot.y;
      q.x=pivot.x+dx*c-dy*ss;
      q.y=pivot.y+dx*ss+dy*c;
    }
  }
}
function wrapAngle(a){return Math.atan2(Math.sin(a),Math.cos(a));}

function drawTimeField(){
  const g=bgLayer,sz=CFG.bgGrid;
  const cols=Math.ceil(CFG.W/sz),rows=Math.ceil(CFG.H/sz);
  g.noStroke();
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
    const nx=i/cols,ny=j/rows;
    const w1=Math.sin(nx*6+timePhase*2+ny*2);
    const w2=Math.cos(ny*8-timePhase*1.5+nx*3);
    const w3=Math.sin((nx+ny)*10+timePhase*3);
    let v=(w1+w2+w3)/6+0.5;
    v=Math.pow(Math.max(0,Math.min(1,v)),warp?2.6:1);
    const idx=Math.max(0,Math.min(5,Math.floor(v*5)));
    const c=backgroundPalette[idx];
    g.fill(c[0],c[1],c[2]);g.rect(i*sz,j*sz,sz,sz);
  }
  // Thin CRT lines are deliberately static rather than diagonal particles.
  g.stroke(0,0,0,45);g.strokeWeight(1);
  for(let y=0;y<CFG.H;y+=3)g.line(0,y,CFG.W,y);
}
function drawOverlay(){
  const g=scanLayer;g.clear();g.noStroke();
  const y=(frameCount*(warp?2.5:0.5))%CFG.H;
  g.fill(255,255,255,9);g.rect(0,y,CFG.W,25);
  g.textFont('monospace');g.textSize(13);g.fill(235,216,158);
  g.textAlign(g.LEFT,g.TOP);
  g.text('YEAR '+Math.floor(1970+Math.abs(timePhase)*12+ (warp?900:0)),14,12);
  g.textAlign(g.RIGHT,g.TOP);
  g.text(warp?'TIME WARP / METEOR STREAM':'ZERO-G / '+handMode,CFG.W-14,12);
  g.textAlign(g.LEFT,g.BOTTOM);g.textSize(11);
  g.text('CLICK CANVAS · FLOCK / METEOR    F · FLOW    R · RESET',14,CFG.H-12);
}

function draw(){
  timePhase+=reverseDirection*(warp?0.047:0.009);
  warpBlend=lerp(warpBlend,warp?1:0,0.065);
  if(frameCount%2===0)drawTimeField();
  drawOverlay();
  background(11,12,16);
  drawingContext.disable(drawingContext.DEPTH_TEST);
  push();resetMatrix();noLights();
  image(bgLayer,-width/2,-height/2,width,height);
  pop();
  drawingContext.clear(drawingContext.DEPTH_BUFFER_BIT);
  drawingContext.enable(drawingContext.DEPTH_TEST);
  ambientLight(145);
  directionalLight(255,255,255,0.4,0.8,-1);
  perspective(PI/3,width/height,20,3500);
  camera(0,0,950,0,0,0,0,1,0);
  if(showRoom)drawRoom();
  simulate();
  if(CFG.swarmEnabled)drawSwarm();
  for(const part of parts)drawPart(part);
  if(tracking&&performance.now()-lastSeen<850){
    const p=nodes[chestAnchor].p;
    push();translate(p.x,p.y,p.z+60);noStroke();
    emissiveMaterial(100,255,140);sphere(5,7,5);pop();
  }
  drawingContext.disable(drawingContext.DEPTH_TEST);
  push();resetMatrix();noLights();
  image(scanLayer,-width/2,-height/2,width,height);
  pop();
  drawingContext.enable(drawingContext.DEPTH_TEST);
  if(frameCount%12===0){
    statusEl.textContent=tracking
      ? `CAMERA ACTIVE · ${performance.now()-lastSeen<850?'HAND / '+handMode+' / '+Math.round(handAngle*180/Math.PI)+' DEG':'SEARCHING FOR HAND'} · ${round(frameRate())} FPS`
      :trackingStatus;
  }
}

function drawRoom(){
  push();noFill();stroke(205);strokeWeight(1);
  const x=width/2-2,y=height/2-2,z=CFG.depth/2;
  for(const zz of [-z,z]){
    line(-x,-y,zz,x,-y,zz);line(x,-y,zz,x,y,zz);
    line(x,y,zz,-x,y,zz);line(-x,y,zz,-x,-y,zz);
  }
  for(const xx of [-x,x])for(const yy of [-y,y])line(xx,yy,-z,xx,yy,z);
  pop();
}

function drawPart(part){
  const a=nodes[part.a].p,b=nodes[part.b].p;
  const middle=p5.Vector.add(a,b).mult(.5);
  const dir=p5.Vector.sub(b,a);
  const originalLength=Math.max(.001,dir.mag());
  const unit=dir.copy().div(originalLength);
  let h=Math.max(6,originalLength-2.5); // small visual joint gap
  if(part.axis==='hip'){
    h=43*CFG.modelScale;
    middle.set(nodes[0].p.x,nodes[0].p.y+17*CFG.modelScale,nodes[0].p.z);
  } else if(part.name==='trunk'){
    h=116*CFG.modelScale;
    // Torso occupies upper portion of spine; pelvis is a separate box.
    middle.add(unit.copy().mult(10*CFG.modelScale));
  } else if(part.name==='head'){
    h=75*CFG.modelScale;
    middle.add(unit.copy().mult(3*CFG.modelScale));
  } else if(part.name==='neck'){
    h=28*CFG.modelScale;
  } else if(part.name.startsWith('foot')){
    h=30*CFG.modelScale;
  } else if(part.name.startsWith('hand')){
    h=Math.min(h,56*CFG.modelScale);
  }
  const axis=createVector(0,1,0);
  const rotAxis=axis.copy().cross(unit);
  const angle=acos(constrain(axis.dot(unit),-1,1));
  push();translate(middle.x,middle.y,middle.z);
  if(rotAxis.mag()>.0001)rotate(angle,rotAxis.normalize());
  else if(unit.y<0)rotateZ(PI);
  fill(0,225,230);stroke(0,25,32);strokeWeight(1.1);
  box(part.w,h,part.d);
  pop();
}

// V6: many small tadpole-like fluid agents distributed across the full canvas.
// Each head obeys Reynolds separation / alignment / cohesion, plus body avoidance.
// A sinusoidal tapered bead-chain creates a soft swimming tail, not straight streaks.
function initFlow(){
  swarm=[];
  const hues=[175,190,205,220,245,270,295,320,340,15,42,65,105,145];
  for(let i=0;i<CFG.swarmCount;i++){
    const x=random(-CFG.W/2,CFG.W/2),y=random(-CFG.H/2,CFG.H/2);
    const angle=random(TWO_PI),v=createVector(cos(angle),sin(angle)).mult(random(.35,.95));
    const trail=[];
    for(let k=0;k<CFG.ribbonSteps;k++)trail.push(createVector(x-v.x*k*2,y-v.y*k*2));
    swarm.push({p:createVector(x,y),v,a:createVector(0,0),trail,
      hue:hues[i%hues.length]+random(-8,8),phase:random(TWO_PI),
      radius:random(0.8,2.1),speed:random(.65,1.7),z:random(-90,30),
      frequency:random(.24,.46),amplitude:random(.9,2.7),flicker:random(0.7,1.5)});
  }
}
function flowSteer(v,maxForce){return v.limit(maxForce);}
function updateFlow(){
  // Spatial hash avoids an O(N²) full flock scan.
  const cell=CFG.flockRadius, buckets=new Map();
  for(let i=0;i<swarm.length;i++){
    const b=swarm[i],key=`${floor(b.p.x/cell)},${floor(b.p.y/cell)}`;
    if(!buckets.has(key))buckets.set(key,[]);
    buckets.get(key).push(i);
  }
  const bodySegments=links.slice(0,15).map(l=>[nodes[l.a].p,nodes[l.b].p]);
  const boundX=CFG.W/2+50,boundY=CFG.H/2+50;
  for(let i=0;i<swarm.length;i++){
    const b=swarm[i],cx=floor(b.p.x/cell),cy=floor(b.p.y/cell);
    let sep=createVector(0,0),ali=createVector(0,0),coh=createVector(0,0),n=0,ns=0;
    for(let yy=-1;yy<=1;yy++)for(let xx=-1;xx<=1;xx++){
      const list=buckets.get(`${cx+xx},${cy+yy}`)||[];
      for(const j of list){
        if(i===j)continue;
        const o=swarm[j],dx=b.p.x-o.p.x,dy=b.p.y-o.p.y,d2=dx*dx+dy*dy;
        if(d2<.0001||d2>cell*cell)continue;
        ali.add(o.v);coh.add(o.p);n++;
        if(d2<CFG.separationRadius*CFG.separationRadius){sep.x+=dx/d2;sep.y+=dy/d2;ns++;}
      }
    }
    if(n){
      ali.div(n).setMag(b.speed).sub(b.v).limit(.038);
      coh.div(n).sub(b.p).setMag(b.speed).sub(b.v).limit(.026);
      b.a.add(ali.mult(.9)).add(coh.mult(.62));
    }
    if(ns){sep.div(ns).setMag(b.speed).sub(b.v).limit(.085);b.a.add(sep.mult(1.55));}
    // Slow fluid meandering across the WHOLE canvas; no ring/orbit force.
    const turn=noise(b.p.x*.003+100,b.p.y*.003+100,timePhase*.08+b.phase)*TWO_PI*2;
    b.a.add(createVector(cos(turn),sin(turn)).mult(.018));
    // Avoid the entire articulated figure, not just its chest or joints.
    for(const [a,c] of bodySegments){
      const vx=c.x-a.x,vy=c.y-a.y,den=vx*vx+vy*vy;
      const u=den<.001?0:constrain(((b.p.x-a.x)*vx+(b.p.y-a.y)*vy)/den,0,1);
      const px=a.x+u*vx,py=a.y+u*vy,dx=b.p.x-px,dy=b.p.y-py;
      const d=Math.hypot(dx,dy),safe=26;
      if(d<safe){
        const strength=(safe-d)/safe*.28;
        if(d>.001){b.a.x+=dx/d*strength;b.a.y+=dy/d*strength;}
        else b.a.x+=.08;
      }
    }
    b.v.add(b.a);b.a.mult(0);b.v.mult(.987);
    b.v.limit(b.speed*(warp?1.4:1));
    if(b.v.mag()<.24)b.v.setMag(.24);
    b.p.add(b.v);
    // Wrap continuously so the school fills the whole screen.
    let wrapped=false;
    if(b.p.x<-boundX){b.p.x=boundX;wrapped=true;}
    if(b.p.x>boundX){b.p.x=-boundX;wrapped=true;}
    if(b.p.y<-boundY){b.p.y=boundY;wrapped=true;}
    if(b.p.y>boundY){b.p.y=-boundY;wrapped=true;}
    if(wrapped)b.trail.forEach(q=>q.set(b.p));
    b.trail.unshift(b.p.copy());
    if(b.trail.length>CFG.ribbonSteps)b.trail.pop();
  }
}
function drawSwarm(){
  // The flock simulation runs only in normal mode.
  // During the warp transition it is replaced by diagonal falling streaks.
  if(warpBlend<0.99)updateFlow();
  if(warpBlend>0.01){drawWarpStreams(warpBlend);}
  if(warpBlend>=0.99)return;
  push();noLights();colorMode(HSB,360,100,100,255);noStroke();
  for(const b of swarm){
    const count=b.trail.length;
    // Flowing tadpole: round head, tapering translucent, laterally waving tail.
    for(let i=count-1;i>=0;i--){
      const p=b.trail[i],prior=b.trail[Math.max(0,i-1)];
      const dx=p.x-prior.x,dy=p.y-prior.y,mag=Math.max(.001,Math.hypot(dx,dy));
      const nx=-dy/mag,ny=dx/mag;
      const tail=i/(count-1),thickness=b.radius*Math.pow(1-tail,1.15)+.12;
      const wiggle=Math.sin(timePhase*5*b.flicker-i*b.frequency+b.phase)*b.amplitude*tail;
      const alpha=190*Math.pow(1-tail,.65)*(1-warpBlend);
      fill((b.hue+360)%360,85,100,alpha);
      push();translate(p.x+nx*wiggle,p.y+ny*wiggle,b.z);circle(0,0,thickness*2);pop();
    }
  }
  pop();
}


// TIME WARP: independent diagonal meteor field, NOT Reynolds flocking.
// The original swimmers fade out; these streaks fade in on canvas click.
function initWarpStreams(){
  warpStreams=[];
  for(let i=0;i<560;i++){
    warpStreams.push({x:random(-CFG.W/2,CFG.W/2),y:random(-CFG.H/2,CFG.H/2),
      speed:random(8,25),len:random(5,26),hue:random([20,38,48,185,205,325]),
      alpha:random(80,210),thick:random(.55,1.8)});
  }
}
function drawWarpStreams(blend){
  push();noLights();colorMode(HSB,360,100,100,255);
  for(const s of warpStreams){
    s.x+=s.speed*0.62*blend;
    s.y+=s.speed*1.18*blend;
    if(s.y>CFG.H/2+35||s.x>CFG.W/2+35){
      s.x=random(-CFG.W/2-160,CFG.W/2);
      s.y=random(-CFG.H/2-220,-CFG.H/2);
    }
    stroke(s.hue,65,100,s.alpha*blend);strokeWeight(s.thick);
    line(s.x,s.y,s.x-s.len*.52*blend,s.y-s.len*blend);
  }
  pop();
}

window.addEventListener('pagehide',()=>{if(tracking||starting)stopTracking();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&(tracking||starting))stopTracking();});

function setTrackingStatus(message){trackingStatus=message;statusEl.textContent=message;}
function withTrackingTimeout(promise,message){
  let timer;
  return Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),30000);})]).finally(()=>clearTimeout(timer));
}
async function toggleTracking(){
  if(tracking){stopTracking();return;}
  if(starting)return;
  starting=true;
  const generation=++trackingGeneration;
  startButton.disabled=true;setTrackingStatus('REQUESTING CAMERA...');
  try{
    if(!navigator.mediaDevices?.getUserMedia)throw Error('HTTPS or localhost is required.');
    const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{width:640,height:480,facingMode:'user'}});
    if(generation!==trackingGeneration){stream.getTracks().forEach(t=>t.stop());return;}
    camStream=stream;
    video.srcObject=stream;await video.play();
    if(generation!==trackingGeneration)return;
    cameraCanvas.width=video.videoWidth||640;
    cameraCanvas.height=video.videoHeight||480;
    setTrackingStatus('LOADING HAND TRACKER...');
    if(typeof Hands!=='function')throw Error('Hand tracker could not load. Reload the artwork.');
    if(!handsModel){
      handsModel=new Hands({locateFile:f=>HAND_ASSET_BASE+f});
      handsModel.setOptions({maxNumHands:1,modelComplexity:1,minDetectionConfidence:0.5,minTrackingConfidence:0.5});
      handsModel.onResults(onHands);
    }
    await withTrackingTimeout(handsModel.initialize(),'Hand tracker loading timed out. Press START to retry.');
    if(generation!==trackingGeneration)return;
    tracking=true;
    startButton.textContent='STOP';
    setTrackingStatus('CAMERA ACTIVE · SEARCHING FOR HAND');
    processVideo(generation);
  }catch(e){
    if(generation!==trackingGeneration)return;
    console.error(e);stopTracking();
    const message=e.name==='NotAllowedError'
      ? 'CAMERA BLOCKED · Allow camera access for this website, then press START.'
      : e.name==='NotFoundError' ? 'NO CAMERA FOUND · Connect a camera, then press START.'
      : 'HAND TRACKING ERROR: '+e.message;
    setTrackingStatus(message);
    discardHandsModel();
  }finally{
    if(generation===trackingGeneration||!starting){starting=false;startButton.disabled=false;}
  }
}
function discardHandsModel(){
  const failed=handsModel;handsModel=null;
  if(failed)Promise.resolve().then(()=>failed.close()).catch(console.warn);
}
function stopTracking(){
  tracking=false;starting=false;trackingGeneration++;
  if(camStream)camStream.getTracks().forEach(t=>t.stop());
  camStream=null;video.pause();video.srcObject=null;
  cameraCtx.clearRect(0,0,cameraCanvas.width,cameraCanvas.height);
  handPoints=null;handAngleValid=false;handMode='FLOAT';lastSeen=0;
  startButton.disabled=false;startButton.textContent='START';
  setTrackingStatus('STOPPED · PRESS START TO RESUME');
}
async function processVideo(generation){
  if(!tracking||generation!==trackingGeneration)return;
  if(!busy&&video.readyState>=2){
    busy=true;
    try{await withTrackingTimeout(handsModel.send({image:video}),'Hand tracker stopped responding. Press START to retry.');}
    catch(e){
      if(generation===trackingGeneration){
        console.error('Hand frame:',e);stopTracking();
        setTrackingStatus('HAND TRACKING ERROR: '+e.message);
        discardHandsModel();
      }
    }
    finally{busy=false;}
  }
  if(tracking&&generation===trackingGeneration)requestAnimationFrame(()=>processVideo(generation));
}
function onHands(result){
  cameraCtx.clearRect(0,0,cameraCanvas.width,cameraCanvas.height);
  if(!tracking)return;
  const points=result.multiHandLandmarks?.[0];
  if(!points){handPoints=null;handAngleValid=false;return;}
  handPoints=points;lastSeen=performance.now();
  const palmIDs=[0,5,9,13,17];
  let x=0,y=0,z=0;
  for(const id of palmIDs){x+=points[id].x;y+=points[id].y;z+=points[id].z;}
  x/=palmIDs.length;y/=palmIDs.length;z/=palmIDs.length;
  const palm={x,y,z};
  // Palm motion translates the whole body; no per-finger targets.
  const nx=CFG.mirror?1-x:x;
  const dest=createVector((nx-.5)*CFG.palmRangeX,(y-.5)*CFG.palmRangeY,
    constrain(-z*CFG.handDepthRange,-38,38));
  if(lastPalmInput && p5.Vector.dist(lastPalmInput,dest)>2.4)lastPalmMotionTime=performance.now();
  lastPalmInput=dest.copy();
  if(prevHandDest && p5.Vector.dist(prevHandDest,dest)<.8)dest.set(prevHandDest);
  prevHandDest=dest.copy();
  anchorTarget.lerp(dest,CFG.handSmooth);

  // The vector from palm center to MIDDLE fingertip is the tilt direction.
  // Straight up = upright; tip right = lean right; tip left = lean left.
  const tip=points[12];
  const vx=(CFG.mirror?x-tip.x:tip.x-x);
  const vy=tip.y-y;
  const mag=Math.hypot(vx,vy);
  const palmWidth=Math.max(.025,Math.hypot(points[5].x-points[17].x,points[5].y-points[17].y));
  handDirectionStrength=mag/palmWidth;
  if(mag>Math.max(.016,palmWidth*.22)){
    const angle=constrain(Math.atan2(vx,-vy),-CFG.maxTiltAngle,CFG.maxTiltAngle);
    handAngle=handAngleValid
      ? handAngle+wrapAngle(angle-handAngle)*CFG.directionSmooth
      : angle;
    handAngleValid=true;
  }
  drawHandPreview(points,palm);
}

function drawHandPreview(points,palm){
  const c=cameraCtx,w=cameraCanvas.width,h=cameraCanvas.height;
  const lines=[[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
    [5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],
    [13,17],[17,18],[18,19],[19,20],[0,17]];
  c.strokeStyle='#65ff82';c.lineWidth=3;c.beginPath();
  for(const [a,b] of lines){c.moveTo(points[a].x*w,points[a].y*h);c.lineTo(points[b].x*w,points[b].y*h);}
  c.stroke();
  for(let i=0;i<points.length;i++){
    c.beginPath();c.arc(points[i].x*w,points[i].y*h,i===0?6:4,0,Math.PI*2);
    c.fillStyle='#4cff71';c.fill();
  }
  c.beginPath();c.arc(palm.x*w,palm.y*h,12,0,Math.PI*2);
  c.strokeStyle='#fff17a';c.lineWidth=3;c.stroke();
  // Yellow direction line from palm center to the middle fingertip.
  c.beginPath();c.moveTo(palm.x*w,palm.y*h);c.lineTo(points[12].x*w,points[12].y*h);
  c.strokeStyle='#ffef70';c.lineWidth=5;c.stroke();
  c.font='bold 19px monospace';c.fillStyle='#a6ffb6';
  c.fillText('PALM: MOVE / MIDDLE FINGER: TILT',16,28);
}
function keyPressed(){
  if(key==='f'||key==='F'){CFG.swarmEnabled=!CFG.swarmEnabled;return false;}
  if(key==='r'||key==='R'){resetModel();return false;}
  if(key==='b'||key==='B'){showRoom=!showRoom;return false;}
}
