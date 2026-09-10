/* v2 — user-annotated corrections. The original photo coordinates stay fixed.
   Only the front (+Z) is extended. Plant silhouettes are NOT species claims. */
'use strict';
(()=>{
const N=Nest3D,A=NestRoom,{Builder,plane,cylinder,lathe,sphere,T,RX,RY,mm,I}=N,PI=Math.PI;
const oldModel=A.model,oldArch=A.architecture,oldTextures=A.textures;
Object.assign(A.room,{w:7.2,d:7.4,h:2.85,zmin:-2.9,zmax:4.5,centerZ:.8,extension:1.6});
A.configureRoom=function(extra=1.6){
 if(!Number.isFinite(extra)||extra<.5||extra>4)throw Error('前区增加进深请设为 0.5–4 米。');
 Object.assign(A.room,{extension:extra,d:5.8+extra,zmax:2.9+extra,centerZ:extra/2});
 const screen=A.base.find(o=>o.id==='projectionScreen');if(screen)screen.z=A.room.zmax-.25;
};
const silhouettes={
 branching:{name:'橙粉色分枝花材',latin:'Branching flower arrangement · species unconfirmed',kind:'分枝花材',height:.67,note:'按照片中的细枝与暖色小花区分建模。具体花种、切花或盆栽状态均待确认。'},
 vine:{name:'心叶垂蔓盆栽',latin:'Trailing heart-shaped foliage · unconfirmed',kind:'垂蔓观叶',height:.38,note:'用心形叶与垂落枝条表达外形差异；不将其直接认定为绿萝。'},
 lance:{name:'深绿披针叶盆栽',latin:'Upright lance-leaf foliage · unconfirmed',kind:'披针叶观叶',height:.47,note:'表现深绿色、向上簇生的狭长叶片；不能仅凭远景断言是白掌。'},
 redflower:{name:'红色宽瓣花材',latin:'Red broad-petalled arrangement · unconfirmed',kind:'红色花材',height:.54,note:'还原窗台红花的颜色与宽瓣轮廓，不把红掌等候选视为已确认品种。'},
 roundleaf:{name:'圆叶小盆栽',latin:'Compact rounded-leaf foliage · unconfirmed',kind:'圆叶观叶',height:.38,note:'用圆叶、低矮株形与圆肚白盆和相邻盆栽区分；真实品种待近照确认。'},
 striped:{name:'浅斑纹长叶盆栽',latin:'Variegated elongated foliage · unconfirmed',kind:'斑纹观叶',height:.51,note:'斑纹与叶形为远景近似表达，不等于确认某个花叶品种。'},
 pinnate:{name:'羽状复叶盆栽',latin:'Paired oval leaflets · unconfirmed',kind:'复叶观叶',height:.60,note:'较高枝条上交替排列小叶；外形类似若干常见复叶植物，身份待确认。'},
 bush:{name:'小叶灌丛盆栽',latin:'Small-leaved bushy foliage · unconfirmed',kind:'小叶观叶',height:.55,note:'以密集分枝和细小叶片表达灌丛感；未确认到种。'}
};
for(const[k,p]of Object.entries(silhouettes))A.plants[k]={...p,confidence:'外形区分 · 品种待确认',light:'先确认具体品种与真假植物状态；当前仅作窗台外形重建，不推算养护适宜度。'};
const sillTypes=['branching','vine','lance','redflower','roundleaf','striped','pinnate','bush','lance'];
for(let i=0;i<9;i++){
 const o=A.base.find(o=>o.id==='sill'+i);o.species=sillTypes[i];o.name=`窗台 ${String.fromCharCode(65+i)} · ${A.plants[o.species].name}`;o.variant=i+6;
 o.w=i===0?.23:i===4?.27:.25;o.d=o.w;
}
const projector=A.base.find(o=>o.id==='speaker');
Object.assign(projector,{name:'投影仪与落地支架',type:'projector',w:.38,d:.34,r:Math.atan2(.4-projector.x,4.25-projector.z),powered:false});
A.base.push({id:'projectionScreen',name:'电动投影幕布',type:'projectionScreen',x:.4,z:4.25,w:3.24,d:.20,r:PI,y:0,visible:true,category:'electronics',deployed:true,powered:false});
Object.assign(A.presets[0],{tag:'按标注修正版',desc:'保留原有沙发与工作区。向下加深前区，补上正对沙发的投影幕布。',tip:'下方新增进深暂按 1.6 m。工作区、东窗与飘窗保持原位；幕布正面朝向沙发。'});
Object.assign(A.presets[1],{desc:'窗台改为不同叶形与花色的分组；前区留出走动空间，投影仪不再混入灯具。'});
const cinema=A.presets.find(p=>p.id==='cinema');
Object.assign(cinema,{name:'幕布电影夜',tag:'面向投影幕布',desc:'沙发朝向下方幕布，而不是背后的电脑屏。投影仪面向幕布，黄色坐垫侧放。',tip:'这是投影布局示意。侧投能否校正、实际投射比与遮挡须按真实设备和现场确认。',changes:{sofa:[.25,.18,0],coffee:[.25,1.48,0],rug:[.42,1.10,0],pouf:[2.35,2.07,0],side:[2.03,.16,0],chair1:[-.60,-1.5,0],chair2:[.66,-1.50,-.12],desk:[.08,-2.42,0],bird:[2.80,-2.17,0],monstera:[2.66,-1.1,0],fern:[1.93,-1.12,0],hydrangea:[2.18,-1.85,0],dracaena:[2.95,.55,0],speaker:[2.75,-.43,Math.atan2(.4-2.75,4.25+.43)]}});
// Keep the existing four-layout vocabulary; only fix the mistaken cinema orientation.
A.migrate=function(data){
 if(!data||![1,2].includes(data.version)||!Array.isArray(data.objects))return data;
 const out={...data,version:2,roomExtension:data.roomExtension??1.6,objects:data.objects.map(o=>({...o}))};
 if(data.version===1){
  for(const s of out.objects){
   const base=A.base.find(o=>o.id===s.id);
   if(/^sill[0-8]$/.test(s.id)&&s.species==='unknown'){s.species=base.species;if(!s.name||/^窗台小盆 /.test(s.name))s.name=base.name;}
   if(s.id==='speaker'){if(!s.name||/灯架|音箱/.test(s.name))s.name=projector.name;if(s.r===0)s.r=projector.r;}
   if(data.preset==='cinema'&&cinema.changes[s.id]){const p=cinema.changes[s.id];[s.x,s.z,s.r]=p;}
  }
 }
 return out;
};
function tex(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);return c;}
A.textures=function(){const t=oldTextures();
 t.heart=tex(192,240,(c,w,h)=>{c.fillStyle='#6b9759';c.beginPath();c.moveTo(96,226);c.bezierCurveTo(60,175,-25,75,38,22);c.bezierCurveTo(65,5,84,26,96,44);c.bezierCurveTo(120,0,190,5,181,73);c.bezierCurveTo(176,137,126,186,96,226);c.fill();c.strokeStyle='#bad38b';c.lineWidth=3;c.beginPath();c.moveTo(96,215);c.lineTo(96,47);c.stroke();});
 t.oval=tex(160,240,(c,w,h)=>{c.fillStyle='#66914e';c.beginPath();c.ellipse(80,120,69,110,-.12,0,PI*2);c.fill();c.strokeStyle='#b6c77a';c.lineWidth=2;c.beginPath();c.moveTo(80,230);c.lineTo(80,16);c.stroke();});
 t.striped=tex(180,380,(c,w,h)=>{c.beginPath();c.moveTo(90,373);c.bezierCurveTo(-10,230,6,45,90,4);c.bezierCurveTo(170,58,195,240,90,373);c.closePath();c.clip();c.fillStyle='#567e4c';c.fillRect(0,0,w,h);c.fillStyle='#bbc79c';c.beginPath();c.moveTo(84,372);c.bezierCurveTo(40,205,48,64,91,0);c.bezierCurveTo(131,75,134,229,84,372);c.fill();c.strokeStyle='#dce0b3';c.lineWidth=3;c.beginPath();c.moveTo(90,373);c.lineTo(91,12);c.stroke();for(let i=0;i<13;i++){c.strokeStyle='#849d63';c.lineWidth=4;c.beginPath();c.moveTo(91,80+i*19);c.lineTo(i%2?45:135,59+i*19);c.stroke();}});
 t.petal=tex(180,220,(c,w,h)=>{let g=c.createLinearGradient(0,0,180,220);g.addColorStop(0,'#f39474');g.addColorStop(.5,'#c43f42');g.addColorStop(1,'#e86e64');c.fillStyle=g;c.beginPath();c.moveTo(90,205);c.bezierCurveTo(-30,105,9,5,67,34);c.quadraticCurveTo(90,65,113,34);c.bezierCurveTo(175,-5,209,111,90,205);c.fill();});
 t.screenBlank=tex(960,540,(c,w,h)=>{const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#faf6e9');g.addColorStop(1,'#dedbce');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#b3b4a3';c.textAlign='center';c.font='22px sans-serif';c.fillText('东窗小筑 · 等一场好电影',w/2,h/2);});
 t.projectionImage=tex(960,540,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#26364b');g.addColorStop(.55,'#ad857d');g.addColorStop(1,'#e5b78c');c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle='#f5dfb6';c.beginPath();c.arc(719,135,49,0,PI*2);c.fill();for(let layer=0;layer<4;layer++){c.fillStyle=['#8d8586','#656c78','#485764','#304753'][layer];c.beginPath();c.moveTo(0,h);for(let x=0;x<=w;x+=16)c.lineTo(x,260+layer*62+Math.sin(x/110+layer)*44+Math.sin(x/51+layer)*16);c.lineTo(w,h);c.fill();}c.fillStyle='#f4e7ce';c.font='32px serif';c.textAlign='center';c.fillText('晚风放映室',w/2,110);c.font='12px sans-serif';c.fillText('E A S T   W I N D O W   C I N E M A',w/2,140);});
 t.screenMarker=tex(640,80,(c,w,h)=>{c.fillStyle='#63755d';c.font='33px sans-serif';c.textAlign='center';c.fillText('投影幕布  ·  朝向沙发',w/2,50);});
 t.extensionMarker=tex(800,90,(c,w,h)=>{c.fillStyle='#a49377';c.font='28px sans-serif';c.textAlign='center';c.fillText('前区加深  /  尺寸可在场景设置调整',w/2,56);});
 return t;};
function pot(b,i){const r=i===4?.135:.12,h=i===0?.22:i===4?.16:.19;
 if(i===4)b.put(lathe([[.075,0],[.123,.035],[.145,.09],[.12,.17],[.105,.175]]),'#f0eadb');
 else if(i===6||i===7)b.box(r*1.85,h,r*1.85,'#eee8d9',0,h/2,0,.014);
 else b.put(lathe([[r*.8,0],[r*.82,.02],[r,h],[r*.86,h],[r*.85,h-.035]]),i===0?'#bdb19a':'#eee8db');
 b.cyl(r*.83,r*.83,.015,'#615d45',0,h-.014,0);b.cyl(r*.9,r*.9,.016,'#c9c2ac',0,.01,0);
 if(i===5)for(let j=0;j<18;j++){let a=j/18*PI*2;b.rod([Math.sin(a)*r*.83,.03,Math.cos(a)*r*.83],[Math.sin(a)*r*.99,h-.015,Math.cos(a)*r*.99],.0025,'#c9c5b2');}
 return h;
}
function leaf(b,key,x,y,z,a,tilt,w,h,color='#ffffff'){b.put(plane(w,h,.012),color,mm(T(x,y,z),mm(RY(a),RX(tilt))),{tex:key});}
function smallPlant(o){const b=new Builder(),v=o.variant||6,i=(v-6+90)%9,h=pot(b,i),type=o.species;
 if(type==='branching'){
  for(let k=0;k<6;k++){const a=k*2.4,x=Math.sin(a)*.1,z=Math.cos(a)*.1,y=h+.26+(k%3)*.065;b.rod([0,h,0],[x,y,z],.0035,'#65754b');for(let j=0;j<3;j++){const px=x+Math.sin(a+j)*.045,pz=z+Math.cos(a+j)*.045,py=y+j*.027;b.rod([x,y-.08,z],[px,py,pz],.002,'#65754b');for(let f=0;f<5;f++)b.put(sphere(.016,.013,.016,6,4),['#df997b','#d8aa7b','#c58780'][(j+k)%3],T(px+Math.sin(f*1.256)*.012,py,pz+Math.cos(f*1.256)*.012));}leaf(b,'narrow',x*.5,h+.05,z*.5,a,.9,.065,.16);}
 }else if(type==='vine'){
  for(let k=0;k<4;k++){let a=k*1.55,prev=[0,h,0];for(let j=0;j<5;j++){let d=(j+1)*.039,x=Math.sin(a)*d,z=Math.cos(a)*d,y=h+.07-j*j*.0085;b.rod(prev,[x,y,z],.003,'#73944e');leaf(b,'heart',x,y,z,a+j*.7,1.3,.10,.13,j%2?'#ffffff':'#d3dc9d');prev=[x,y,z];}}
 }else if(type==='lance'||type==='striped'){
  for(let j=0;j<(i===8?13:9);j++){let a=j*2.4+v*.8,hh=.20+(j%4)*.037,tilt=.25+(j%3)*.25;leaf(b,type==='striped'?'striped':'narrow',Math.sin(a)*.035,h,Math.cos(a)*.035,a,tilt,type==='striped'?.115:.065,hh,type==='lance'?(i===8?'#aad294':'#658b67'):'#ffffff');}
 }else if(type==='redflower'){
  for(let j=0;j<7;j++){let a=j*2.4;leaf(b,'heart',Math.sin(a)*.03,h,Math.cos(a)*.03,a,.9,.12,.21,'#84a475');}
  for(let j=0;j<4;j++){let a=j*2.4,x=Math.sin(a)*.085,z=Math.cos(a)*.085,y=h+.21+(j%2)*.07;b.rod([0,h,0],[x,y,z],.0035,'#648354');leaf(b,'petal',x,y-.06,z,a,.58,.13,.14);b.rod([x,y+.006,z],[x,y+.062,z+.009],.006,'#e5b36c');}
 }else if(type==='roundleaf'){
  for(let j=0;j<11;j++){let a=j*2.4,y=h+.06+(j%3)*.025,x=Math.sin(a)*.085,z=Math.cos(a)*.085;b.rod([0,h,0],[x,y,z],.003,'#759258');leaf(b,'oval',x,y,z,a,1.05,.10,.105,j%2?'#bdce83':'#ffffff');}
 }else if(type==='pinnate'){
  for(let j=0;j<5;j++){let a=j*2.4,len=.27+(j%3)*.045,x=Math.sin(a)*.06,z=Math.cos(a)*.06;b.rod([0,h,0],[x,h+len,z],.006,'#789054');for(let k=0;k<5;k++)for(const s of[-1,1]){const t=(k+1)/6;leaf(b,'oval',x*t,h+len*t,z*t,a+s*1.2,.85,.055,.093,k%2?'#bad09a':'#dbe7b9');}}
 }else{
  for(let j=0;j<9;j++){let a=j*2.4,x=Math.sin(a)*.085,z=Math.cos(a)*.085,y=h+.19+(j%4)*.034;b.rod([0,h,0],[x,y,z],.003,'#7e8151');for(let k=0;k<4;k++)leaf(b,'oval',x,h+(y-h)*(k+1)/4,z,a+k*1.5,.9,.04,.071,j%2?'#e1e3ab':'#a6c787');}
 }
 return b.finish();
}
function projectorModel(o){const b=new Builder();b.cyl(.145,.17,.035,'#504d43',0,.02,0);b.cyl(.018,.018,1.04,'#867354',0,.54,0);b.box(.31,.025,.24,'#6e6253',0,1.066,0,.006);b.box(.38,.235,.29,'#ab8b70',0,1.205,0,.023);b.box(.346,.204,.018,'#343d3e',0,1.205,.153,.012);b.box(.325,.012,.25,'#bfa286',0,1.326,0,.01);for(let j=0;j<7;j++)b.box(.073,.006,.006,'#697171',-.106,1.14+j*.021,.165,.001);
 b.put(cylinder(.059,.065,.031,24),'#1c292f',mm(T(.077,1.217,.171),RX(PI/2)));b.put(cylinder(.044,.044,.009,24),o.powered?'#91d7f1':'#4d91af',mm(T(.077,1.217,.193),RX(PI/2)),{glow:o.powered?1:.3});b.ball(.012,.012,.004,'#c1edf2',.061,1.234,.200,{glow:.8});b.ball(.009,.009,.004,o.powered?'#7fb998':'#b3b7ac',-.128,1.274,.166,{glow:.4});return b.finish();}
function screenModel(o){const b=new Builder(),cloth=new Builder();
 // A hanging roll-up screen, not a floor lamp or TV. Housing height is locked.
 b.box(3.24,.13,.20,'#d3ccba',0,2.69,0,.028);b.box(3.11,.022,.13,'#545950',0,2.612,0,.003);for(const x of[-1.39,1.39]){b.rod([x,2.75,0],[x,2.85,0],.010,'#ad9d82');b.box(.16,.018,.12,'#c3b49c',x,2.845,0,.003);}
 if(o.deployed!==false){
  // Fabric faces local +Z; the base object is rotated PI toward the sofa.
  cloth.flat(3.10,1.90,'screenBlank',0,.64,.005,0,0,'#343b37');
  cloth.flat(2.96,1.665,o.powered?'projectionImage':'screenBlank',0,.74,.018,0,0,'#ffffff',{glow:o.powered?.8:0});
  // Thin edge cords keep the cutaway legible when seen from behind.
  for(const x of[-1.55,1.55])b.rod([x,.64,0],[x,2.54,0],.008,'#a39c8b');
  b.box(3.16,.035,.055,'#7c806f',0,.62,0,.007);
 }
 b.flat(1.8,.225,'screenMarker',0,.023,.36,-PI/2,PI,'#ffffff',{shadow:false});
 return [...b.finish(),...cloth.finish().map(p=>({...p,screenFabric:true}))];
}
A.model=function(o){if(o.type==='projector')return projectorModel(o);if(o.type==='projectionScreen')return screenModel(o);if(o.type==='plant'&&silhouettes[o.species])return smallPlant(o);return oldModel(o);};
A.architecture=function(closed=false){const ext=A.room.extension,center=ext/2,end=A.room.zmax;const all=oldArch(closed).filter(o=>o.id!=='floor');let b=new Builder();b.box(7.45,.22,6.05+ext,'#bfb39a',0,-.14,center,.07);b.box(7.25,.04,5.85+ext,'#e6dac0',0,-.015,center,.02);b.flat(7.2,5.8+ext,'floor',0,.011,end,-PI/2);all.unshift({id:'floor',x:0,z:0,model:I(),parts:b.finish()});
 b=new Builder();b.box(.15,2.8,ext,'#e9dfc9',3.64,1.4,2.9+ext/2,.005);b.box(.045,.08,ext,'#685744',3.53,.05,2.9+ext/2,.002);for(const[y,w,h,c]of[[2.73,.25,.06,'#f8f0da'],[2.8,.30,.05,'#ebe1ca'],[2.86,.34,.05,'#fcf5e3']])b.box(w,h,ext,c,3.56,y,2.9+ext/2,.008);all.push({id:'front-east-return',model:I(),wall:true,parts:b.finish()});
 b=new Builder();for(let x=-3;x<3;x+=.23)b.box(.11,.003,.010,'#d0c3aa',x,.018,2.9,.001);b.flat(2.8,.315,'extensionMarker',-.6,.018,Math.min(3.47,end-.32),-PI/2,0,'#ffffff',{shadow:false});all.push({id:'depth-annotation',model:I(),helper:true,parts:b.finish()});return all;};
// Orthographic cutaway: do not let the back of the screen hide the room.
// Both rendering paths use the same selection geometry and cutaway convention.
function prepare(r){const changed=[];for(const o of [...r.arch,...r.items]){
 if(['backwall','eastwall','curtains','front-east-return'].includes(o.id)){
  const hide=o.id==='backwall'?Math.cos(r.azimuth)<-.12:Math.sin(r.azimuth)>.12;
  if(hide){changed.push([o,'visible',o.visible]);o.visible=false;}
 }
 if(o.type==='projectionScreen'){
  const front=Math.cos(r.azimuth-(o.r||0));
  if(r.top||front<.12){changed.push([o,'parts',o.parts]);o.parts=o.parts.filter(p=>!p.screenFabric);}
 }
}return ()=>{for(const[o,k,v]of changed)o[k]=v;};}
const oldRender=N.Renderer.prototype.render;N.Renderer.prototype.render=function(pass){const restore=prepare(this);try{return oldRender.call(this,pass);}finally{restore();}};
const oldCanvasFrame=N.CanvasRenderer.prototype.frame;N.CanvasRenderer.prototype.frame=function(...args){const restore=prepare(this);try{return oldCanvasFrame.apply(this,args);}finally{restore();}};
A.customPreview=function(type){
 if(type==='projector')return '<svg viewBox="0 0 180 140" aria-hidden="true"><ellipse cx="90" cy="131" rx="28" ry="5" fill="#cecfbb"/><path d="M90 128V72" stroke="#97876b" stroke-width="5"/><path d="M52 39l47-12 36 17v39l-48 8-35-14Z" fill="#b39575"/><path d="M52 39l47 14 36-9-48 10v37l-35-14Z" fill="#565b55"/><circle cx="72" cy="61" r="12" fill="#263b41"/><circle cx="72" cy="61" r="8" fill="#6bacc1"/><circle cx="69" cy="58" r="3" fill="#d9eff0"/><path d="M58 80l17 5m-17-10 17 5" stroke="#a2a58c" stroke-width="2"/></svg>';
 if(type==='projectionScreen')return '<svg viewBox="0 0 180 140" aria-hidden="true"><rect x="24" y="20" width="132" height="10" rx="4" fill="#aaa991"/><rect x="30" y="30" width="120" height="75" fill="#556459"/><rect x="34" y="34" width="112" height="66" fill="#eee8d7"/><path d="M34 87 60 62 79 80 109 51 146 86v14H34Z" fill="#91a187"/><circle cx="62" cy="51" r="9" fill="#d8bb7b"/><path d="M27 107h126" stroke="#76846a" stroke-width="4"/></svg>';
 if(!silhouettes[type])return null;
 let shapes='',color=type==='redflower'?'#d36e65':type==='branching'?'#d4a17e':'#799366';
 if(type==='vine'){for(let i=0;i<4;i++){let x=58+i*20;shapes+=`<path d="M90 78Q${x} 72 ${x-3} 112" fill="none" stroke="#839865" stroke-width="2"/>`;for(let j=0;j<3;j++)shapes+=`<path d="M${x-3} ${84+j*9}q-17-14-13 0l10 9q18-12 3-17Z" fill="#8ca26e"/>`;}}
 else if(type==='pinnate'){for(let i=0;i<4;i++){let x=57+i*23;shapes+=`<path d="M90 99L${x} 20" stroke="#8c9966" stroke-width="2"/>`;for(let j=0;j<5;j++)shapes+=`<ellipse cx="${x-6+j*2}" cy="${29+j*12}" rx="10" ry="5" fill="#7d9d65"/><ellipse cx="${x+10+j}" cy="${35+j*11}" rx="9" ry="5" fill="#9ab07a"/>`;}}
 else for(let i=0;i<(type==='bush'?18:7);i++){let a=i*2.4,x=90+Math.sin(a)*34,y=36+(i%4)*13;shapes+=`<path d="M90 102L${x} ${y}" stroke="#83916a" stroke-width="1.5"/>`;if(['branching','redflower'].includes(type))for(let j=0;j<5;j++)shapes+=`<circle cx="${x+Math.sin(j*1.256)*7}" cy="${y+Math.cos(j*1.256)*7}" r="${type==='redflower'?8:4}" fill="${color}"/>`;else shapes+=`<ellipse cx="${x}" cy="${y}" rx="${type==='lance'?5:type==='bush'?6:12}" ry="${['lance','striped'].includes(type)?25:type==='bush'?8:12}" fill="${type==='striped'?'#aeb995':color}" transform="rotate(${Math.sin(a)*32} ${x} ${y})"/>`;}
 return `<svg viewBox="0 0 180 140" aria-hidden="true">${shapes}<path d="M69 99h43l-7 30H76Z" fill="#e0d4ba"/><path d="M71 101h39" stroke="#bdb299" stroke-width="3"/></svg>`;
};
})();
