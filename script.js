(() => {
 'use strict';
 const $=id=>document.getElementById(id), E=window.JourneyEngine, clamp=E.clamp;
 const canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false}), timeline=$('timeline'),tc=timeline.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

 const night=true;
 let route='home',mode='visual',index=0,busy=false;
 const indices={visual:0,log:0},rotations={visual:E.createRotation(),log:E.createRotation()},player=E.createWorld(),keys=new Set();
 let camera=600,cameraGoal=600,follow=true,mapWidth=800,mapHeight=500,scale=2,viewWidth=400,lastTime=0;
 let mapPointer=null,cardPointer=null,suppressCardClick=false,mascotPosition=0,hovered=null;
 let particles=[],lastInput=0,lastBurst=0,railPointer=null,aboutPointer={x:.5,y:.5};
 let feedbackOwner=false,feedbackLoaded=false,lastCursorSpark=0;
 let detailMascotStarted=0,detailScrollY=0,detailScrollVelocity=0,lastDetailScrollTime=0,lastLogSpark=0,logPileAmount=0,logSparks=[];
 let mini={x:42,y:270,vx:0,vy:0,score:0,won:false,stars:[{x:210,y:248},{x:400,y:205},{x:555,y:267}]};
 const colors=['#88b7a6','#bd7770','#c1aa6e','#879b79','#a391b8','#c398a9','#80abb7'];
 const notes=window.StudioNotes;
 if(window.mermaid)mermaid.initialize({startOnLoad:false,theme:'dark',securityLevel:'strict',flowchart:{curve:'basis'},timeline:{useMaxWidth:true}});
 const count=()=>mode==='log'?notes.length:12;
 const number=i=>String(i+1).padStart(2,'0');
 const palette=()=>({sky:'#102523',haze:'#213a34',grass:'#2b4234',road:'#706d51',ink:'#112421',dark:'#30483a',teal:'#538d86',red:'#a95f57',yellow:'#cab86e',pink:'#a77480',cream:'#c6cdb1',water:'#284e4c'});
 const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
 function tone(){}
 document.body.classList.add('night');

 const magicCursor=$('magicCursor');
 addEventListener('pointermove',e=>{
   if(e.pointerType==='touch')return;
   magicCursor.style.translate=e.clientX+'px '+e.clientY+'px';
   if(reduced||performance.now()-lastCursorSpark<34)return;
   lastCursorSpark=performance.now();
   const s=document.createElement('i');s.className='cursor-star';s.style.left=(e.clientX-2)+'px';s.style.top=(e.clientY-2)+'px';
   s.style.setProperty('--dx',(Math.random()*22-11)+'px');s.style.setProperty('--dy',(8+Math.random()*22)+'px');document.body.append(s);setTimeout(()=>s.remove(),620);
 });

 function fit(){
   const box=$('app').getBoundingClientRect();mapWidth=box.width;mapHeight=box.height;
   const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(mapWidth*dpr);canvas.height=Math.round(mapHeight*dpr);
   scale=Math.max(.9,Math.min(mapHeight/360,mapWidth/360));viewWidth=mapWidth/scale;
   cameraGoal=clamp(cameraGoal,viewWidth/2,1200-viewWidth/2);camera=clamp(camera,viewWidth/2,1200-viewWidth/2);
   timeline.width=Math.round(mapWidth*dpr);timeline.height=Math.round((innerWidth<650?115:132)*dpr);
   fitAbout();fitAtmospheres();
   if(route==='log')layoutCards();if(route==='detail')updateStrip();
 }
 function screenPoint(x,y){return {x:(x-camera+viewWidth/2)*scale,y:y*scale+(mapHeight-360*scale)/2};}
 function worldPoint(e){const b=canvas.getBoundingClientRect();return{x:(e.clientX-b.left)/scale+camera-viewWidth/2,y:(e.clientY-b.top-(mapHeight-360*scale)/2)/scale};}
 const targetEls=E.destinations.map(d=>{
   const b=document.createElement('button');b.className='map-target';b.dataset.id=d.id;b.setAttribute('aria-label','Walk to '+(d.kind==='flag'?'the hidden flag':d.title));
   const text=document.createElement('span');text.textContent=d.title;b.append(text);
   b.addEventListener('click',e=>{if(suppressMapClick)return;e.stopPropagation();chooseDestination(d.id);});
   b.addEventListener('focus',()=>{cameraGoal=d.x;follow=false;});
   $('mapTargets').append(b);return b;
 });
 let suppressMapClick=false;
 function positionTargets(){
   E.destinations.forEach((d,i)=>{
     const p=screenPoint(d.x,d.y),b=targetEls[i];b.style.left=p.x+'px';b.style.top=p.y+'px';b.style.width=d.w*scale+'px';b.style.height=d.h*scale+'px';
     b.classList.toggle('selected',player.queued===d.id);b.hidden=p.x<-100||p.x>mapWidth+100;
   });
   const gate=E.destinations[0],p=screenPoint(gate.x,gate.y-gate.h-5);
   $('gateEnter').style.left=p.x+'px';$('gateEnter').style.top=p.y+'px';$('gateEnter').hidden=p.x<-80||p.x>mapWidth+80;
   $('panLeft').disabled=cameraGoal<=viewWidth/2+1;$('panRight').disabled=cameraGoal>=1200-viewWidth/2-1;
 }
 function chooseDestination(id){
   if(busy||route!=='home')return;
   const d=E.destinations.find(d=>d.id===id);if(!d)return;
   E.walkTo(player,d.x,d.y,id);follow=true;keys.clear();tone(260);
   $('mapStatus').textContent='WALKING TO '+(d.kind==='flag'?'THE FLAG':d.title)+'…';
 }
 $('gateEnter').onclick=()=>chooseDestination('visual');
 $('panLeft').onclick=()=>pan(-viewWidth*.65);$('panRight').onclick=()=>pan(viewWidth*.65);
 function pan(delta){follow=false;cameraGoal=clamp(cameraGoal+delta,viewWidth/2,1200-viewWidth/2);}
 $('home').addEventListener('wheel',e=>{if(busy)return;e.preventDefault();pan((Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)/scale);},{passive:false});
 $('home').addEventListener('pointerdown',e=>{
   if(busy||e.target.closest('.edge-pan,.gate-enter'))return;
   mapPointer={x:e.clientX,y:e.clientY,cam:cameraGoal,moved:false,id:e.pointerId,onTarget:!!e.target.closest('.map-target')};
 });
 addEventListener('pointermove',e=>{
   if(mapPointer&&e.pointerId===mapPointer.id){
     if(Math.abs(e.clientX-mapPointer.x)>8){mapPointer.moved=true;follow=false;cameraGoal=clamp(mapPointer.cam-(e.clientX-mapPointer.x)/scale,viewWidth/2,1200-viewWidth/2);}
   }
   if(cardPointer&&e.pointerId===cardPointer.id){
     cardPointer.delta=e.clientX-cardPointer.x;
     if(Math.abs(cardPointer.delta)>4){cardPointer.moved=true;rotations[mode].target=cardPointer.start-cardPointer.delta/230;lastInput=performance.now();}
   }
 });
 addEventListener('pointerup',e=>{
   if(mapPointer&&e.pointerId===mapPointer.id){
     const m=mapPointer;mapPointer=null;
     if(m.moved){suppressMapClick=true;setTimeout(()=>suppressMapClick=false,0);}
     else if(!m.onTarget&&route==='home'&&!busy){const p=worldPoint(e);E.walkTo(player,p.x,p.y);follow=true;$('mapStatus').textContent='EXPLORING';}
   }
   if(cardPointer&&e.pointerId===cardPointer.id){
     const c=cardPointer;cardPointer=null;$('cardTrack').style.translate='';
     if(c.moved){suppressCardClick=true;setTimeout(()=>suppressCardClick=false,0);}
   }
 });
 addEventListener('pointercancel',()=>{mapPointer=null;cardPointer=null;$('cardTrack').style.translate='';});
 function tree(x,y,p){
   rect(x-2,y-12,5,17,p.dark);rect(x-15,y-31,31,19,p.dark);rect(x-11,y-42,23,14,p.dark);rect(x-6,y-49,13,10,p.dark);
   rect(x-11,y-31,18,9,p.grass);rect(x-7,y-42,10,7,p.grass);rect(x-16,y+4,31,3,p.haze);
 }
 function drawBuilding(d,p,time){
   const x=d.x-d.w/2,y=d.y-d.h,w=d.w,h=d.h,selected=player.queued===d.id;
   if(d.kind==='flag'){
     rect(d.x-2,y,3,h,p.dark);rect(d.x-9,d.y,18,3,p.dark);
     for(let k=0;k<24;k+=3){rect(d.x+1+k,y+3+Math.round(Math.sin(time*.003+k*.15)*2),3,18-k*.18,d.id.endsWith('west')?p.red:p.teal);}
     rect(d.x-8,d.y+5,17,4,p.road);return;
   }
   if(d.kind==='sign'||d.kind==='mail'){
     rect(d.x-2,y+12,4,h-12,p.dark);rect(x,y,w,18,d.kind==='sign'?p.yellow:p.red);rect(x+3,y+4,w-6,2,p.cream);rect(x+3,y+10,w-10,2,p.cream);return;
   }
   rect(x+5,d.y-2,w+3,7,p.dark);rect(x+5,y+5,w,h,p.dark);
   rect(x,y,w,h,p.cream);rect(x+w-11,y,11,h,p.haze);
   const accent=d.kind==='tower'?p.red:d.kind==='house'?p.teal:d.kind==='save'?p.pink:p.yellow;
   rect(x-5,y-7,w+10,12,accent);rect(x+4,y-13,w-8,7,accent);
   if(d.kind==='tower'){
     rect(x+13,y-27,w-26,17,p.dark);rect(x+19,y-23,w-38,9,p.yellow);
     for(let i=0;i<3;i++){rect(x+12+i*27,y+17,16,21,p.dark);rect(x+15+i*27,y+20,10,13,night?p.yellow:p.teal);}
     rect(x+11,y+50,w-22,4,accent);
   }else if(d.kind==='save'){
     rect(x+6,y+8,w-12,17,p.dark);rect(x+9,y+11,w-18,8,p.teal);
   }else{
     for(let i=10;i<w-12;i+=25){rect(x+i,y+15,15,17,p.dark);rect(x+i+2,y+17,11,11,night?p.yellow:p.teal);}
   }
   rect(d.x-9,d.y-26,18,26,p.dark);rect(d.x-6,d.y-23,12,23,selected?p.yellow:p.teal);
   rect(d.x-14,d.y+2,28,5,p.road);rect(d.x-19,d.y+7,38,4,p.road);
 }
 function drawPlayer(p,time){
   const x=player.x,y=player.y,bob=player.moving&&!reduced?Math.sin(time*.02)*1.3:0;
   rect(x-7,y+3,16,3,p.dark);rect(x-4,y-21+bob,10,9,p.cream);rect(x-5,y-22+bob,12,3,p.ink);
   rect(x-4,y-12+bob,10,12,p.teal);rect(x-7,y-10+bob,3,7,p.cream);rect(x+6,y-10+bob,3,7,p.cream);
   rect(x-3,y,3,5,p.ink);rect(x+3,y,3,5,p.ink);rect(x-2,y-18+bob,1,2,p.ink);rect(x+3,y-18+bob,1,2,p.ink);
   [p.red,p.yellow,p.teal,p.pink].forEach((c,i)=>rect(x-5+i*3,y-26+(i%2)*2+bob,3,3,c));
 }
 function drawMap(time,dt){
   if(!busy){
     const dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));
     const dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));
     if(dx||dy)follow=true;
     const arrived=E.tick(player,dt,dx,dy);
     if(arrived){$('mapStatus').textContent='ARRIVED · OPENING';openRoute(arrived,true);}
   }
   if(follow)cameraGoal=clamp(player.x,viewWidth/2,1200-viewWidth/2);
   camera+=(cameraGoal-camera)*(reduced?1:Math.min(1,dt*8));
   const ratio=canvas.width/mapWidth,oy=(mapHeight-360*scale)/2;
   ctx.setTransform(ratio,0,0,ratio,0,0);rect(0,0,mapWidth,mapHeight,palette().sky);
   ctx.setTransform(scale*ratio,0,0,scale*ratio,(-camera+viewWidth/2)*scale*ratio,oy*ratio);
   const p=palette();
   rect(0,0,1200,360,p.sky);rect(0,142,1200,50,p.haze);rect(0,181,1200,180,p.grass);
   // Continuous path and visible landmark approaches across the larger world.
   rect(26,230,1148,25,p.road);rect(575,187,50,148,p.road);rect(365,210,50,45,p.road);rect(785,207,50,48,p.road);
   rect(476,252,24,49,p.road);rect(714,252,23,55,p.road);rect(922,245,22,18,p.road);
   for(let i=0;i<36;i++){const x=20+i*34,y=230+(i%3)*7;rect(x,y,9,1,p.haze);}
   // Distant stepped hills and groves leave the caption's sky clear.
   for(let i=0;i<14;i++){const x=i*96;rect(x,153-(i%3)*7,106,33,p.haze);tree(x+24,188,p);}
   for(const x of [143,204,271,1030,1080])tree(x,286+(x%13),p);
   rect(172,302,146,28,p.water);rect(183,298,122,36,p.water);
   for(let i=0;i<8;i++)rect(185+i*14,309+(i%3)*5,8,1,p.cream);
   for(let i=0;i<75;i++){const x=(i*71+21)%1180,y=268+(i*17)%65;if(Math.abs(x-600)<34||Math.abs(x-488)<25||Math.abs(x-724)<24)continue;rect(x,y,1,5,p.dark);rect(x-2,y-2,4,3,[p.pink,p.yellow,p.cream][i%3]);}
   if(night)for(let i=0;i<60;i++){rect((i*97)%1200,18+(i*37)%98,1,1,p.cream);}
   E.destinations.forEach(d=>drawBuilding(d,p,reduced?0:time));
   if(player.target){ctx.strokeStyle=p.ink;ctx.lineWidth=1;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(player.x,player.y+5);ctx.lineTo(player.target.x,player.target.y+5);ctx.stroke();ctx.setLineDash([]);rect(player.target.x-3,player.target.y+3,7,2,p.red);}
   drawPlayer(p,time);positionTargets();
 }
 function setView(id){document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==id);}
 function markNav(id){document.querySelectorAll('.topbar a').forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}

