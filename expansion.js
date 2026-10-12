(() => {
 const root='./assets/week05/';
 window.LogCovers=[root+'programming-dream.png',root+'ai-art.jpg',root+'internet-art.jpeg',root+'algorithm-map.png'];
 const presentation=document.getElementById('ideaSettings');
 const index=presentation.querySelector('.dream-index');
 const links=[...index.querySelectorAll('[data-dream-slide]')];
 const slides=links.map(link=>document.getElementById('dream-'+link.dataset.dreamSlide).closest('.dream-section'));
 function markSlide(selected){links.forEach((link,i)=>{if(i===selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}
 function topOffset(){return matchMedia('(max-width:760px)').matches?index.offsetHeight+12:24;}
 function updateIndex(){
  const boundary=presentation.getBoundingClientRect().top+topOffset()+30;
  let selected=0;
  slides.forEach((slide,i)=>{if(slide.getBoundingClientRect().top<=boundary)selected=i;});
  if(presentation.scrollTop>0&&presentation.scrollTop+presentation.clientHeight>=presentation.scrollHeight-2)selected=slides.length-1;
  markSlide(selected);
 }
 let queued=false;
 presentation.addEventListener('scroll',()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;updateIndex();});},{passive:true});
 links.forEach((link,i)=>link.addEventListener('click',e=>{
  e.preventDefault();
  const heading=slides[i].querySelector('h2');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
  const top=presentation.scrollTop+slides[i].getBoundingClientRect().top-presentation.getBoundingClientRect().top-topOffset();
  presentation.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  markSlide(i);
 }));
 window.IdeaDeck={enter(){document.getElementById('ideaTitle').focus({preventScroll:true});requestAnimationFrame(updateIndex);}};
 window.addEventListener('resize',()=>{if(!presentation.hidden)updateIndex();});
 markSlide(0);
 document.addEventListener('click',e=>{const a=e.target.closest('[data-log-slot]');if(!a)return;setTimeout(()=>{const btn=document.querySelector('.archive-card[data-index="'+a.dataset.logSlot+'"][data-cycle="0"]');btn?.click();},60);});
})();
