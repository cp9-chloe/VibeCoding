const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
const W=canvas.width=960,H=canvas.height=640;
const COLS=18,ROWS=12,CELL=48;
let state="menu",gold=50,lives=20,waveIndex=0,gameSpeed=1,tick=0;
let enemies=[],towers=[],projectiles=[],particles=[];
let selectedTower=null,hoveredCell=null,deleteMode=false;
let towersUnlocked=8;
const PATH=[{c:0,r:5},{c:1,r:5},{c:2,r:5},{c:3,r:5},{c:4,r:5},{c:5,r:4},{c:6,r:3},{c:7,r:3},{c:8,r:3},{c:9,r:4},{c:10,r:5},{c:11,r:6},{c:12,r:7},{c:13,r:7},{c:14,r:7},{c:15,r:6},{c:16,r:5},{c:17,r:5}];
const pathSet=new Set(PATH.map(p=>p.c+","+p.r));
const TOWER_DEFS=[
  {name:"Arrow",cost:10,range:3,dmg:5,rate:25,color:"#8BC34A",projColor:"#AED581",type:"projectile",desc:"Basic tower",unlockWave:0},
  {name:"Cannon",cost:20,range:2.5,dmg:15,rate:50,color:"#FF9800",projColor:"#FFB74D",type:"projectile",splash:0.8,desc:"Splash damage",unlockWave:0},
  {name:"Ice",cost:25,range:2.5,dmg:3,rate:12,color:"#03A9F4",projColor:"#4FC3F7",type:"projectile",slow:0.5,desc:"Slows enemies",unlockWave:0},
  {name:"Sniper",cost:35,range:6,dmg:40,rate:80,color:"#9C27B0",projColor:"#CE93D8",type:"projectile",desc:"Long range, high dmg",unlockWave:0},
  {name:"Tesla",cost:40,range:2.5,dmg:3,rate:2,color:"#FFEB3B",projColor:"#FFF176",type:"laser",desc:"Laser beam",unlockWave:0},
  {name:"Missile",cost:50,range:3,dmg:50,rate:90,color:"#F44336",projColor:"#EF9A9A",type:"projectile",splash:1.0,desc:"Heavy splash",unlockWave:0},
  {name:"Rapid",cost:15,range:2,dmg:2,rate:6,color:"#4CAF50",projColor:"#81C784",type:"projectile",desc:"Fast fire, low dmg",unlockWave:0},
  {name:"Poison",cost:30,range:2.5,dmg:2,rate:30,color:"#795548",projColor:"#A1887F",type:"projectile",dot:1,desc:"Damage over time",unlockWave:0},
  {name:"Laser++",cost:60,range:3,dmg:5,rate:1,color:"#E040FB",projColor:"#EA80FC",type:"laser",desc:"Stronger laser",unlockWave:5},
  {name:"Arrow+",cost:20,range:3.5,dmg:10,rate:20,color:"#689F38",projColor:"#9CCC65",type:"projectile",desc:"Improved arrow",unlockWave:5},
  {name:"Cannon+",cost:35,range:3,dmg:25,rate:40,color:"#E65100",projColor:"#FF8A65",type:"projectile",splash:1.0,desc:"Bigger splash",unlockWave:5},
  {name:"Frost",cost:40,range:2.5,dmg:5,rate:10,color:"#00BCD4",projColor:"#4DD0E1",type:"projectile",slow:0.7,desc:"Strong slow",unlockWave:5},
  {name:"Railgun",cost:70,range:7,dmg:80,rate:100,color:"#7B1FA2",projColor:"#BA68C8",type:"laser",desc:"Long range laser",unlockWave:5},
  {name:"Napalm",cost:55,range:2.5,dmg:8,rate:20,color:"#BF360C",projColor:"#FF8A65",type:"projectile",dot:3,desc:"Burns enemies",unlockWave:5},
  {name:"Minigun",cost:25,range:2,dmg:1,rate:3,color:"#388E3C",projColor:"#66BB6A",type:"projectile",desc:"Insane fire rate",unlockWave:5},
  {name:"Gauss",cost:80,range:8,dmg:120,rate:120,color:"#4A148C",projColor:"#9C27B0",type:"laser",desc:"Ultimate sniper",unlockWave:10},
  {name:"Plasma",cost:75,range:3,dmg:12,rate:5,color:"#00BFA5",projColor:"#64FFDA",type:"projectile",splash:1.2,desc:"Plasma splash",unlockWave:10},
  {name:"Cryo",cost:50,range:3,dmg:6,rate:8,color:"#80DEEA",projColor:"#B2EBF2",type:"projectile",slow:0.9,desc:"Freezes enemies",unlockWave:10},
  {name:"Venom",cost:60,range:2.5,dmg:4,rate:15,color:"#33691E",projColor:"#7CB342",type:"projectile",dot:5,desc:"Deadly poison",unlockWave:10},
  {name:"Storm",cost:65,range:3,dmg:8,rate:12,color:"#1565C0",projColor:"#42A5F5",type:"laser",desc:"Chain lightning",unlockWave:10},
  {name:"Mortar",cost:45,range:4,dmg:30,rate:60,color:"#5D4037",projColor:"#8D6E63",type:"projectile",splash:1.5,desc:"Long range splash",unlockWave:10},
  {name:"Vortex",cost:90,range:3,dmg:15,rate:8,color:"#AA00FF",projColor:"#D500F9",type:"laser",desc:"Devastating beam",unlockWave:15},
  {name:"Mega",cost:100,range:4,dmg:200,rate:150,color:"#D50000",projColor:"#FF1744",type:"projectile",splash:2.0,desc:"Mega cannon",unlockWave:15},
  {name:"Blaze",cost:70,range:2.5,dmg:10,rate:6,color:"#FF6D00",projColor:"#FF9E80",type:"projectile",dot:8,desc:"Inferno burn",unlockWave:15},
  {name:"Shard",cost:55,range:3,dmg:7,rate:5,color:"#00E5FF",projColor:"#84FFFF",type:"projectile",slow:0.95,desc:"Crystal freeze",unlockWave:15},
  {name:"Pulse",cost:85,range:3.5,dmg:20,rate:10,color:"#6200EA",projColor:"#B388FF",type:"laser",desc:"Pulse laser",unlockWave:15},
  {name:"Omega",cost:150,range:5,dmg:300,rate:180,color:"#212121",projColor:"#FFD740",type:"projectile",splash:3.0,desc:"Ultimate tower",unlockWave:20},
  {name:"Divine",cost:200,range:4,dmg:25,rate:3,color:"#FFD700",projColor:"#FFF8E1",type:"laser",desc:"God beam",unlockWave:20}
];
function waveEnemies(w){
  let n=5+w*3,hp=30+w*20;
  let arr=[];
  for(let i=0;i<n;i++){
    let tier=w>=15?3:w>=10?2:w>=5?1:0;
    let s=1+tier*0.3;
    arr.push({hp:Math.floor(hp*s),maxHp:Math.floor(hp*s),speed:1+tier*0.2,reward:2+tier});
  }
  return arr;
}
function spawnWave(){
  let defs=waveEnemies(waveIndex);
  let delay=0;
  for(let d of defs){
    setTimeout(()=>spawnEnemy(d),delay);
    delay+=400/gameSpeed;
  }
}
function spawnEnemy(d){
  let start=PATH[0];
  enemies.push({x:start.c*CELL+CELL/2,y:start.r*CELL+CELL/2,hp:d.hp,maxHp:d.maxHp,speed:d.speed,reward:d.reward,pathIndex:0,dot:0,dotTimer:0,slow:0,slowTimer:0});
}
function updateEnemies(){
  for(let i=enemies.length-1;i>=0;i--){
    let e=enemies[i];
    if(e.slowTimer>0)e.slowTimer--;else e.slow=0;
    if(e.dotTimer>0){e.dotTimer--;e.hp-=e.dot;}
    if(e.hp<=0){gold+=e.reward;particles.push({x:e.x,y:e.y,life:30,color:"#FFEB3B"});enemies.splice(i,1);continue;}
    let spd=e.speed*(1-e.slow)*gameSpeed;
    if(e.pathIndex<PATH.length-1){
      let tgt=PATH[e.pathIndex+1];
      let tx=tgt.c*CELL+CELL/2,ty=tgt.r*CELL+CELL/2;
      let dx=tx-e.x,dy=ty-e.y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<spd*2){e.pathIndex++;e.x=tx;e.y=ty;}
      else{e.x+=dx/dist*spd*2;e.y+=dy/dist*spd*2;}
    }else{
      lives--;enemies.splice(i,1);
    }
  }
  if(enemies.length===0&&state==="playing"&&allSpawned){nextWave();}
}
let allSpawned=false;
function updateTowers(){
  for(let t of towers){
    if(t.cooldown>0){t.cooldown-=gameSpeed;continue;}
    let tx=t.col*CELL+CELL/2,ty=t.row*CELL+CELL/2;
    let best=null,bestDist=Infinity;
    for(let e of enemies){
      let dx=e.x-tx,dy=e.y-ty,d=Math.sqrt(dx*dx+dy*dy);
      if(d<=t.range*CELL&&d<bestDist){best=e;bestDist=d;}
    }
    if(best){
      t.cooldown=t.rate;
      if(t.type==="laser"){
        t.target=best;
      }else{
        projectiles.push({x:tx,y:ty,tgt:best,dmg:t.dmg,speed:4,color:t.projColor,splash:t.splash||0,slow:t.slow||0,dot:t.dot||0});
      }
    }else{t.target=null;}
  }
}
function updateProjectiles(){
  for(let i=projectiles.length-1;i>=0;i--){
    let p=projectiles[i];
    if(!p.tgt||p.tgt.hp<=0){projectiles.splice(i,1);continue;}
    let dx=p.tgt.x-p.x,dy=p.tgt.y-p.y,d=Math.sqrt(dx*dx+dy*dy);
    if(d<5){
      p.tgt.hp-=p.dmg;
      if(p.slow){p.tgt.slow=Math.max(p.tgt.slow,p.slow);p.tgt.slowTimer=60;}
      if(p.dot){p.tgt.dot=Math.max(p.tgt.dot,p.dot);p.tgt.dotTimer=60;}
      if(p.splash>0){
        for(let e of enemies){
          if(e!==p.tgt){let ex=e.x-p.tgt.x,ey=e.y-p.tgt.y;if(Math.sqrt(ex*ex+ey*ey)<p.splash*CELL){e.hp-=p.dmg*0.5;}}
        }
        particles.push({x:p.tgt.x,y:p.tgt.y,life:20,color:"#FF6D00"});
      }
      particles.push({x:p.tgt.x,y:p.tgt.y,life:10,color:p.color});
      projectiles.splice(i,1);
    }else{
      p.x+=dx/d*p.speed*gameSpeed*2;
      p.y+=dy/d*p.speed*gameSpeed*2;
    }
  }
}
function updateLasers(){
  for(let t of towers){
    if(t.type!=="laser"||!t.target)continue;
    let tx=t.col*CELL+CELL/2,ty=t.row*CELL+CELL/2;
    let dx=t.target.x-tx,dy=t.target.y-ty,d=Math.sqrt(dx*dx+dy*dy);
    if(d>t.range*CELL||t.target.hp<=0){t.target=null;continue;}
    t.target.hp-=t.dmg*gameSpeed;
  }
}
function drawMenu(){
  ctx.fillStyle="#1a1a2e";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#FFD700";ctx.font="bold 48px Arial";ctx.textAlign="center";
  ctx.fillText("TOWER DEFENSE",W/2,120);
  ctx.fillStyle="#aaa";ctx.font="18px Arial";
  ctx.fillText("Defend your base from waves of enemies!",W/2,170);
  ctx.fillStyle="#4CAF50";ctx.fillRect(W/2-100,220,200,50);
  ctx.fillStyle="#fff";ctx.font="bold 20px Arial";ctx.fillText("PLAY",W/2,252);
  ctx.fillStyle="#666";ctx.font="14px Arial";
  ctx.fillText("Click towers on the right panel to place them",W/2,310);
  ctx.fillText("Earn gold by defeating enemies",W/2,330);
  ctx.fillText("Towers unlock every 5 waves!",W/2,350);
}
function drawGame(){
  ctx.fillStyle="#1a1a2e";ctx.fillRect(0,0,W,H);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    let key=c+","+r;
    if(pathSet.has(key)){
      ctx.fillStyle="#3d3d5c";
    }else{
      ctx.fillStyle=(r+c)%2===0?"#2a2a3e":"#252538";
    }
    ctx.fillRect(c*CELL,r*CELL,CELL,CELL);
    ctx.strokeStyle="#333";ctx.strokeRect(c*CELL,r*CELL,CELL,CELL);
  }
  ctx.fillStyle="#f44";ctx.fillRect(0,5*CELL,CELL,CELL);
  ctx.fillStyle="#4f4";ctx.fillRect(17*CELL,5*CELL,CELL,CELL);
  for(let t of towers){
    let tx=t.col*CELL,ty=t.row*CELL;
    ctx.fillStyle=t.color;
    ctx.fillRect(tx+6,ty+6,CELL-12,CELL-12);
    ctx.fillStyle="#fff";ctx.font="10px Arial";ctx.textAlign="center";
    ctx.fillText(t.name,tx+CELL/2,ty+CELL/2+3);
    if(selectedTower===t){
      ctx.strokeStyle="#FFD700";ctx.lineWidth=2;
      ctx.strokeRect(tx+2,ty+2,CELL-4,CELL-4);
      ctx.beginPath();ctx.arc(tx+CELL/2,ty+CELL/2,t.range*CELL,0,Math.PI*2);
      ctx.strokeStyle="rgba(255,215,0,0.3)";ctx.lineWidth=1;ctx.stroke();
    }
    if(t.type==="laser"&&t.target){
      ctx.strokeStyle=t.projColor;ctx.globalAlpha=0.6;ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(tx+CELL/2,ty+CELL/2);
      ctx.lineTo(t.target.x,t.target.y);ctx.stroke();
      ctx.globalAlpha=1;
    }
  }
  for(let e of enemies){
    ctx.fillStyle="#e44";ctx.beginPath();ctx.arc(e.x,e.y,8,0,Math.PI*2);ctx.fill();
    let pct=e.hp/e.maxHp;
    ctx.fillStyle="#333";ctx.fillRect(e.x-10,e.y-14,20,4);
    ctx.fillStyle=pct>0.5?"#4f4":pct>0.25?"#ff0":"#f44";
    ctx.fillRect(e.x-10,e.y-14,20*pct,4);
  }
  for(let p of projectiles){
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fill();
  }
  for(let i=particles.length-1;i>=0;i--){
    let p=particles[i];p.life--;
    if(p.life<=0){particles.splice(i,1);continue;}
    ctx.globalAlpha=p.life/30;ctx.fillStyle=p.color;
    ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  }
  ctx.fillStyle="#222";ctx.fillRect(864,0,96,640);
  ctx.fillStyle="#FFD700";ctx.font="bold 14px Arial";ctx.textAlign="left";
  ctx.fillText("Gold: "+gold,870,25);
  ctx.fillText("Lives: "+lives,870,45);
  ctx.fillText("Wave: "+(waveIndex+1),870,65);
  ctx.fillStyle="#888";ctx.font="11px Arial";
  ctx.fillText("Towers:",870,90);
  let startY=100;
  for(let i=0;i<towersUnlocked&&i<TOWER_DEFS.length;i++){
    let t=TOWER_DEFS[i],y=startY+i*22;
    ctx.fillStyle=t.cost<=gold?"#333":"#222";
    ctx.fillRect(868,y,92,20);
    ctx.fillStyle=t.color;ctx.fillRect(870,y+2,16,16);
    ctx.fillStyle=t.cost<=gold?"#fff":"#666";ctx.font="10px Arial";
    ctx.fillText(t.name+" $"+t.cost,890,y+14);
  }
  if(deleteMode){
    ctx.fillStyle="#F44336";ctx.font="bold 12px Arial";ctx.textAlign="center";
    ctx.fillText("DELETE MODE",W/2,H-10);
  }
}
function drawGameOver(){
  ctx.fillStyle="rgba(0,0,0,0.7)";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#F44336";ctx.font="bold 48px Arial";ctx.textAlign="center";
  ctx.fillText("GAME OVER",W/2,250);
  ctx.fillStyle="#aaa";ctx.font="24px Arial";
  ctx.fillText("Wave "+(waveIndex+1)+" reached",W/2,300);
  ctx.fillStyle="#4CAF50";ctx.fillRect(W/2-100,340,200,50);
  ctx.fillStyle="#fff";ctx.font="bold 20px Arial";ctx.fillText("RETRY",W/2,372);
}
function nextWave(){
  waveIndex++;
  towersUnlocked=8+Math.floor(waveIndex/5)*TOWER_DEFS.length/4|0;
  if(towersUnlocked>TOWER_DEFS.length)towersUnlocked=TOWER_DEFS.length;
  allSpawned=false;
  spawnWave();
  setTimeout(()=>{allSpawned=true;},1000);
}
canvas.addEventListener("click",e=>{
  let rect=canvas.getBoundingClientRect();
  let mx=e.clientX-rect.left,my=e.clientY-rect.top;
  if(state==="menu"){
    if(mx>W/2-100&&mx<W/2+100&&my>220&&my<270){
      state="playing";nextWave();
    }
    return;
  }
  if(state==="gameover"){
    if(mx>W/2-100&&mx<W/2+100&&my>340&&my<390){
      gold=50;lives=20;waveIndex=0;enemies=[];towers=[];projectiles=[];particles=[];
      towersUnlocked=8;selectedTower=null;deleteMode=false;
      state="playing";nextWave();
    }
    return;
  }
  if(mx<864){
    let c=Math.floor(mx/CELL),r=Math.floor(my/CELL);
    if(deleteMode){
      let idx=towers.findIndex(t=>t.col===c&&t.row===r);
      if(idx>=0){gold+=Math.floor(towers[idx].cost/2);towers.splice(idx,1);}
      deleteMode=false;return;
    }
    let key=c+","+r;
    if(!pathSet.has(key)){
      let existing=towers.find(t=>t.col===c&&t.row===r);
      if(existing){selectedTower=selectedTower===existing?null:existing;return;}
      if(selectedDef&&gold>=selectedDef.cost){
        towers.push({col:c,row:r,...selectedDef,cooldown:0,target:null});
        gold-=selectedDef.cost;
      }
    }
  }else{
    let idx=Math.floor((my-100)/22);
    if(idx>=0&&idx<towersUnlocked&&idx<TOWER_DEFS.length){
      selectedDef=TOWER_DEFS[idx];
      selectedTower=null;
    }
    if(mx>900&&my>600){deleteMode=!deleteMode;}
  }
});
let selectedDef=TOWER_DEFS[0];
canvas.addEventListener("mousemove",e=>{
  let rect=canvas.getBoundingClientRect();
  hoveredCell={c:Math.floor((e.clientX-rect.left)/CELL),r:Math.floor((e.clientY-rect.top)/CELL)};
});
function gameLoop(){
  tick++;
  if(state==="menu")drawMenu();
  else if(state==="playing"){
    updateEnemies();updateTowers();updateProjectiles();updateLasers();
    if(lives<=0)state="gameover";
    drawGame();
  }else if(state==="gameover")drawGameOver();
  requestAnimationFrame(gameLoop);
}
gameLoop();
