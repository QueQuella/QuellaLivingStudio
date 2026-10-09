(() => {
 const root='./assets/week05/';
 window.LogCovers=[root+'programming-dream.png',root+'ai-art.jpg',root+'internet-art.jpeg',root+'algorithm-map.png'];
 window.IdeaDeck={enter(){document.getElementById('ideaTitle').focus({preventScroll:true});}};
 document.addEventListener('click',e=>{const a=e.target.closest('[data-log-slot]');if(!a)return;setTimeout(()=>{const btn=document.querySelector('.archive-card[data-index="'+a.dataset.logSlot+'"][data-cycle="0"]');btn?.click();},60);});
})();
