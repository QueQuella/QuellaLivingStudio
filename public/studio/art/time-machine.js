// Retro Time Machine — pixel-pattern time travel. Artwork by Quella.
let palette, gridSize=8, cols, rows, t=0, warp=0, targetWarp=0, stars=[], scanY=0;
function setup(){
 const c=createCanvas(650,480);c.parent('art');c.elt.tabIndex=0;c.elt.setAttribute('aria-label','Retro Time Machine. Click or press Space to toggle time warp.');
 pixelDensity(1);noSmooth();cols=floor(width/gridSize);rows=floor(height/gridSize);
 palette=[color(11,12,16),color(28,32,48),color(72,84,120),color(140,160,180),color(220,200,120),color(240,120,80)];
 for(let i=0;i<60;i++)stars.push({x:random(width),y:random(height),z:random(.2,1)});
 document.getElementById('status').hidden=true;
}
function draw(){warp=lerp(warp,targetWarp,.05);t+=.01+warp*.35;drawBackground();drawPixelField();drawStars();drawScanlines();drawHUD();}
function drawBackground(){for(let y=0;y<height;y+=2){let n=noise(y*.01,t*.2);let c=lerpColor(palette[0],palette[1],n*.8);stroke(c);line(0,y,width,y);}}
function drawPixelField(){noStroke();for(let i=0;i<cols;i++){for(let j=0;j<rows;j++){
 let x=i*gridSize,y=j*gridSize,nx=i/cols,ny=j/rows;
 let w1=sin(nx*6+t*2+ny*2),w2=cos(ny*8-t*1.5+nx*3),w3=sin((nx+ny)*10+t*3);
 let v=(w1+w2+w3)/3;v=(v+1)/2;v=pow(v,1+warp*2);
 let idx=floor(v*(palette.length-1)),c=palette[idx];if(random()<.0008+warp*.002)c=palette[5];fill(c);rect(x,y,gridSize,gridSize);
}}}
function drawStars(){noStroke();for(let s of stars){let speed=1+warp*40;s.x-=speed*s.z;if(s.x<0){s.x=width;s.y=random(height);s.z=random(.2,1);}let len=2+warp*30*s.z;fill(220,220,255,120+warp*135);rect(s.x,s.y,len,1+s.z);}}
function drawScanlines(){noStroke();fill(0,0,0,40);for(let y=0;y<height;y+=3)rect(0,y,width,1);scanY=(scanY+1+warp*4)%height;fill(255,255,255,8);rect(0,scanY,width,40);}
function drawHUD(){noStroke();fill(220,200,120,220);textFont('monospace');textSize(12);textAlign(LEFT,TOP);let displayYear=floor(1970+t*12+warp*900);text('YEAR '+displayYear,12,12);textAlign(RIGHT,TOP);text(warp>.05?'TIME WARP ACTIVE':'PRESS SPACE',width-12,12);}
function keyPressed(){if(key===' '){targetWarp=targetWarp>.5?0:1;return false;}}
function mousePressed(){if(mouseX>=0&&mouseX<width&&mouseY>=0&&mouseY<height)targetWarp=targetWarp>.5?0:1;}