function navigate(id,push=true){
   window.VHSArchive?.setActive(id==='log');
   if(route==='visual'&&id!=='visual')window.VisualJourney.leave();
   if(route==='detail'&&id!=='detail')$('detailSections').replaceChildren();
   busy=false;keys.clear();E.cancel(player);hovered=null;cardPointer=null;railPointer=null;
   route=id;markNav(id==='detail'?mode:id);
   if(push)history.pushState({archiveMode:id==='visual'||id==='log'?id:mode,slot:id==='visual'||id==='log'?indices[id]:index},'','#'+id);
   if(id==='home'){setView('home');fit();$('mapStatus').textContent='CHOOSE A DESTINATION';return;}
   if(id==='visual'){mode=id;index=0;setView('visualMap');window.VisualJourney.enter();$('journeyTitle').focus({preventScroll:true});return;}
   if(id==='log'){mode=id;index=indices[mode];setView('archive');buildArchive();$('archiveTitle').focus({preventScroll:true});return;}
   if(id==='detail'){setView('detail');buildDetail();$('detailTitle').focus({preventScroll:true});return;}
   if(id==='idea'){setView('ideaSettings');window.IdeaDeck?.enter();return;}
   if(id==='project'){setView('projectLevels');return;}
   if(id==='about'){setView('about');fitAbout();$('aboutTitle').focus({preventScroll:true});return;}
   if(id==='feedback'){setView('feedback');loadFeedback();$('feedbackTitle').focus({preventScroll:true});return;}
   if(id.startsWith('secret')){setView('secret');$('surpriseRoom').hidden=id!=='secret-west';$('gameRoom').hidden=id!=='secret-east';if(id==='secret-east'){const frame=$('pixelWorldFrame');if(!frame.src)frame.src=frame.dataset.src;else frame.contentWindow?.postMessage('quella:resize','*');}return;}
   setView('empty');$('emptyTitle').textContent=id.startsWith('secret')?'SECRET PAGE':({project:'PROJECT',idea:'IDEA PRESENTATION'}[id]||'');$('emptyKicker').textContent=id.startsWith('secret')?'HIDDEN SPACE / '+(id.endsWith('west')?'WEST':'EAST'):'CONTENT EMPTY';$('projectNext').hidden=id!=='project';$('emptyTitle').focus({preventScroll:true});
 }
 function bootInto(id){
   if(reduced){navigate(id);return;}
   busy=true;follow=true;cameraGoal=player.x;
   const d=E.destinations.find(q=>q.id===id),p=d?screenPoint(d.x,d.y-d.h/2):{x:mapWidth/2,y:mapHeight/2};
   $('home').style.setProperty('--travel-x',p.x+'px');$('home').style.setProperty('--travel-y',p.y+'px');$('home').classList.add('travel-focus');
   const overlay=document.createElement('div');overlay.className='travel-portal map-travel';overlay.innerHTML='<canvas aria-hidden="true"></canvas>';document.body.append(overlay);
   const c=overlay.querySelector('canvas'),g=c.getContext('2d'),ratio=Math.min(devicePixelRatio||1,2);c.width=innerWidth*ratio;c.height=innerHeight*ratio;
   const cx=p.x*ratio,cy=(p.y+parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav')))*ratio,start=performance.now(),colors=['#ffec8a','#ff9dec','#f9b7c1','#da86fb','#fff9e5'];
   function paint(t){const elapsed=t-start,progress=Math.min(1,Math.max(0,(elapsed-240)/750));g.clearRect(0,0,c.width,c.height);if(elapsed>180){for(let i=0;i<42;i++){const angle=i*2.399+Math.sin(t*.0008+i)*.14,r=(40+progress*2600)*ratio,dx=Math.cos(angle),dy=Math.sin(angle);g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+dx*r+dy*20*ratio,cy+dy*r-dx*20*ratio);g.lineTo(cx+dx*r-dy*20*ratio,cy+dy*r+dx*20*ratio);g.closePath();g.globalAlpha=(.08+.55*progress)*(i%5===0?1:.52);g.fillStyle=colors[i%colors.length];g.fill();}g.globalAlpha=1;}
     if(elapsed>720){g.fillStyle='rgba(0,0,4,'+Math.min(1,(elapsed-720)/230)+')';g.fillRect(0,0,c.width,c.height);}if(elapsed<1000)requestAnimationFrame(paint);}requestAnimationFrame(paint);
   setTimeout(()=>navigate(id),970);setTimeout(()=>{overlay.remove();$('home').classList.remove('travel-focus');busy=false;},1120);
 }
 function navBurst(id){
   if(busy||reduced){navigate(id);return;}busy=true;
   const overlay=document.createElement('div');overlay.className='nav-pixel-burst';overlay.innerHTML='<canvas aria-hidden="true"></canvas>';document.body.append(overlay);
   const c=overlay.querySelector('canvas'),g=c.getContext('2d'),r=Math.min(devicePixelRatio||1,2);c.width=innerWidth*r;c.height=innerHeight*r;const start=performance.now(),unit=18*r,cx=c.width/2,cy=c.height/2;
   const cells=Array.from({length:720},(_,i)=>{const a=i*2.39996,dist=12+Math.sqrt(i)*Math.min(c.width,c.height)/32;return{x:cx+Math.cos(a)*dist,y:cy+Math.sin(a)*dist,birth:dist/Math.hypot(cx,cy),color:['#09051c','#1a1137','#5b2e77','#ac69ab','#61cad2'][i%5]};});
   function paint(t){let q=Math.min(1,(t-start)/650);g.clearRect(0,0,c.width,c.height);for(const s of cells){if(q<s.birth*.75)continue;g.globalAlpha=Math.min(1,(q-s.birth*.75)*4);g.fillStyle=s.color;g.fillRect(Math.round(s.x/unit)*unit,Math.round(s.y/unit)*unit,unit+1,unit+1);}g.globalAlpha=1;for(let i=0;i<95;i++){const a=i*2.399,rad=(i*103)%Math.max(c.width,c.height);const x=cx+Math.cos(a)*rad,y=cy+Math.sin(a)*rad;if((Math.sin(t*.025+i*31)+1)/2>.72){g.fillStyle=i%3?'#fff2c8':'#9eeeff';g.fillRect(x,y,2*r,2*r);}}if(q>.76){g.fillStyle='rgba(2,3,13,'+Math.min(1,(q-.76)*5)+')';g.fillRect(0,0,c.width,c.height);}if(q<1)requestAnimationFrame(paint);}requestAnimationFrame(paint);
   setTimeout(()=>navigate(id),620);setTimeout(()=>{overlay.remove();busy=false;},760);
 }
 function openRoute(id,fromArrival=false){
   if(route==='home'&&!fromArrival&&id!=='home'){chooseDestination(id);return;}
   if(route==='home'&&fromArrival&&id!=='home'){bootInto(id);return;}
   navigate(id);
 }
 document.addEventListener('click',e=>{
   const a=e.target.closest('a[href^="#"]');if(!a)return;
   const id=a.hash.slice(1);if(!validRoute(id))return;e.preventDefault();
   if(id===route)return;
   if(e.target.closest('.topbar'))navigate(id);else if(id==='home')navigate('home');else openRoute(id);
 });
 addEventListener('popstate',e=>{const id=location.hash.slice(1);if(e.state?.archiveMode){mode=e.state.archiveMode;index=clamp(e.state.slot||0,0,count()-1);indices[mode]=index;}navigate(validRoute(id)?id:'home',false);});
 const validRoute=id=>['home','visual','log','detail','idea','project','feedback','about','secret-west','secret-east'].includes(id);
 function metadata(i){
   $('slotNumber').textContent=(mode==='log'?'DATED FRAGMENT':'CARTRIDGE')+' / '+number(i)+' — '+count();
   $('slotSummary').textContent=mode==='log'?notes[i].title:(i===0?'Retro Time Machine':'Untitled cartridge '+number(i));
   $('slotInfo').textContent=mode==='log'?notes[i].date+' · '+notes[i].type:(i===0?'P5.JS · INTERACTIVE GENERATIVE ART':'WORK / CONCEPT / INTRO · CONTENT EMPTY');
 }
 function buildArchive(){
   const isLog=mode==='log';$('archive').classList.toggle('is-log',isLog);
   $('vhsDeck').hidden=!isLog;
   $('archiveTitle').textContent=isLog?'WORKING LOG':'VISUAL JOURNEY';
   $('archiveKicker').textContent=isLog?'A FEW THOUGHTS, HELD IN TIME':'THE LOST GAME ARCHIVE';
   $('archiveHint').textContent=isLog?'JOURNAL STARTED 2026.09.18 · DRAG OR USE A TRACKPAD':'FREE ROTATION · CLICK ANY CARTRIDGE';
   $('archiveNext').href=isLog?'#visual':'#log';$('archiveNext').textContent=isLog?'BACK TO VISUAL JOURNEY ↗':'FOLLOW THE PROCESS → WORKING LOG';
   timeline.hidden=!isLog;$('timelineTicks').hidden=!isLog;$('summaryArrow').hidden=!isLog;
   $('cardTrack').replaceChildren();$('timelineTicks').replaceChildren();$('cardTrack').className='card-track';$('cardTrack').style.translate='';
   const slots=Array.from({length:count()},(_,i)=>({i,c:0}));
   for(const {i,c} of slots){
     const b=document.createElement('button');b.className='archive-card'+(isLog?' note':'');b.dataset.index=i;b.style.setProperty('--card',colors[i%colors.length]);b.style.setProperty('--side','#334c42');
     b.dataset.cycle=c;
     b.setAttribute('aria-label',isLog?'Read '+notes[i].title:'Open cartridge '+number(i));
     const art=document.createElement('span');art.className='slot-art';
     if(!isLog&&i===0){art.classList.add('live-art');const preview=document.createElement('canvas');preview.width=180;preview.height=220;preview.setAttribute('aria-hidden','true');art.append(preview);}else if(isLog){const img=document.createElement('img');img.src=window.LogCovers[i]||'./assets/visual-journey-background-v2.png';img.alt='';art.append(img);}else art.textContent=number(i);
     const small=document.createElement('small');small.textContent=isLog?notes[i].title:(i===0?'RETRO TIME MACHINE':'EMPTY FILE');art.append(small);
     const caption=document.createElement('span');caption.className='card-caption';caption.textContent=isLog?notes[i].date:'QUELLA / ARCHIVE';
     const meta=document.createElement('small');meta.textContent=isLog?notes[i].type.toUpperCase():(i===0?'P5.JS ARTWORK':'DEMO SLOT');caption.append(meta);b.append(art,caption);
     if(isLog){const spine=document.createElement('span');spine.className='vhs-spine';spine.innerHTML='<i>QUELLA ● VHS</i><strong></strong><small></small>';spine.querySelector('strong').textContent=notes[i].shortTitle||notes[i].title;spine.querySelector('small').textContent=notes[i].date;b.append(spine);}
     b.onmouseenter=()=>{hovered=i;metadata(i);};b.onmouseleave=()=>{hovered=null;metadata(index);};b.onfocus=()=>{hovered=i;metadata(i);};b.onblur=()=>{hovered=null;};
     b.onclick=()=>{if(!suppressCardClick)openCard(i);};$('cardTrack').append(b);
     if(isLog&&c===0){const tick=document.createElement('button');tick.textContent=notes[i].date.slice(5).replace('.','/');tick.setAttribute('aria-label','Read note dated '+notes[i].date);tick.onclick=()=>openCard(i);$('timelineTicks').append(tick);}
   }
   timeline.setAttribute('aria-valuemax',String(count()));
   lastInput=performance.now();layoutCards();fit();metadata(index);
 }
 function layoutCards(){
   const n=count(),pos=rotations[mode].position,isLog=mode==='log';
   index=E.wrap(Math.round(pos),n);indices[mode]=index;
   if(isLog){
     const cards=[...$('cardTrack').children],width=$('carousel').clientWidth;
     const slotWidth=Math.max(34,Math.min(62,(width-110)/cards.length));
     const rackWidth=slotWidth*cards.length;
     $('cardTrack').style.setProperty('--rack-width',rackWidth+'px');
     cards.forEach((b,i)=>{b.style.left='calc(50% - '+rackWidth/2+'px + '+i*slotWidth+'px)';b.style.top='auto';b.style.bottom='0';b.style.width=slotWidth+'px';b.style.transform='none';b.style.opacity='1';b.style.pointerEvents='auto';b.style.zIndex=String(i+1);b.tabIndex=0;b.setAttribute('aria-current',String(i===index));});
     $('prevCard').disabled=false;$('nextCard').disabled=false;if(hovered===null)metadata(index);return;
   }
   const gap=isLog?Math.min(185,innerWidth*.25):Math.min(255,innerWidth*.32);
   const maxVisible=isLog?4.2:3.7;
   [...$('cardTrack').children].forEach((b,i)=>{
     const actual=Number(b.dataset.index),cycle=Number(b.dataset.cycle||0),d=isLog?actual+(Math.floor(pos/n)+cycle)*n-pos:E.offset(i,pos,n),a=Math.abs(d),visible=a<maxVisible;
     const angle=d*(isLog?.13:.24),x=Math.sin(angle)*gap/(isLog?.13:.24),y=isLog?Math.min(60,a*18):Math.cos(angle)*-32;
     const z=isLog?-a*20:(Math.cos(angle)-1)*220;
     b.style.transform='translate(calc(-50% + '+x+'px),calc('+(isLog?'-100%':'-50%')+' + '+y+'px)) translateZ('+z+'px) rotateY('+(-angle*180/Math.PI+(isLog?-10:0))+'deg) scale('+(isLog?1:Math.max(.62,1-a*.055))+')';
     b.style.zIndex=String(100-Math.round(a*10));b.style.opacity=visible?String(Math.min(1,(maxVisible-a)*1.2)):'0';b.style.pointerEvents=visible?'auto':'none';b.tabIndex=actual===index&&a<.6?0:-1;b.setAttribute('aria-current',String(actual===index&&a<.6));
   });
   $('prevCard').disabled=false;$('nextCard').disabled=false;if(hovered===null)metadata(index);
   drawOrbit(pos);
 }
 function drawOrbit(pos){
   const w=$('carousel').clientWidth,h=$('carousel').clientHeight;
   if(!w||!h)return;
   $('orbitLines').setAttribute('viewBox','0 0 '+w+' '+h);
   const cy=h*.55,breath=Math.sin(pos*.3)*18;
   $('orbitBack').setAttribute('d','M -100 '+(cy+60)+' C '+w*.18+' '+(cy-180-breath)+' '+w*.77+' '+(cy-190+breath)+' '+(w+100)+' '+(cy+70));
   $('orbitFront').setAttribute('d','M -100 '+(cy+60)+' C '+w*.26+' '+(cy+170+breath)+' '+w*.8+' '+(cy+140-breath)+' '+(w+100)+' '+(cy+70));
 }
 function stepCard(dir){E.rotate(rotations[mode],dir);lastInput=performance.now();}
 $('prevCard').onclick=()=>stepCard(-1);$('nextCard').onclick=()=>stepCard(1);
 $('carousel').addEventListener('pointerdown',e=>{cardPointer={x:e.clientX,delta:0,moved:false,id:e.pointerId,start:rotations[mode].target};lastInput=performance.now();});
 $('archive').addEventListener('wheel',e=>{
   if(e.ctrlKey)return;e.preventDefault();let d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
   if(e.deltaMode===1)d*=16;if(e.deltaMode===2)d*=innerHeight;
   E.rotate(rotations[mode],d/260);lastInput=performance.now();
 },{passive:false});
 function drawKeeper(g,x,y,s,p,balloons=false,time=0){
   const r=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x+a*s),Math.round(y+b*s),Math.ceil(w*s),Math.ceil(h*s));};
   if(balloons){
     g.lineWidth=Math.max(1,s*.7);g.strokeStyle=p.cream;[-18,-7,8,19].forEach((bx,i)=>{g.beginPath();g.moveTo(x,y-45*s);g.quadraticCurveTo(x+bx*s*.25,y-70*s,x+(bx+Math.sin(time*.001+i)*3)*s,y-95*s);g.stroke();g.fillStyle=colors[i%colors.length];g.beginPath();g.ellipse(x+(bx+Math.sin(time*.001+i)*3)*s,y-105*s,10*s,14*s,0,0,Math.PI*2);g.fill();});
   }
   r(-9,-39,18,19,p.teal);r(-7,-54,14,16,p.cream);r(-7,-57,14,4,p.dark);r(-4,-47,2,2,p.dark);r(3,-47,2,2,p.dark);
   for(let row=-16;row<=16;row+=2){const half=Math.floor(Math.sqrt(256-row*row));r(-half,-14+row,half,2,p.teal);r(0,-14+row,half,2,p.dark);}
   r(-1,-30,3,33,p.yellow);r(-12,-25,5,3,p.cream);r(-16,-33,5,19,p.cream);r(11,-33,5,19,p.cream);r(-11,-15,7,4,p.cream);r(4,-15,7,4,p.cream);
   if(!balloons)colors.slice(0,5).forEach((c,i)=>r(-9+i*4,-60-(i%2)*4,4,4,c));
 }
 function drawTypingKeeper(g,x,y,s,p,frame=0){
   const r=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x+a*s),Math.round(y+b*s),Math.ceil(w*s),Math.ceil(h*s));};
   // Front-facing paper-flower keeper: only the head and shoulders rise above the machine.
   r(-22,-82,44,32,p.cream);r(-19,-88,38,8,p.dark);r(-17,-79,5,4,p.dark);r(12,-79,5,4,p.dark);r(-5,-69,10,3,p.pink);
   r(-31,-53,62,25,p.teal);r(-5,-56,10,28,p.yellow);r(-27,-48,17,7,p.cream);r(10,-48,17,7,p.cream);
   colors.slice(0,5).forEach((c,i)=>r(-20+i*10,-94-(i%2)*5,7,7,c));
   // The typewriter is the foreground silhouette; tiny key shifts create the typing loop.
   const carriage=frame?2:-2;r(-43+carriage,-44,86,5,p.cream);r(-47+carriage,-47,5,11,p.pink);r(42+carriage,-47,5,11,p.pink);
   r(-42,-39,84,36,p.cream);r(-36,-34,72,17,p.dark);for(let ky=0;ky<3;ky++)for(let kx=0;kx<10;kx++)r(-32+kx*7,-31+ky*5+(frame&&ky===1?1:0),4,3,ky===1?p.teal:p.yellow);
   r(-31,-62,62,22,'#d8e0ca');r(-27,-58,54,16,p.cream);r(-23,-55,35,3,p.teal);r(-23,-49,43,3,p.pink);
   const handY=frame?-17:-20;r(-29,handY,18,6,p.cream);r(11,handY,18,6,p.cream);r(-43,-4,86,6,p.dark);
  }
 function openLogPortal(){
   if(busy)return;busy=true;const layer=document.createElement('div');layer.className='log-portal';layer.innerHTML='<canvas></canvas><span>KEEPER SHIFT · STANDING → SITTING</span>';document.body.append(layer);
   const c=layer.querySelector('canvas'),g=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);c.width=innerWidth*dpr;c.height=(innerHeight-parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav')))*dpr;const sparks=[];const start=performance.now(),p=palette();
   function paint(t){
     const elapsed=t-start,w=c.width,h=c.height,s=Math.min(w,h)/185,sit=clamp((elapsed-360)/430,0,1);g.fillStyle='#07100f';g.fillRect(0,0,w,h);
     if(sit<1){g.globalAlpha=1-sit;drawKeeper(g,w*.5,h*.55+sit*20*dpr,s,p,false,t);}
     if(sit>0){g.globalAlpha=sit;drawTypingKeeper(g,w*.5+(1-sit)*w*.17,h*.61,s*.64,p,Math.floor(t/120)%2);}
     g.globalAlpha=1;if(elapsed>420&&elapsed<980)for(let i=0;i<3;i++)sparks.push({x:w*.5+(Math.random()-.5)*45*dpr,y:h*.33,vx:(Math.random()-.5)*4*dpr,vy:-Math.random()*5*dpr,c:colors[(Math.random()*colors.length)|0],life:50});
     for(const q of sparks){q.x+=q.vx;q.y+=q.vy;q.vy+=.18*dpr;q.life--;g.globalAlpha=Math.max(0,q.life/50);g.fillStyle=q.c;g.fillRect(q.x,q.y,4*dpr,4*dpr);}g.globalAlpha=1;
     if(elapsed<1380)requestAnimationFrame(paint);
   }requestAnimationFrame(paint);
   setTimeout(()=>{
     // Prepare the destination while the typing layer is still fully opaque.
     navigate('detail');busy=true;
     requestAnimationFrame(()=>requestAnimationFrame(()=>{
       layer.classList.add('lift');
       let finished=false;const finish=()=>{if(finished)return;finished=true;layer.remove();busy=false;};
       layer.addEventListener('transitionend',finish,{once:true});setTimeout(finish,550);
     }));
   },900);
 }
 function openCard(i=index){if(busy)return;index=i;indices[mode]=i;rotations[mode].position=i;rotations[mode].target=i;if(mode==='log'&&route==='log'&&window.VHSArchive&&!reduced){busy=true;window.VHSArchive.insert(i,()=>{busy=false;openLogPortal();});}else navigate('detail');}
 window.addEventListener('vhs-select',e=>{if(route==='log')openCard(e.detail);});
 window.addEventListener('vhs-hover',e=>{if(route==='log'){hovered=e.detail;metadata(hovered===null?index:hovered);}});
 $('openSlot').onclick=()=>openCard();$('backArchive').onclick=()=>navigate(mode);
 function buildDetail(){
   const isLog=mode==='log';$('detail').classList.toggle('note-detail',isLog);
   $('detailKicker').textContent=(isLog?'WORKING LOG / NOTE ':'VISUAL JOURNEY / CARTRIDGE ')+number(index);
   $('detailTitle').textContent=isLog?notes[index].title:(index===0?'Retro Time Machine':'Untitled cartridge '+number(index));
   $('detailHint').textContent=isLog?notes[index].date+' · '+notes[index].type.toUpperCase():(index===0?'QUELLA · P5.JS · INTERACTIVE GENERATIVE ART':'WORK / CONCEPT / INTRO');
   $('detailNext').hidden=isLog;$('detailNext').href='#about';$('detailNext').textContent='MEET THE MAKER → ABOUT';
   $('detailSections').replaceChildren();
   if((isLog&&window.StudioEntries.log[index])||(!isLog&&index===0)){
     $('detailSections').innerHTML=isLog?window.StudioEntries.log[index]:window.StudioEntries.visual;
     prepareAuthoredEntry();
   }else if(isLog){
     const wrap=document.createElement('section');wrap.className='detail-section';wrap.innerHTML='<h2>EMPTY LOG SLOT</h2><div class="empty-slot">DETAILS WILL BE ADDED LATER</div>';$('detailSections').append(wrap);
   }else{
     ['01 / WORK','02 / CONCEPT','03 / INTRO'].forEach(title=>{const s=document.createElement('section');s.className='detail-section';const h=document.createElement('h2');h.textContent=title;const p=document.createElement('div');p.className='empty-slot';p.textContent='CONTENT EMPTY';s.append(h,p);$('detailSections').append(s);});
   }
   $('dataStrip').hidden=isLog;$('detailScroll').scrollTop=0;requestAnimationFrame(updateStrip);
   $('logMascot').hidden=!isLog;detailMascotStarted=performance.now();detailScrollY=0;detailScrollVelocity=0;lastDetailScrollTime=0;lastLogSpark=0;logPileAmount=0;logSparks=[];
 }
 function prepareAuthoredEntry(){
   document.querySelectorAll('[data-scroll-target]').forEach(b=>b.onclick=()=>$(b.dataset.scrollTarget)?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'}));
   const diagrams=[...document.querySelectorAll('.mermaid')];
   if(diagrams.length&&window.mermaid)mermaid.run({nodes:diagrams}).catch(()=>diagrams.forEach(d=>d.classList.add('diagram-fallback')));
 }

 function updateStrip(){
   if(route!=='detail'||mode==='log')return;
   const scroll=$('detailScroll'),sections=[...document.querySelectorAll('.detail-section')],sr=scroll.getBoundingClientRect(),center=sr.height*.44;
   const active=sections.reduce((a,b)=>Math.abs(b.getBoundingClientRect().top-sr.top-center)<Math.abs(a.getBoundingClientRect().top-sr.top-center)?b:a);
   if(!active)return;sections.forEach(s=>s.classList.toggle('current',s===active));
   const w=$('dataStrip').clientWidth,h=$('dataStrip').clientHeight,y=clamp(active.getBoundingClientRect().top-sr.top-60,70,h-75),x=w*.35,end=w*.9;
   const path='M '+x+' 0 V '+(y-60)+' C '+x+' '+(y-20)+' '+end+' '+(y-30)+' '+end+' '+y+' C '+end+' '+(y+30)+' '+x+' '+(y+25)+' '+x+' '+(y+65)+' V '+h;
   $('stripPath').setAttribute('d',path);$('stripShadow').setAttribute('d',path);
 }
 $('detailScroll').addEventListener('scroll',e=>{const y=e.currentTarget.scrollTop,travel=Math.abs(y-detailScrollY);detailScrollVelocity=Math.min(2.4,detailScrollVelocity+travel/38);logPileAmount=Math.min(1,logPileAmount+travel/1450);lastDetailScrollTime=performance.now();detailScrollY=y;updateStrip();},{passive:true});
 function drawTimeline(time,dt){
   const w=mapWidth,h=innerWidth<650?115:132,ratio=timeline.width/w;
   tc.setTransform(ratio,0,0,ratio,0,0);tc.clearRect(0,0,w,h);
   const p=palette(),pos=rotations.log.position,n=notes.length,target=w*.5+Math.sin(pos*.22)*Math.min(140,w*.22);
   if(!mascotPosition)mascotPosition=target;
   mascotPosition+=(target-mascotPosition)*(reduced?1:Math.min(1,dt*10));
   const y=h-30;
   tc.fillStyle=p.dark;tc.fillRect(0,y,w,4);tc.fillStyle=p.cream;tc.fillRect(0,y,w,1);
   tc.font='12px monospace';tc.textAlign='center';
   for(let j=-12;j<=12;j++){const t=Math.floor(pos)+j,x=mascotPosition+(t-pos)*80;tc.fillStyle='#758e83';tc.fillRect(x,y-9,1,17);for(let k=1;k<4;k++)tc.fillRect(x+k*20,y-3,1,7);}
   [...$('timelineTicks').children].forEach((b,i)=>{const x=mascotPosition+E.offset(i,pos,n)*80;b.style.left=x+'px';b.hidden=x<20||x>w-20;b.setAttribute('aria-current',String(i===index));});
   timeline.setAttribute('aria-valuenow',String(index+1));timeline.setAttribute('aria-valuetext',notes[index].date+' — '+notes[index].title);
   const x=mascotPosition;
   function r(a,b,c,d,color){tc.fillStyle=color;tc.fillRect(Math.round(a),Math.round(b-4),c,d);}
   // The keeper, joined hemispheres, a continuous rod, and paper flowers.
   r(x-9,y-39,18,19,p.teal);r(x-7,y-54,14,16,p.cream);r(x-7,y-57,14,4,p.dark);r(x-4,y-47,2,2,p.dark);r(x+3,y-47,2,2,p.dark);
   for(let row=-16;row<=16;row+=2){const half=Math.floor(Math.sqrt(256-row*row));r(x-half,y-14+row,half,2,p.teal);r(x,y-14+row,half,2,p.dark);}
   r(x-1,y-30,3,33,p.yellow);r(x-12,y-25,5,3,p.cream);
   r(x-16,y-33,5,19,p.cream);r(x+11,y-33,5,19,p.cream);r(x-11,y-15,7,4,p.cream);r(x+4,y-15,7,4,p.cream);
   colors.slice(0,5).forEach((c,i)=>r(x-9+i*4,y-60-(i%2)*4,4,4,c));
   if(!reduced&&Math.abs(rotations.log.velocity)>.025&&time-lastBurst>70){lastBurst=time;for(let i=0;i<Math.min(12,3+Math.floor(Math.abs(rotations.log.velocity)*2));i++)particles.push({x,y:y-59,vx:(Math.random()-.5)*90,vy:-35-Math.random()*90,life:.65+Math.random()*.3,c:colors[i%7]});}
   particles=particles.filter(p=>p.life>0);particles.forEach(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=120*dt;tc.globalAlpha=Math.min(1,p.life*2);r(p.x,p.y,3,3,p.c);});tc.globalAlpha=1;
 }
 function drawArtPreview(time){
   const c=document.querySelector('.live-art canvas');if(!c)return;const g=c.getContext('2d'),w=c.width,h=c.height,cell=10,t=time*.002;
   g.fillStyle='#090d18';g.fillRect(0,0,w,h);
   const palette=['#1c2030','#485478','#8ca0b4','#dcc878','#f07850'];
   for(let x=0;x<w;x+=cell)for(let y=0;y<h;y+=cell){const nx=x/w,ny=y/h,v=(Math.sin(nx*7+t*2+ny*2)+Math.cos(ny*9-t*1.5+nx*3)+Math.sin((nx+ny)*11+t*3)+3)/6;g.fillStyle=palette[Math.min(palette.length-1,Math.floor(v*palette.length))];g.fillRect(x,y,cell,cell);}
   g.globalAlpha=.45;g.fillStyle='#eaf5ff';for(let i=0;i<12;i++){const x=(w-((time*.03*(i%4+1)+i*37)%w));g.fillRect(x,(i*47)%h,10+(i%3)*7,2);}g.globalAlpha=1;
   g.fillStyle='#080b10aa';for(let y=0;y<h;y+=4)g.fillRect(0,y,w,1);
 }
 function makeFeedbackMessage(item){
   const card=document.createElement('article');card.className='feedback-message';
   const head=document.createElement('header'),name=document.createElement('strong'),date=document.createElement('time'),body=document.createElement('p');name.textContent=item.name;date.textContent=new Date(item.createdAt).toLocaleString([], {dateStyle:'medium',timeStyle:'short'});body.textContent=item.message;head.append(name,date);card.append(head,body);
   if(item.reply){const reply=document.createElement('div');reply.className='feedback-reply';const who=document.createElement('strong');who.textContent='QUELLA REPLIED';const text=document.createElement('p');text.textContent=item.reply;reply.append(who,text);card.append(reply);}
   return card;
 }
 // GitHub Pages stores visitor notes on this device; it has no server API.
 const feedbackStorageKey='quella-living-studio-notes';
 function readLocalFeedback(){
   try{return JSON.parse(localStorage.getItem(feedbackStorageKey)||'[]');}catch{return [];}
 }
 async function loadFeedback(force=false){
   if(feedbackLoaded&&!force)return;
   const list=$('feedbackList');feedbackOwner=false;feedbackLoaded=true;list.replaceChildren();
   const comments=readLocalFeedback();
   if(!comments.length){const empty=document.createElement('p');empty.className='feedback-empty';empty.textContent='Leave a personal note here. Notes are saved in this browser and are not sent to Quella.';list.append(empty);}
   else comments.forEach(item=>list.append(makeFeedbackMessage(item)));
   $('feedbackConnection').textContent='PERSONAL NOTES · THIS BROWSER';
 }
 $('feedbackForm').addEventListener('submit',async e=>{
   e.preventDefault();const name=$('feedbackName').value.trim(),message=$('feedbackMessage').value.trim();if(!name||!message)return;
   try{const comments=readLocalFeedback();comments.unshift({id:Date.now(),name,message,createdAt:new Date().toISOString()});localStorage.setItem(feedbackStorageKey,JSON.stringify(comments));$('feedbackMessage').value='';$('feedbackStatus').textContent='NOTE SAVED IN THIS BROWSER ✦';await loadFeedback(true);}
   catch{$('feedbackStatus').textContent='COULD NOT SAVE · YOUR DRAFT IS SAFE';}
 });
 const tinyNotes=['You found a quiet corner. Stay as long as you need.','A half-finished idea is still alive. Keep it warm.','Today’s tiny quest: notice one beautiful accident.','Your save file contains more courage than you remember.','Some doors only appear after you stop looking for them.'];let noteIndex=0,noteTimer=0;
 function revealNote(next=false){clearInterval(noteTimer);if(next)noteIndex=(noteIndex+1)%tinyNotes.length;const text=tinyNotes[noteIndex],out=$('noteText');out.textContent='';$('noteEnvelope').setAttribute('aria-expanded','true');$('surpriseNote').classList.add('open');let i=0;noteTimer=setInterval(()=>{out.textContent=text.slice(0,++i);if(i>=text.length)clearInterval(noteTimer);},28);}
 $('noteEnvelope').onclick=()=>revealNote(false);$('anotherNote').onclick=()=>revealNote(true);
 function resetMiniGame(){mini={x:42,y:270,vx:0,vy:0,score:0,won:false,stars:[{x:210,y:252},{x:400,y:214},{x:555,y:270}]};$('gameScore').textContent='STARS 0 / 3';}
 $('restartGame').onclick=resetMiniGame;
 function drawMiniGame(t,dt){
   const c=$('miniGame'),g=c.getContext('2d'),w=c.width,h=c.height;if(!w||!h)return;const left=keys.has('arrowleft')||keys.has('a'),right=keys.has('arrowright')||keys.has('d');mini.vx+=(Number(right)-Number(left))*720*dt;mini.vx*=Math.pow(.0008,dt);mini.x=clamp(mini.x+mini.vx*dt,18,690);mini.vy+=900*dt;mini.y+=mini.vy*dt;if(mini.y>286){mini.y=286;mini.vy=0;}
   g.fillStyle='#151448';g.fillRect(0,0,w,h);const sky=g.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#171651');sky.addColorStop(1,'#63357d');g.fillStyle=sky;g.fillRect(0,0,w,h);
   for(let i=0;i<70;i++){g.globalAlpha=.25+.75*(.5+.5*Math.sin(t*.002+i));g.fillStyle=i%9?'#fff':'#7eeaff';g.fillRect((i*97)%w,18+(i*43)%180,i%13?2:4,i%13?2:4);}g.globalAlpha=1;
   g.fillStyle='#183a36';g.fillRect(0,314,w,46);g.fillStyle='#6ec58d';g.fillRect(0,310,w,6);for(let x=0;x<w;x+=32){g.fillStyle=x%64?'#2b5e48':'#254b42';g.fillRect(x,320,30,22);}
   for(const [x,y] of [[150,248],[310,224],[470,260]]){g.fillStyle='#e4a84b';g.fillRect(x,y,58,18);g.fillStyle='#ffe27c';g.fillRect(x+4,y+4,50,3);g.fillStyle='#5b2d43';g.fillRect(x,y+16,58,4);}
   g.fillStyle='#317d6b';g.fillRect(590,266,44,44);g.fillStyle='#5fc59c';g.fillRect(584,258,56,12);
   mini.stars.forEach(s=>{if(s.got)return;const bob=Math.sin(t*.006+s.x)*5;g.fillStyle='#ffe572';g.fillRect(s.x-3,s.y-10+bob,7,23);g.fillRect(s.x-11,s.y-3+bob,23,7);g.fillStyle='#fff5b5';g.fillRect(s.x-3,s.y-3+bob,7,7);if(Math.hypot(mini.x-s.x,mini.y-s.y)<28){s.got=true;mini.score++;$('gameScore').textContent='STARS '+mini.score+' / 3';}});
   g.fillStyle='#e9e4cf';g.fillRect(665,205,5,105);g.fillStyle='#ff5f9e';g.fillRect(670,208,32,21);g.fillStyle='#ffe070';g.fillRect(674,213,12,5);
   const bob=Math.sin(t*.018)*2;g.fillStyle='#e9e4cf';g.fillRect(mini.x-8,mini.y-24+bob,16,12);g.fillStyle='#ff6aa7';g.fillRect(mini.x-10,mini.y-28+bob,20,5);g.fillStyle='#2bd5c3';g.fillRect(mini.x-9,mini.y-12+bob,18,15);g.fillStyle='#15283a';g.fillRect(mini.x-9,mini.y+3,7,8);g.fillRect(mini.x+2,mini.y+3,7,8);
   if(mini.x>650&&!mini.won){mini.won=true;$('gameScore').textContent=mini.score===3?'ALL STARS · FLAG FOUND!':'FLAG FOUND · '+mini.score+' STARS';}if(mini.won){g.fillStyle='#090a22dd';g.fillRect(185,95,350,92);g.strokeStyle='#ffe572';g.strokeRect(185,95,350,92);g.fillStyle='#fff';g.textAlign='center';g.font='22px monospace';g.fillText('COURSE CLEAR ✦',360,132);g.font='13px monospace';g.fillText(mini.score===3?'PERFECT STAR RUN!':'YOU FOUND THE EAST FLAG',360,160);}
  }
 addEventListener('keydown',e=>{
   const k=e.key.toLowerCase();
   if(k==='escape'){if(route==='detail')navigate(mode);else if(route!=='home')navigate('home');else{E.cancel(player);$('mapStatus').textContent='WALK CANCELLED';}return;}
   if(e.target.closest('input,textarea,select')||busy)return;
   if(route==='secret-east'&&['arrowleft','arrowright','a','d','w',' '].includes(k)){e.preventDefault();keys.add(k);if((k==='w'||k===' ')&&mini.y>=285)mini.vy=-430;return;}
   if((k==='enter'||k===' ')&&e.target.closest('button,a'))return;
   if(route==='home'){
     if(['w','a','s','d','arrowleft','arrowright','arrowup','arrowdown'].includes(k)){e.preventDefault();keys.add(k);}
     if(k==='enter'&&!e.repeat){const near=E.destinations.find(d=>Math.hypot(player.x-d.x,player.y-d.y-17)<24);if(near)chooseDestination(near.id);}
   }else if(route==='log'){if(k==='arrowleft'){e.preventDefault();stepCard(-1);}if(k==='arrowright'){e.preventDefault();stepCard(1);}if(k==='enter'&&!e.repeat){e.preventDefault();openCard();}}
 });
 addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>{keys.clear();mapPointer=null;cardPointer=null;});document.addEventListener('visibilitychange',()=>{keys.clear();lastTime=0;});
 addEventListener('resize',fit);

 function fitAbout(){
   const ratio=Math.min(devicePixelRatio||1,2);
   for(const id of ['starfield']){const c=$(id),box=c.getBoundingClientRect();if(box.width){c.width=Math.round(box.width*ratio);c.height=Math.round(box.height*ratio);}}
 }
 function fitAtmospheres(){
   const ratio=Math.min(devicePixelRatio||1,2),fc=$('feedbackStars'),lm=$('logMascot');
   fc.width=Math.round(mapWidth*ratio);fc.height=Math.round(mapHeight*ratio);
   lm.width=Math.round((innerWidth<800?108:158)*ratio);lm.height=Math.round(Math.max(180,mapHeight-55)*ratio);
 }
 const stars=Array.from({length:360},(_,i)=>({x:((i*137.508)%1000)/1000,y:((i*317.19)%1000)/1000,r:i%13===0?2:1,phase:i*1.7,speed:.6+(i%9)*.19,glitch:i%11===0,color:i%17===0?'#ff9de4':i%11===0?'#8fd8ff':i%7===0?'#bda7ff':'#ffffff'}));
 function drawAbout(t){
   const c=$('starfield'),g=c.getContext('2d'),w=c.width,h=c.height;
   g.fillStyle='#02031a';g.fillRect(0,0,w,h);
   [[.22,.24,'#6936a455'],[.72,.46,'#244cb755'],[.5,.9,'#be3d9633']].forEach(([x,y,color],i)=>{const gr=g.createRadialGradient(x*w,y*h,0,x*w,y*h,Math.max(w,h)*(.34+i*.04));gr.addColorStop(0,color);gr.addColorStop(1,'#02031a00');g.fillStyle=gr;g.fillRect(0,0,w,h);});
   stars.forEach(s=>{const pulse=.5+.5*Math.sin(t*.001*s.speed+s.phase),jump=!reduced&&s.glitch&&Math.sin(t*.021+s.phase)>.92?Math.sin(t*.08+s.phase)*8:0;g.globalAlpha=reduced?.72:.12+.88*pulse;g.fillStyle=s.glitch?'hsl('+((t*.04+s.phase*60)%360)+',90%,78%)':s.color;const x=Math.floor(s.x*w+jump),y=Math.floor(s.y*h),r=(s.r+.7*pulse)*1.35;g.fillRect(x,y,r,r);if(s.r===2){g.fillRect(x-4,y+1,11,1);g.fillRect(x+1,y-4,1,11);if(jump){g.fillStyle='#ff54b8';g.fillRect(x-7,y,4,1);g.fillStyle='#54eaff';g.fillRect(x+7,y,4,1);}}});g.globalAlpha=1;
 }
 const feedbackStars=Array.from({length:360},(_,i)=>({x:((i*191.73)%1000)/1000,y:((i*83.17)%1000)/1000,r:i%17===0?2:1,phase:i*.91,speed:.7+(i%8)*.21,glitch:i%10===0,color:i%13===0?'#8ff4ff':i%11===0?'#ff8bd5':i%19===0?'#ffe277':'#ffffff'}));
 function drawFeedbackStars(t){
   const c=$('feedbackStars'),g=c.getContext('2d'),w=c.width,h=c.height;if(!w||!h)return;g.fillStyle='#02031a';g.fillRect(0,0,w,h);
   [[.18,.18,'#6e35b255'],[.82,.35,'#1d5dc455'],[.46,.82,'#bc3b9938']].forEach(([x,y,color],i)=>{const gr=g.createRadialGradient(x*w,y*h,0,x*w,y*h,Math.max(w,h)*(.32+i*.035));gr.addColorStop(0,color);gr.addColorStop(1,'#02031a00');g.fillStyle=gr;g.fillRect(0,0,w,h);});
   feedbackStars.forEach(s=>{const pulse=.5+.5*Math.sin(t*.0014*s.speed+s.phase),jump=!reduced&&s.glitch&&Math.sin(t*.024+s.phase)>.9?Math.sin(t*.09+s.phase)*9:0;g.globalAlpha=reduced?.75:.1+.9*pulse;g.fillStyle=s.glitch?'hsl('+((t*.05+s.phase*70)%360)+',92%,76%)':s.color;const x=Math.floor(s.x*w+jump),y=Math.floor(s.y*h),r=(s.r+.6*pulse)*(devicePixelRatio||1);g.fillRect(x,y,r,r);if(s.r>1&&pulse>.68){g.fillRect(x-r*2,y+r/2,r*5,1);g.fillRect(x+r/2,y-r*2,1,r*5);if(jump){g.fillStyle='#ff4fae';g.fillRect(x-8,y,5,1);g.fillStyle='#55efff';g.fillRect(x+8,y,5,1);}}});g.globalAlpha=1;
 }
 function drawLogMascot(t){
   const c=$('logMascot'),g=c.getContext('2d'),ratio=Math.min(devicePixelRatio||1,2),w=c.width/ratio,h=c.height/ratio;if(!w||!h)return;g.setTransform(ratio,0,0,ratio,0,0);g.clearRect(0,0,w,h);
   const s=innerWidth<800?.72:1.06,x=w*.5,y=118*s,settle=reduced?1:clamp((t-detailMascotStarted)/520,0,1),pileColors=['#ef76bf','#8ee8ff','#bba5ff','#ffe59a','#72cdb5','#ffffff'];
   const pileHeight=logPileAmount*(innerWidth<800?15:22),pileWidth=(innerWidth<800?62:92)*(0.35+logPileAmount*.65),pileTop=h-5-pileHeight;
   for(let py=h-5;py>=pileTop;py-=5)for(let px=(w-pileWidth)/2;px<(w+pileWidth)/2;px+=6){const slope=1-Math.abs(px-w/2)/(pileWidth/2),allowed=h-5-pileHeight*slope,hash=Math.abs(Math.sin(px*12.9898+py*78.233))*43758.5453;if(py>=allowed&&hash%1>.2){g.globalAlpha=.5+(hash%1)*.5;g.fillStyle=pileColors[Math.floor(hash)%pileColors.length];g.fillRect(px,py,4,4);}}
   g.globalAlpha=1;detailScrollVelocity*=.9;const scrolling=t-lastDetailScrollTime<360,interval=150-Math.min(95,detailScrollVelocity*36);
   if(!reduced&&scrolling&&t-lastLogSpark>Math.max(42,interval)){lastLogSpark=t;const amount=2+Math.floor(detailScrollVelocity*1.5);for(let i=0;i<amount;i++)logSparks.push({x:x+(Math.random()-.5)*28*s,y:y-96*s,vx:(Math.random()-.5)*(38+detailScrollVelocity*24),vy:-55-Math.random()*(45+detailScrollVelocity*35),life:.9+Math.random()*.7,c:pileColors[(Math.random()*pileColors.length)|0]});}
   logSparks=logSparks.filter(p=>p.life>0&&p.y<h+10);for(const p of logSparks){p.life-=.016;p.x+=p.vx*.016;p.y+=p.vy*.016;p.vy+=105*.016;g.globalAlpha=Math.min(1,p.life*1.8);g.fillStyle=p.c;const size=p.life>.55?5:3;g.fillRect(Math.round(p.x),Math.round(p.y),size,size);if(p.life>.7){g.fillRect(Math.round(p.x-4),Math.round(p.y+2),3,1);g.fillRect(Math.round(p.x+size+1),Math.round(p.y+2),3,1);}}
   g.globalAlpha=1;const period=430-Math.min(290,detailScrollVelocity*95),typingFrame=reduced?0:Math.floor(t/Math.max(95,period))%2;g.save();g.translate(0,(1-settle)*-18);g.scale(1,.84+.16*settle);drawTypingKeeper(g,x,y,s,palette(),typingFrame);g.restore();
 }
 timeline.addEventListener('pointerdown',e=>{railPointer={x:e.clientX,start:rotations.log.target,id:e.pointerId};lastInput=performance.now();timeline.setPointerCapture(e.pointerId);});
 timeline.addEventListener('pointermove',e=>{const b=timeline.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top,near=Math.abs(x-mascotPosition)<30&&y>b.height-105;$('staticTip').classList.toggle('show',near);if(!railPointer)return;rotations.log.target=railPointer.start+(e.clientX-railPointer.x)/80;lastInput=performance.now();});
 timeline.addEventListener('pointerleave',()=>$('staticTip').classList.remove('show'));
 timeline.addEventListener('pointerup',()=>{railPointer=null;});timeline.addEventListener('pointercancel',()=>{railPointer=null;});
 function frame(t){
   const dt=lastTime?Math.min(.05,(t-lastTime)/1000):.016;lastTime=t;
   if(!document.hidden){
     if(route==='home')drawMap(t,dt);
     else if(route==='log'){
       const idle=!reduced&&hovered===null&&!cardPointer&&!railPointer&&t-lastInput>2400?.09:0;
       E.advance(rotations[mode],dt,idle);layoutCards();if(route==='log')drawTimeline(t,dt);else drawArtPreview(t);
     }else if(route==='about')drawAbout(t);
     else if(route==='feedback')drawFeedbackStars(t);
     else if(route==='detail'&&mode==='log')drawLogMascot(t);
     // The east-flag world runs inside its own canvas document.
   }requestAnimationFrame(frame);
 }
 const initial=location.hash.slice(1);navigate(validRoute(initial)&&initial!=='detail'?initial:'home',false);fit();requestAnimationFrame(frame);
})();
