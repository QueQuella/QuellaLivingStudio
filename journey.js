(() => {
 'use strict';
 const viewport=document.getElementById('journeyViewport'),world=document.getElementById('journeyWorld'),collection=document.getElementById('journeyCollection'),collections=[...document.querySelectorAll('.journey-frame-target')],frame=document.getElementById('journeyArtwork'),frame2=document.getElementById('journeyPart2'),locate=document.getElementById('journeyLocate');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let entered=false,drag=null,active=false;
 function view(smooth=true){
  const anchor=document.getElementById('journeyCollection02');
  const displayedWidth=anchor.offsetWidth*.667;
  viewport.scrollTo({left:anchor.offsetLeft-(viewport.clientWidth-displayedWidth)/2,top:Math.max(0,anchor.offsetTop-230),behavior:smooth&&!reduced?'smooth':'instant'});
 }
 locate.addEventListener('click',()=>view(false));
 const visibleCollections=new Set();
 const collectionObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>entry.isIntersecting?visibleCollections.add(entry.target):visibleCollections.delete(entry.target));locate.hidden=!active||visibleCollections.size>0;},{root:viewport,threshold:.08});
 collections.forEach(item=>collectionObserver.observe(item));
 document.querySelectorAll('.ref-media img').forEach(img=>{const fallback=()=>img.closest('.ref-media')?.classList.add('is-fallback');img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback();});
 document.getElementById('journeyReload').onclick=()=>{frame.src=frame.dataset.src;};
 document.getElementById('journeyReload2').onclick=()=>{frame2.src=frame2.dataset.src;};
 frame.addEventListener('pointerenter',()=>{const cursor=document.getElementById('magicCursor');if(cursor)cursor.style.opacity='0';});
 frame.addEventListener('pointerleave',()=>{const cursor=document.getElementById('magicCursor');if(cursor)cursor.style.opacity='1';});
 frame2.addEventListener('pointerenter',()=>{const cursor=document.getElementById('magicCursor');if(cursor)cursor.style.opacity='0';});
 frame2.addEventListener('pointerleave',()=>{const cursor=document.getElementById('magicCursor');if(cursor)cursor.style.opacity='1';});
 viewport.addEventListener('pointerdown',e=>{
  if(e.pointerType==='touch'||e.button!==0||e.target.closest('.j-window,a,button'))return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
  viewport.setPointerCapture(e.pointerId);viewport.classList.add('is-dragging');e.preventDefault();viewport.focus({preventScroll:true});
 });
 viewport.addEventListener('pointermove',e=>{if(!drag)return;viewport.scrollLeft=drag.left-(e.clientX-drag.x);viewport.scrollTop=drag.top-(e.clientY-drag.y);});
 function end(){drag=null;viewport.classList.remove('is-dragging');}
 viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('lostpointercapture',end);window.addEventListener('blur',end);
 window.addEventListener('keydown',e=>{
  if(!active||e.target.closest('button,a,input,textarea,select'))return;
  const delta={ArrowLeft:[-90,0],ArrowRight:[90,0],ArrowUp:[0,-90],ArrowDown:[0,90] }[e.key];
  if(delta){e.preventDefault();viewport.scrollBy({left:delta[0],top:delta[1],behavior:'instant'});}
 });
 window.addEventListener('resize',()=>{if(active)view(false);});
 const sparkles=world.querySelector('.journey-sparkles');
 for(let i=0;i<650;i++){const star=document.createElement('i');star.style.cssText=`left:${(i*137.51)%100}%;top:${22+(i*83.17)%76}%;--star:${1+i%3}px;animation-delay:${-(i%17)*.31}s;animation-duration:${1.8+i%6*.55}s`;sparkles.append(star);}
 window.VisualJourney={enter(){active=true;frame.src=frame.dataset.src;frame2.src=frame2.dataset.src;if(!entered){entered=true;view(false);setTimeout(()=>{if(active)view(false);},900);}},leave(){active=false;locate.hidden=true;end();frame.removeAttribute('src');frame2.removeAttribute('src');const cursor=document.getElementById('magicCursor');if(cursor)cursor.style.opacity='1';}};
})();
