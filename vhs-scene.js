import * as THREE from './vendor/three.module.js';

const host=document.getElementById('vhsScene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch(error){host.querySelector('p').textContent='3D is unavailable. Use the dated timeline below to open a log.';}
if(renderer) init();
function init(){
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x0c1112,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 host.replaceChildren(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive 3D cassette cabinet');
 const hint=document.createElement('span');hint.className='vhs-orbit-hint';hint.textContent='DRAG TO ORBIT · SELECT A TAPE';host.append(hint);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100),rig=new THREE.Group();scene.add(rig);
 scene.add(new THREE.HemisphereLight(0xd3ebe6,0x282135,2.4));
 const key=new THREE.DirectionalLight(0xffe6bd,4.5);key.position.set(-5,9,7);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9});key.shadow.bias=-.0008;scene.add(key);
 const rim=new THREE.PointLight(0x72dacb,24,18);rim.position.set(6,4,-3);scene.add(rim);
 const pink=new THREE.PointLight(0xe697c9,10,15);pink.position.set(-6,2,3);scene.add(pink);
 const mat=(c,rough=.6,metal=.15)=>new THREE.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});
 const black=mat(0x171c21,.42,.35),edge=mat(0x40474a,.35,.6),wood=mat(0x65543f,.8),inside=mat(0x242b29,.9),silver=mat(0x858e8a,.3,.72);
 function box(parent,x,y,z,w,h,d,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function textTexture(text,bg='#ded4b7',fg='#182326',vertical=false){const c=document.createElement('canvas');c.width=vertical?128:768;c.height=vertical?768:192;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);g.fillStyle=fg;if(vertical){g.translate(64,384);g.rotate(-Math.PI/2);g.font='bold 30px Georgia';g.textAlign='center';g.fillText(text.slice(0,40),0,0,685);g.font='17px monospace';g.fillText('QUELLA   •   WORKING LOG',0,37,680);}else{g.font='bold 43px monospace';g.textAlign='center';g.fillText(text,c.width/2,110,720);}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
 function label(parent,x,y,z,w,h,texture){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:texture,roughness:.7}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 // Solid 3D cabinet: floor, roof, two sides and a recessed back.
 box(rig,0,-.9,0,11.5,.24,3.0,wood);box(rig,0,1.48,0,11.5,.24,3.0,wood);box(rig,-5.63,.27,0,.24,2.3,3,wood);box(rig,5.63,.27,0,.24,2.3,3,wood);box(rig,0,.25,-1.42,11.1,2.25,.12,inside);
 for(const x of [-5.15,5.15])box(rig,x,-1.16,.4,.5,.36,1.9,black);
 // Deck sits on top of the cabinet, with a real recessed loading opening.
 const deck=new THREE.Group();deck.position.set(0,2.13,-.1);rig.add(deck);
 // Separate panels leave a genuine opening; the tape travels into the hollow chassis.
 const slot={x:-.48,y:2.23,front:1.27,back:-.16,width:2.24,height:.53};
 box(deck,0,.1,-1.24,5.4,.92,.12,black);
 box(deck,0,.6,-.08,5.42,.1,2.5,edge);box(deck,0,-.36,-.08,5.4,.12,2.48,black);
 for(const x of [-2.64,2.64])box(deck,x,.1,-.08,.12,.92,2.48,edge);
 box(deck,0,.455,1.22,5.4,.21,.14,edge);box(deck,0,-.285,1.22,5.4,.15,.14,edge);
 box(deck,-2.17,.1,1.22,1.06,.59,.14,edge);box(deck,1.65,.1,1.22,2.1,.59,.14,edge);
 box(deck,slot.x,.1,-1.14,slot.width,.53,.08,mat(0x020406,.98));
 box(deck,slot.x,.39,1.30,2.38,.06,.13,silver);box(deck,slot.x,-.19,1.30,2.38,.06,.13,black);
 for(const x of [slot.x-1.16,slot.x+1.16])box(deck,x,.1,1.29,.07,.56,.13,black);
 for(const x of [-2.48,2.48])for(const y of [-.25,.44]){const screw=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.025,8),silver);screw.rotation.x=Math.PI/2;screw.position.set(x,y,1.31);deck.add(screw);}
 for(const x of [-2.15,2.15])box(deck,x,-.46,-.1,.42,.12,1.7,black);
 const status=label(deck,1.98,.16,1.283,.65,.22,textTexture('READY','#091615','#a8e9c2'));
 for(let i=0;i<4;i++)box(deck,1.6+i*.22,-.2,1.3,.15,.11,.1,silver);
 label(deck,-.35,.45,1.279,2.45,.13,textTexture('QUELLA  /  VHS MEMORY SYSTEM','#40474a','#cfd2c0'));
 for(let i=0;i<18;i++)box(deck,-2.3+i*.12,.66,-.4,.06,.018,.7,black);
 // Each tape has depth, edge ribs, a printed spine, face label and two reels.
 const tapes=[],pickables=[],loader=new THREE.TextureLoader(),notes=window.StudioNotes;
 notes.forEach((note,i)=>{
  const tape=new THREE.Group(),x=(i-(notes.length-1)/2)*.59;tape.position.set(x,.29,.33);rig.add(tape);
  const body=box(tape,0,0,0,.46,2.08,1.88,black);body.userData.tape=i;pickables.push(body);
  for(const y of [-.92,.92])box(tape,0,y,0,.49,.12,1.9,edge);
  for(let r=0;r<8;r++)box(tape,.237,-.77+r*.21,0,.018,.036,1.66,edge);
  const spine=label(tape,0,0,.951,.37,1.78,textTexture(note.shortTitle||note.title,'#d9d0ba','#182323',true));spine.userData.tape=i;pickables.push(spine);
  const face=new THREE.Group();face.position.x=.245;face.rotation.y=Math.PI/2;tape.add(face);
  for(const y of [-.55,.55]){const reel=new THREE.Mesh(new THREE.CylinderGeometry(.31,.31,.025,16),silver);reel.rotation.x=Math.PI/2;reel.position.set(0,y,.025);face.add(reel);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.04,8),black);hub.rotation.x=Math.PI/2;hub.position.set(0,y,.046);face.add(hub);}
  const cover=label(face,0,0,.051,1.48,.58,textTexture(note.title,'#897265','#fff6d2'));
  // Full-colour artwork on the visible spine, with a separate readable title band.
  const card=document.createElement('canvas');card.width=256;card.height=1024;const ink=card.getContext('2d');
  const spineMap=new THREE.CanvasTexture(card);spineMap.colorSpace=THREE.SRGBColorSpace;spineMap.anisotropy=renderer.capabilities.getMaxAnisotropy();spine.material.map=spineMap;
  function printSpine(image){
   ink.fillStyle=['#d8ae81','#a7c7c3','#b9b2d2','#c6ba80'][i%4];ink.fillRect(0,0,256,1024);
   if(image){const crop=Math.min(image.width/232,image.height/430),sw=232*crop,sh=430*crop;ink.drawImage(image,(image.width-sw)/2,(image.height-sh)/2,sw,sh,12,18,232,430);}
   else {ink.fillStyle='#243b40';ink.fillRect(12,18,232,430);ink.fillStyle='#e5d9b1';ink.font='bold 88px monospace';ink.textAlign='center';ink.fillText(String(i+1).padStart(2,'0'),128,235);ink.font='22px monospace';ink.fillText('UNRECORDED',128,296);}
   ink.save();ink.translate(140,716);ink.rotate(-Math.PI/2);ink.fillStyle='#182326';ink.textAlign='center';ink.font='bold 34px Georgia';ink.fillText(note.shortTitle||note.title,0,0,465);ink.restore();
   ink.fillStyle='#1b292d';ink.fillRect(12,958,232,50);ink.fillStyle='#fff0ce';ink.font='22px monospace';ink.textAlign='center';ink.fillText('VHS / '+String(i+1).padStart(2,'0'),128,991);spineMap.needsUpdate=true;
  }
  printSpine();const source=window.LogCovers?.[i];if(source)loader.load(source,texture=>{texture.colorSpace=THREE.SRGBColorSpace;cover.material.map=texture;cover.material.needsUpdate=true;printSpine(texture.image);});
  tapes.push({group:tape,base:tape.position.clone(),index:i});
 });
 const floor=box(scene,0,-1.46,0,35,.08,24,mat(0x182b2c,.25,.75));floor.receiveShadow=true;floor.material.transparent=true;floor.material.opacity=.66;
 // Mirrored geometry below the glossy surface gives the room a broken reflection.
 const reflection=rig.clone(true);reflection.scale.y=-1;reflection.position.y=-2.9;reflection.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.12;o.castShadow=false;}});scene.add(reflection);
 let active=!document.getElementById('archive').hidden,azimuth=.16,elevation=.37,distance=19,drag=null,hover=null,animation=null,last=0;
 const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
 function resize(){const b=host.getBoundingClientRect();if(b.width<1||b.height<1)return;renderer.setSize(b.width,b.height);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();distance=Math.max(11.2,20.5/camera.aspect);}
 new ResizeObserver(resize).observe(host);
 function hit(e){const b=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(mouse,camera);return ray.intersectObjects(pickables,false)[0]?.object.userData.tape??null;}
 renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,az:azimuth,el:elevation,moved:false};renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(animation)return;if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved ||= Math.abs(dx)+Math.abs(dy)>6;azimuth=THREE.MathUtils.clamp(drag.az-dx*.005,-.9,.9);elevation=THREE.MathUtils.clamp(drag.el+dy*.003,.13,.85);}else{const next=hit(e);if(next!==hover){hover=next;window.dispatchEvent(new CustomEvent('vhs-hover',{detail:hover}));}}});
 renderer.domElement.addEventListener('pointerup',e=>{if(drag&&!drag.moved&&!animation){const i=hit(e);if(i!==null)window.dispatchEvent(new CustomEvent('vhs-select',{detail:i}));}drag=null;});
 renderer.domElement.addEventListener('pointercancel',()=>drag=null);renderer.domElement.addEventListener('pointerleave',()=>{hover=null;window.dispatchEvent(new CustomEvent('vhs-hover',{detail:null}));});
 renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();distance=THREE.MathUtils.clamp(distance+e.deltaY*.01,12,32);},{passive:false});
 window.VHSArchive={setActive(value){active=value;if(value){tapes.forEach(t=>{t.group.position.copy(t.base);t.group.rotation.set(0,0,0);t.group.scale.setScalar(1);t.group.visible=true;});animation=null;resize();}},insert(index,done){const tape=tapes[index];if(!tape){done();return;}animation={tape,start:performance.now(),from:tape.group.position.clone(),done};status.material.map=textTexture('LOAD','#091615','#f5daa6');status.material.needsUpdate=true;}};
 function frame(now){requestAnimationFrame(frame);if(!active||document.hidden)return;const dt=Math.min(.05,(now-last)/1000||.016);last=now;
  camera.position.set(Math.sin(azimuth)*distance,Math.sin(elevation)*distance+1.0,Math.cos(azimuth)*Math.cos(elevation)*distance);camera.lookAt(0,.95,0);
  for(const tape of tapes){if(animation?.tape===tape)continue;const goal=tape.base.z+(hover===tape.index?.72:0);tape.group.position.z=THREE.MathUtils.damp(tape.group.position.z,goal,9,dt);tape.group.rotation.y=THREE.MathUtils.damp(tape.group.rotation.y,hover===tape.index?-.3:0,9,dt);}
  if(animation){const a=animation,t=(now-a.start)/2100,g=a.tape.group,ease=x=>x*x*(3-2*x);if(t<.3){g.position.copy(a.from);g.position.z+=ease(t/.3)*2;}else if(t<.7){const q=ease((t-.3)/.4);g.position.lerpVectors(new THREE.Vector3(a.from.x,a.from.y,a.from.z+2),new THREE.Vector3(slot.x,slot.y,slot.front+1.12),q);g.rotation.z=-Math.PI/2*q;g.rotation.y=0;g.scale.setScalar(1);}else{const q=ease(Math.min(1,(t-.7)/.3));g.position.set(slot.x,slot.y,THREE.MathUtils.lerp(slot.front+1.12,slot.back,q));g.scale.setScalar(1);g.rotation.z=-Math.PI/2;}if(t>=1){const done=a.done;animation=null;status.material.map=textTexture('PLAY','#091615','#a8e9c2');status.material.needsUpdate=true;done();}}
  if(!reduced){reflection.position.x=Math.sin(now*.029)>.99?.08:0;rim.intensity=24+Math.sin(now*.001)*3;}renderer.render(scene,camera);
 }
 resize();requestAnimationFrame(frame);
}
