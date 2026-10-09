(function(root){
 'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const destinations=[
 {id:'visual',title:'VISUAL JOURNEY',x:600,y:186,w:96,h:100,kind:'tower'},
 {id:'about',title:'ABOUT',x:390,y:211,w:86,h:68,kind:'house'},
 {id:'project',title:'PROJECT',x:810,y:208,w:100,h:75,kind:'hall'},
 {id:'log',title:'WORKING LOG',x:488,y:288,w:42,h:46,kind:'save'},
 {id:'idea',title:'IDEA PRESENTATION',x:724,y:291,w:29,h:32,kind:'sign'},
 {id:'feedback',title:'FEEDBACK',x:933,y:244,w:28,h:36,kind:'mail'},
 {id:'secret-west',title:'SURPRISE NOTE',x:66,y:233,w:30,h:65,kind:'flag'},
 {id:'secret-east',title:'SUPER QUELLA',x:1134,y:237,w:30,h:65,kind:'flag'}];
 function createWorld(){return {x:600,y:273,target:null,queued:null,arrived:null,moving:false};}
 function walkTo(s,x,y,id=null){
   if(id&&!destinations.some(d=>d.id===id))return;
   s.target={x:clamp(x,30,1170),y:clamp(y,220,326)};
   if(id){const d=destinations.find(d=>d.id===id);s.target={x:d.x,y:d.y+17};}
   s.queued=id;s.arrived=null;
 }
 function cancel(s){s.target=null;s.queued=null;s.arrived=null;s.moving=false;}
 function tick(s,dt,dx=0,dy=0){
   dt=clamp(dt,0,.05);
   if(dx||dy){cancel(s);const n=Math.hypot(dx,dy);s.x=clamp(s.x+dx/n*105*dt,30,1170);s.y=clamp(s.y+dy/n*80*dt,220,326);s.moving=true;return null;}
   if(!s.target){s.moving=false;return null;}
   const x=s.target.x-s.x,y=s.target.y-s.y,n=Math.hypot(x,y),step=110*dt;
   if(n<=Math.max(step,.1)){s.x=s.target.x;s.y=s.target.y;s.target=null;s.moving=false;const id=s.queued;s.queued=null;s.arrived=id;return id;}
   s.x+=x/n*step;s.y+=y/n*step;s.moving=true;return null;
 }
 const wrap=(value,count)=>((value%count)+count)%count;
 const offset=(index,position,count)=>wrap(index-position+count/2,count)-count/2;
 function createRotation(position=0){return {position,target:position,velocity:0};}
 function rotate(s,delta){s.target+=delta;}
 function advance(s,dt,idle=0){dt=clamp(dt,0,.05);s.target+=idle*dt;const before=s.position;s.position+=(s.target-s.position)*(1-Math.exp(-10*dt));s.velocity=dt?(s.position-before)/dt:0;return s.position;}
 const api={clamp,destinations,createWorld,walkTo,cancel,tick,wrap,offset,createRotation,rotate,advance};
 if(typeof module!=='undefined')module.exports=api;else root.JourneyEngine=api;
})(typeof window!=='undefined'?window:globalThis);
