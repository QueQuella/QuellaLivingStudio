(() => {
 'use strict';
 const canvas=document.getElementById('beams'),g=canvas.getContext('2d'),cursor=document.getElementById('beamCursor');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let w=0,h=0,dpr=1,time=0,pointer={x:.5,y:.5},last=0,lastSpark=0;
 const beams=Array.from({length:72},(_,i)=>({side:i%2?-1:1,angle:(i*2.399)%1,phase:i*.73,width:1+i%5,speed:.35+(i%9)*.06,hue:i%2?182:350}));
 function fit(){const box=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=box.width;h=box.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);g.setTransform(dpr,0,0,dpr,0,0);}
 function ray(cx,cy,b,t){
  const spread=.18+b.angle*.82,wave=Math.sin(time*b.speed+b.phase)*.11;
  const edgeX=b.side>0?w+80:-80,edgeY=cy+(b.angle-.5)*h*1.7+wave*h;
  const startX=cx+b.side*(10+Math.sin(time*.7+b.phase)*26),startY=cy+Math.cos(time*.53+b.phase)*45;
  const grad=g.createLinearGradient(startX,startY,edgeX,edgeY);grad.addColorStop(0,`hsla(${b.hue},100%,96%,${.32+t*.35})`);grad.addColorStop(.18,`hsla(${b.hue},96%,66%,${.18+t*.2})`);grad.addColorStop(1,`hsla(${b.hue},92%,36%,0)`);
  g.strokeStyle=grad;g.lineWidth=b.width*(.7+t*2.6);g.beginPath();g.moveTo(startX,startY);g.lineTo(edgeX,edgeY);g.stroke();
  if(b.width>3){g.strokeStyle=`hsla(${b.hue+35},100%,90%,${.06+t*.09})`;g.lineWidth=b.width*5;g.beginPath();g.moveTo(startX,startY);g.lineTo(edgeX,edgeY);g.stroke();}
 }
 function frame(now){const dt=Math.min(.05,(now-last)/1000||.016);last=now;if(!reduced)time+=dt;
  const cx=w*(.5+(pointer.x-.5)*.12),cy=h*(.5+(pointer.y-.5)*.16);
  g.globalCompositeOperation='source-over';g.fillStyle='rgba(1,3,12,.22)';g.fillRect(0,0,w,h);
  const left=g.createLinearGradient(0,0,w,0);left.addColorStop(0,'#010725');left.addColorStop(.48,'#00bdc455');left.addColorStop(.5,'#ffffff0a');left.addColorStop(.52,'#ff233344');left.addColorStop(1,'#170002');g.fillStyle=left;g.fillRect(0,0,w,h);
  g.globalCompositeOperation='lighter';beams.forEach((b,i)=>ray(cx,cy,b,.35+.65*Math.sin(time*(.7+b.speed)+b.phase)**2));
  for(let i=0;i<9;i++){const off=(i-4)*5+Math.sin(time*1.3+i)*3;const glow=g.createLinearGradient(cx-38,0,cx+38,0);glow.addColorStop(0,'#68ffff00');glow.addColorStop(.48,i%2?'#ffffff88':'#6dfcff66');glow.addColorStop(.52,i%2?'#ffd8ee88':'#ff627c66');glow.addColorStop(1,'#ff557700');g.fillStyle=glow;g.fillRect(cx-45+off,0,90,h);}
  g.globalCompositeOperation='source-over';g.fillStyle='#fff';for(let i=0;i<28;i++){const x=(i*97+time*80*(i%2?1:-1))%w,y=(i*43+Math.sin(time+i)*h*.3+h)%h;g.globalAlpha=.15+.7*Math.sin(time*2+i)**2;g.fillRect(x,y,1+i%2,1+i%2);}g.globalAlpha=1;requestAnimationFrame(frame);
 }
 addEventListener('resize',fit);addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth;pointer.y=e.clientY/innerHeight;if(e.pointerType==='touch')return;cursor.style.translate=e.clientX+'px '+e.clientY+'px';if(performance.now()-lastSpark<36)return;lastSpark=performance.now();const s=document.createElement('i');s.className='beam-spark';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--x',(Math.random()*16-8)+'px');s.style.setProperty('--y',(8+Math.random()*14)+'px');document.body.append(s);setTimeout(()=>s.remove(),480);});fit();requestAnimationFrame(frame);
})();
