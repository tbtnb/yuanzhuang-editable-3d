/* v3: additional reverse view, user-confirmed pedestal speaker, and relative scale calibration.
   Measurements are editable estimates. No source photographs are published. */
'use strict';
(()=>{
const A=NestRoom,N=Nest3D,{Builder,plane,cylinder,sphere,lathe,mm,T,S,RX,RY,I}=N,PI=Math.PI;
const oldModel=A.model,oldTextures=A.textures,oldPreview=A.customPreview,oldMigrate=A.migrate;
const R=A.room,DEFAULT={w:5.8,d:6.6,h:2.85};
A.configureRoom=function(extra=.8,width=R.w||DEFAULT.w){
 if(!Number.isFinite(extra)||extra<.5||extra>4||!Number.isFinite(width)||width<4.6||width>9)throw Error('请将宽度设为 4.6–9 米、总进深设为 6.3–9.8 米。');
 Object.assign(R,{w:width,d:5.8+extra,h:2.85,extension:extra,zmin:-2.9,zmax:2.9+extra,centerZ:extra/2});
 R.bay={xmin:width/2-.48,xmax:width/2-.04,zmin:-1.72,zmax:1.37,y:.74};
};
A.configureRoom(.8,5.8);
const get=id=>A.base.find(o=>o.id===id);
const place=(id,x,z,more={})=>Object.assign(get(id),{x,z,...more});
place('sofa',.15,-.22);place('coffee',.30,1.16);place('rug',.32,1.05,{w:4.10,d:3.35});
place('desk',.03,-2.39,{w:2.20,d:.75});place('chair1',-.56,-1.46);place('chair2',.64,-1.46,{r:-.12});
place('side',2.03,-.02);place('pouf',2.16,1.45);
place('sideboard',-2.60,-.16);place('bin',-2.51,-1.64);
place('clock',-2.57,-2.84,{y:1.84});place('dart',-1.02,-2.84);place('monitor',-.18,-.18);
place('bird',2.05,-2.21);place('monstera',2.11,-.91);place('hydrangea',0,0,{parent:'flowerStand',y:.48});place('fern',0,0,{parent:'plantStand',y:.53});
place('dracaena',1.58,-.61,{name:'厚叶直立盆栽 · 疑似橡皮树',species:'rubberlike'});
A.plants.rubberlike={name:'厚叶直立盆栽（疑似橡皮树）',latin:'Broad, thick oval leaves · unconfirmed',kind:'厚叶观叶',height:1.08,confidence:'新视角外形判断 · 待确认',light:'先确认具体品种；照片不用于测算实际照度。',note:'补充视角显示厚实椭圆叶和白色方盆，因此不再用细长叶植物代替。可能是橡皮树类，但未确认到种或真假植物。'};
// Keep the legacy projector id so existing user layouts remain compatible.
place('speaker',2.46,-.61,{name:'棕色投影仪与落地支架',r:Math.atan2(.22-2.46,3.48+.61)});
place('projectionScreen',.22,3.48,{name:'南侧电动投影幕布',w:3.24,d:.20});
for(const o of A.base)if(o.ceiling)o.noTop=true;
place('chandelier',.20,-.08);place('pendants',.30,2.83,{name:'幕布前金色几何吊灯组',r:0,w:1.45,d:.44});
const add=(id,name,type,x,z,w,d,more={})=>A.base.push({id,name,type,x,z,w,d,r:0,y:0,visible:true,category:'decor',...more});
add('turretAudio','白色炮台造型立式音响','turretAudio',2.39,2.13,.38,.39,{category:'electronics',r:-2.50});
add('christmasTree','幕布旁装饰圣诞树','christmasTree',2.28,3.10,.83,.83);
add('plantStand','蕨类四脚花架','plantStand',1.27,-1.04,.44,.44,{category:'furniture',standHeight:.53});
add('flowerStand','绣球细脚花架','flowerStand',1.61,-1.91,.44,.44,{category:'furniture',standHeight:.48});
for(let i=0;i<9;i++)place('sill'+i,R.w/2-.25,-1.42+i*.32);
Object.assign(A.presets[0],{name:'新视角还原',tag:'补充照片 · v3',desc:'工作台—沙发—幕布按纵向排列，补上炮台音响、圣诞树和高低花架。',tip:'以沙发、工作台及幕布的相对比例重新校准。约 5.8 × 6.6 m 仅为初始估算；点击场景设置可修改宽度和进深。'});
Object.assign(A.presets[1],{desc:'窗边盆栽错落分组，花架前移一点；让工作椅和沙发背后的通道更清楚。',changes:{sofa:[.13,.08,0],coffee:[.25,1.42,0],rug:[.32,1.20,0],desk:[-.02,-2.39,0],chair1:[-.62,-1.43,0],chair2:[.54,-1.43,0],side:[1.96,.09,0],pouf:[2.11,1.80,0],bird:[2.12,-2.15,0],monstera:[2.30,-.84,0],plantStand:[2.24,.61,0],flowerStand:[1.55,-1.86,0],dracaena:[2.28,.03,0],speaker:[2.53,-.36,-.56],sill0:[2.65,-1.45,0],sill1:[2.65,-1.15,0],sill2:[2.65,-.85,0],sill3:[2.65,-.35,0],sill4:[2.65,-.05,0],sill5:[2.65,.25,0],sill6:[2.65,.68,0],sill7:[2.65,.98,0],sill8:[2.65,1.27,0]}});
Object.assign(A.presets[2],{desc:'面向真实幕布观影，白色音响留在窗边，投影仪独立朝向幕布。',changes:{sofa:[.25,.12,0],coffee:[.25,1.45,0],rug:[.3,1.27,0],side:[2.08,.12,0],pouf:[2.19,1.71,0],speaker:[2.41,-.65,-.51],turretAudio:[2.36,2.23,-2.43]}});
Object.assign(A.presets[3],{desc:'保留窗边植物，沙发靠西朝向窗景。给房间中央留下更宽的活动空间。',changes:{sofa:[-1.55,.56,PI/2],coffee:[-.20,.59,PI/2],rug:[-.16,.76,PI/2],side:[-1.64,2.30,0],sideboard:[-2.60,-1.10,PI/2],pouf:[1.41,1.7,0],plantStand:[2.21,.55,0],flowerStand:[1.61,-1.91,0],bird:[2.15,-2.16,0],monstera:[2.17,-.61,0],dracaena:[2.22,1.24,0]}});
A.migrate=function(data){
 if(!data||!Array.isArray(data.objects)||![1,2,3].includes(data.version))return data;
 if(data.version===3)return data;
 const v2=oldMigrate(data),preset=A.presets.find(p=>p.id===data.preset),out={...v2,version:3,roomWidth:DEFAULT.w,roomExtension:.8,objects:[]};
 const previous=new Map(v2.objects.map(o=>[o.id,o]));
 // Named photo presets adopt the new measurements. Manual layouts retain their relative placement.
 if(preset){out.objects=A.base.map(o=>{const c=preset.changes[o.id],prev=previous.get(o.id);return {...o,...(c?{x:c[0],z:c[1],r:c[2]}:{}),visible:prev?.visible!==false,...(['projector','projectionScreen'].includes(o.type)?{powered:!!prev?.powered,deployed:prev?.deployed!==false}:{})};});}
 else {const depth=5.8+(v2.roomExtension||1.6);out.objects=v2.objects.map(o=>{const b=get(o.id),v={...o};if(!o.parent){v.x*=DEFAULT.w/7.2;v.z=(o.z+2.9)*DEFAULT.d/depth-2.9;}if(o.surface==='bay'){v.x=R.bay.xmax-.21;v.z=Math.max(-1.5,Math.min(1.21,v.z));}if(o.id==='dracaena'&&o.species==='dracaena'){v.species='rubberlike';v.name=get('dracaena').name;}return v;});}
 return out;
};
function texture(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c;}
A.textures=function(){const t=oldTextures();
 t.audioGrille=texture(256,256,(c,w,h)=>{c.fillStyle='#dddcd3';c.beginPath();c.arc(128,128,124,0,PI*2);c.fill();for(let y=13;y<246;y+=8)for(let x=13;x<246;x+=8)if(Math.hypot(x-128,y-128)<111){c.fillStyle='#92978e';c.beginPath();c.arc(x+(y%16?3:0),y,1.6,0,PI*2);c.fill();}c.strokeStyle='#b6b8ae';c.lineWidth=2;c.beginPath();c.arc(128,128,121,0,PI*2);c.stroke();c.fillStyle='#b2b7ac';c.beginPath();c.arc(128,128,14,0,PI*2);c.fill();});
 t.star=texture(128,128,c=>{c.fillStyle='#dcc071';c.beginPath();for(let i=0;i<10;i++){const a=i*PI/5-PI/2,r=i%2?24:57;c.lineTo(64+Math.cos(a)*r,64+Math.sin(a)*r);}c.closePath();c.fill();});
 t.floor=texture(900,1024,(c,w,h)=>{c.fillStyle='#eee2cc';c.fillRect(0,0,w,h);let seed=83;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<3000;i++){c.fillStyle=i%2?'#f7efdf':'#e6d8c0';c.globalAlpha=.18;c.fillRect(rnd()*w,rnd()*h,rnd()*16+2,1);}c.globalAlpha=1;for(let i=1;i<6;i++){c.strokeStyle='#ccbda72a';c.strokeRect(i*w/6,0,w/6,h);}
 c.strokeStyle='#8d7357';c.lineWidth=6;c.strokeRect(33,29,w-66,h-58);c.lineWidth=2;c.strokeRect(46,42,w-92,h-84);c.fillStyle='#dab98e';c.fillRect(53,h*.69,w*.21,h*.21);c.strokeStyle='#b39870';c.lineWidth=2;c.strokeRect(59,h*.69+6,w*.21-12,h*.21-12);
 });return t;};
function audio(){const b=new Builder();b.cyl(.17,.19,.035,'#e6e2d7',0,.025,0);b.cyl(.145,.155,.012,'#c6c6bc',0,.005,0);b.cyl(.025,.032,.89,'#e9e6dc',0,.48,-.015);b.box(.04,.07,.09,'#cbcbbf',0,.94,0,.01);b.put(sphere(.17,.162,.195,22,13),'#f1eee4',T(0,1.086,.006));b.put(cylinder(.144,.149,.021,32),'#e4e4db',mm(T(0,1.102,.156),RX(PI/2)));b.flat(.282,.282,'audioGrille',0,.962,.176,0,0,'#ffffff');b.ball(.012,.008,.005,'#c0c9b6',0,1.248,.054);return b.finish();}
function christmas(){const b=new Builder();b.cyl(.11,.13,.18,'#7b6045',0,.10,0);b.box(.38,.022,.33,'#716650',0,.025,0,.02);for(let j=0;j<11;j++){const y=.28+j*.125,r=.40*(1-j/12);b.put(cylinder(.025,r,.41,13),['#355e43','#426b45','#32533d'][j%3],T(0,y+.15,0));for(let k=0;k<10;k++){const a=k*PI/5+j*.43;b.put(sphere(.095,.045,.060,7,4),j%2?'#496b47':'#3b6044',mm(T(Math.sin(a)*r*.77,y+.025,Math.cos(a)*r*.77),RY(a)));}}
 for(let i=0;i<42;i++){const y=.35+(i/42)*1.18,r=.405*(1-(y-.22)/1.60),a=i*2.399;b.put(sphere(.035,.042,.035,8,5),['#c8aa5d','#af4e42','#e5dfcb','#ac8d47'][i%4],T(Math.sin(a)*r,y,Math.cos(a)*r));}
 let prev;for(let i=0;i<=84;i++){const y=.36+i/84*1.15,r=.435*(1-(y-.22)/1.64),a=i/84*PI*7,p=[Math.sin(a)*r,y,Math.cos(a)*r];if(prev)b.rod(prev,p,.009,'#c9b684');if(i%4===0)b.put(sphere(.018,.018,.018,6,4),'#f5d18b',T(...p),{glow:.65});prev=p;}
 b.flat(.21,.21,'star',0,1.62,0);b.flat(.21,.21,'star',0,1.62,0,0,PI/2);return b.finish();}
function stand(o){const b=new Builder(),h=o.standHeight||.53;b.box(.44,.04,.44,'#b8b4a3',0,h-.02,0,.012);for(const x of[-.16,.16])for(const z of[-.16,.16])b.rod([x*1.14,.015,z*1.14],[x,h-.03,z],.021,'#b6b2a3');for(const z of[-.16,.16])b.rod([-.17,.16,z],[.17,.16,z],.011,'#a5a391');return b.finish();}
function rubber(){const b=new Builder();b.box(.26,.27,.26,'#eee9df',0,.137,0,.01);b.box(.218,.01,.218,'#736d50',0,.276,0,.008);b.rod([0,.27,0],[.028,.94,.009],.015,'#647650');for(let i=0;i<10;i++){const a=i*2.40,h=.40+i*.054,x=Math.sin(a)*.022,z=Math.cos(a)*.022;b.put(plane(.17,.27,.025),i%2?'#658a51':'#4b7046',mm(T(x,h,z),mm(RY(a),RX(.52+i%3*.21))),{tex:'bird'});}return b.finish();}
function scaleParts(parts,x,y,z){return parts.map(p=>{const data=p.data.slice();for(let i=0;i<data.length;i+=12){data[i]*=x;data[i+1]*=y;data[i+2]*=z;}return {...p,data};});}
A.model=function(o){if(o.type==='turretAudio')return audio();if(o.type==='christmasTree')return christmas();if(o.type==='plantStand')return stand(o);if(o.species==='rubberlike')return rubber();let parts=oldModel(o);if(o.type==='rug')parts=scaleParts(parts,o.w/4.35,1,o.d/3.2);if(o.type==='desk')parts=scaleParts(parts,o.w/2.34,1,o.d/.79);
 if(o.type==='pendants'){const b=new Builder();b.box(1.46,.027,.055,'#454238',0,-.012,0,.003);return [...parts,...b.finish()];}return parts;};
A.architecture=function(closed=false){const out=[],w=R.w,half=w/2,end=R.zmax,depth=R.d,center=R.centerZ,win0=-1.77,win1=1.42,ww=win1-win0,wc=(win0+win1)/2;let b;
 const save=(id,props={})=>out.push({id,model:I(),parts:b.finish(),...props});
 b=new Builder();b.box(w+.24,.19,depth+.24,'#b8ac92',0,-.12,center,.055);b.box(w+.04,.035,depth+.04,'#e6dbc5',0,-.015,center,.012);b.flat(w,depth,'floor',0,.008,end,-PI/2);save('floor');
 // North work wall with a narrower doorway, not an enlarged door from global scaling.
 b=new Builder();const dl=-half+.75,dr=dl+.94,door=(dl+dr)/2;
 for(const[l,r]of[[-half,dl],[dr,half]])if(r>l){b.box(r-l,2.8,.13,'#e9dfcc',(l+r)/2,1.4,-2.965,.004);b.box(r-l,.085,.035,'#675c4c',(l+r)/2,.05,-2.88,.002);}
 b.box(.94,.54,.13,'#e9dfcc',door,2.53,-2.965,.004);for(const x of[dl,dr])b.box(.08,2.20,.14,'#745c47',x,1.10,-2.89,.004);b.box(1.02,.09,.14,'#745c47',door,2.2,-2.89,.004);b.box(.88,2.14,.04,'#a39a84',door,1.07,-3.00,.003);b.box(.11,.07,.065,'#5b5041',dr-.14,1.0,-2.95,.004);
 for(const[y,h,d,c]of[[2.73,.065,.22,'#f5ead3'],[2.81,.05,.28,'#e5d9c2'],[2.87,.04,.32,'#fff6df']])b.box(w+.13,h,d,c,0,y,-2.91,.006);save('backwall',{wall:true});
 b=new Builder();b.box(.14,.68,depth,'#eadfcb',half+.04,.34,center,.004);b.box(.14,.34,depth,'#eadfcb',half+.04,2.66,center,.004);
 for(const[l,r]of[[-2.9,win0],[win1,end]])b.box(.14,1.86,r-l,'#eadfcb',half+.04,1.6,(l+r)/2,.004);
 b.flat(ww,1.78,'window',half+.10,.74,wc,0,-PI/2,'#ffffff',{glow:.25,shadow:false});for(let i=0;i<4;i++)b.box(.075,1.84,.055,'#393d35',half-.035,1.61,win0+i*ww/3,.003);for(const y of[.70,2.51])b.box(.075,.06,ww+.10,'#393d35',half-.035,y,wc,.003);
 b.box(.035,.075,depth,'#675c4c',half-.04,.05,center,.002);for(const[y,h,dd,c]of[[2.73,.065,.22,'#f5ead3'],[2.81,.05,.28,'#e5d9c2'],[2.87,.04,.32,'#fff6df']])b.box(dd,h,depth+.10,c,half-.035,y,center,.006);save('eastwall',{wall:true});
 b=new Builder();b.box(.49,.075,ww+.08,'#ddd0b3',half-.24,.695,wc,.015);b.box(.42,.64,ww,'#e7dcc3',half-.20,.33,wc,.007);save('bay');
 b=new Builder();const spans=closed?[[-2.84,end-.03]]:[[-2.84,win0+.12],[win1-.08,end-.05]];for(const[l,r]of spans){const count=Math.ceil((r-l)/.07);for(let i=0;i<=count;i++){const z=l+(r-l)*i/count;b.cyl(.043,.049,2.52,i%3===0?'#e4dcca':'#f4eedf',half-.13,1.33,z,{shadow:false});}}save('curtains',{wall:true});
 b=new Builder();b.box(w,2.8,.13,'#c9bfaa',0,1.4,end+.045,.004);b.box(w,.075,.036,'#5d5548',0,.05,end-.04,.002);for(const[y,h,d,c]of[[2.73,.065,.22,'#f5ead3'],[2.81,.05,.28,'#e5d9c2'],[2.87,.04,.32,'#fff6df']])b.box(w+.13,h,d,c,0,y,end-.02,.006);save('screenWall',{wall:true});
 return out;};
// Automatically cut the near screen wall away without hiding the furniture in front of it.
function frontCut(r){const changed=[],cos=Math.cos(r.azimuth);for(const o of [...r.arch,...r.items])if(o.id==='screenWall'&&cos>.05||o.wallMount&&cos<-.12||o.ceiling&&r.top){changed.push([o,o.visible]);o.visible=false;}return()=>{for(const[o,v]of changed)o.visible=v;};}
for(const [Ctor,method]of[[N.Renderer,'render'],[N.CanvasRenderer,'frame']]){const old=Ctor.prototype[method];Ctor.prototype[method]=function(...args){const restore=frontCut(this);try{return old.apply(this,args);}finally{restore();}};}
A.customPreview=function(type){if(type==='turretAudio')return '<svg viewBox="0 0 180 140" aria-hidden="true"><ellipse cx="91" cy="131" rx="24" ry="5" fill="#c9c9b8"/><path d="M90 127V58" stroke="#d1cdbc" stroke-width="6"/><ellipse cx="91" cy="48" rx="24" ry="26" fill="#e4dfd0"/><circle cx="88" cy="47" r="20" fill="#bdc1b5"/><circle cx="88" cy="47" r="14" fill="#d7d9ce"/><circle cx="88" cy="47" r="5" fill="#a4ab9b"/></svg>';
 if(type==='christmasTree')return '<svg viewBox="0 0 180 140" aria-hidden="true"><path d="M85 110h10v22H85Z" fill="#948265"/><path d="m90 17 37 98H53Z" fill="#587b58"/><path d="m90 38 28 62H62Z" fill="#4d704e"/><path d="m90 9 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#c9ac65"/><circle cx="78" cy="76" r="5" fill="#c78267"/><circle cx="104" cy="97" r="5" fill="#d9bd7c"/><circle cx="87" cy="49" r="4" fill="#e9d6b1"/></svg>';
 if(type==='rubberlike')return oldPreview('roundleaf');return oldPreview(type);};
})();
