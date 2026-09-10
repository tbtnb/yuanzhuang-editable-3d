/* Photo-informed, intentionally approximate living-room geometry and plant catalogue. */
'use strict';
window.NestRoom=(()=>{
const {Builder,box,sphere,plane,lathe,mm,T,S,RX,RY,RZ,I}=Nest3D,PI=Math.PI;
const C={cream:'#e9dfc9',ivory:'#f5eedf',sofa:'#c8c4ad',dark:'#413b34',wood:'#a07956',gold:'#c6a34f',leaf:'#45794b'};
const plants={
 bird:{name:'鹤望兰类',latin:'Strelitzia sp. · 疑似大型鹤望兰',confidence:'中等置信',kind:'大型观叶',light:'优先留在能接到明亮自然光的窗边。',note:'根据高大蕉形叶片推测；仅凭照片不能排除相似植物或仿真叶材。',source:'https://plants.ces.ncsu.edu/plants/strelitzia-nicolai/',height:2.35},
 monstera:{name:'龟背竹类',latin:'Monstera sp.',confidence:'较高置信',kind:'裂叶观叶',light:'明亮散射光；展开叶片，避免被高株完全遮住。',note:'可见宽大开裂叶片；精确品种以及是否为切叶仍需近照确认。',source:'https://plants.ces.ncsu.edu/plants/monstera-deliciosa/',height:1.3},
 fern:{name:'蕨类 · 疑似肾蕨',latin:'Fern · species unconfirmed',confidence:'中等置信',kind:'细叶观叶',light:'明亮散射光；避开空调直吹，养护须先确认具体品种。',note:'黄绿色、细碎羽状叶片支持蕨类判断，未据此确认到种。',source:'https://plants.ces.ncsu.edu/plants/nephrolepis-exaltata/',height:.83},
 dracaena:{name:'龙血树类（待确认）',latin:'Dracaena-like foliage',confidence:'较低置信',kind:'线叶观叶',light:'先保持窗边散射光环境；确认品种后再细化养护。',note:'前景白盆的狭长簇生叶片可能属于龙血树类，远景照片不足以定种。',height:1.08},
 hydrangea:{name:'绣球花材（疑似）',latin:'Hydrangea-like flower heads',confidence:'中等置信',kind:'花卉 / 花材',light:'先确认是真盆栽、切花，还是仿真花材，三者养护不同。',note:'蓝紫色团状花序较像绣球。照片不能确定根系与花材状态。',height:.93},
 bamboo:{name:'线叶绿植（待确认）',latin:'Narrow-leaf arrangement',confidence:'较低置信',kind:'线叶花材',light:'当前仅作外形建模，不给未经确认的品种套用养护参数。',note:'边柜上的细叶枝条可能为富贵竹类或组合花材；需要叶片近照。',height:.78},
 unknown:{name:'窗台阔叶盆栽',latin:'Unidentified foliage plant',confidence:'待确认',kind:'小型观叶',light:'按原照片位置建模；请用下方品种选项手动校正。',note:'窗台小盆在照片中像素有限，不把绿萝、金钱树等候选当作已确认结果。',height:.45},
 flowers:{name:'橙红色花材',latin:'Flower arrangement · unconfirmed',confidence:'待确认',kind:'装饰花材',light:'切花 / 盆栽 / 仿真状态待确认，暂不计算植物养护适宜度。',note:'保留照片中的暖橙色花团与金色花器，不武断判断为某一花种。',height:.64}
};
let seed=827;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
function canvas(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c;}
function leafPath(ctx,w,h){ctx.beginPath();ctx.moveTo(w*.5,h*.99);ctx.bezierCurveTo(w*.05,h*.68,-w*.1,h*.22,w*.5,h*.03);ctx.bezierCurveTo(w*1.1,h*.22,w*.95,h*.68,w*.5,h*.99);ctx.closePath();}
function textures(){const tx={};for(const kind of ['bird','monstera','narrow'])tx[kind]=canvas(256,512,(c,w,h)=>{let gr=c.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#8fa964');gr.addColorStop(.46,kind==='monstera'?'#2e6244':'#4c813b');gr.addColorStop(.5,'#78954c');gr.addColorStop(1,'#386844');c.fillStyle=gr;leafPath(c,w,h);c.fill();if(kind==='monstera'){c.globalCompositeOperation='destination-out';for(let i=0;i<5;i++){let y=130+i*62;for(const s of [-1,1]){c.beginPath();c.moveTo(w*.5+s*140,y-35);c.quadraticCurveTo(w*.5+s*85,y+8,w*.5+s*24,y+46);c.quadraticCurveTo(w*.5+s*110,y+21,w*.5+s*150,y+2);c.closePath();c.fill();}}for(let i=0;i<3;i++)for(const s of[-1,1]){c.beginPath();c.ellipse(w*.5+s*22,240+i*53,6,14,s*.3,0,PI*2);c.fill();}c.globalCompositeOperation='source-over';}c.strokeStyle='rgba(210,220,153,.66)';c.lineWidth=2.5;c.beginPath();c.moveTo(w*.5,h*.97);c.lineTo(w*.5,h*.075);c.stroke();c.strokeStyle='rgba(202,219,139,.28)';c.lineWidth=1;for(let i=0;i<19;i++){const y=80+i*20;for(const s of[-1,1]){c.beginPath();c.moveTo(128,y+28);c.quadraticCurveTo(128+s*36,y+10,128+s*83*Math.sin(y/h*PI),y-8);c.stroke();}}});
 tx.rug=canvas(900,680,(c,w,h)=>{c.fillStyle='#bfbeb0';c.fillRect(0,0,w,h);const ox=w*.84,oy=h*.88;for(let i=0;i<140;i++){const a=i/140*PI*2,b=a+.012+rand()*.020,r=1500;c.beginPath();c.moveTo(ox,oy);c.lineTo(ox+Math.cos(a)*r,oy+Math.sin(a)*r);c.lineTo(ox+Math.cos(b)*r,oy+Math.sin(b)*r);c.closePath();c.fillStyle=['#e3dfd0','#787b6e','#a5a697','#d3cfbf','#565d51'][i%5];c.fill();}c.globalAlpha=.13;for(let i=0;i<7000;i++){c.fillStyle=rand()>.5?'#fff':'#504c42';c.fillRect(rand()*w,rand()*h,rand()*30,.8);}c.globalAlpha=1;});
 tx.floor=canvas(1000,800,(c,w,h)=>{c.fillStyle='#e9dfcc';c.fillRect(0,0,w,h);for(let i=0;i<8;i++)for(let j=0;j<7;j++){c.fillStyle=`rgba(255,255,255,${.05+rand()*.12})`;c.fillRect(i*125,j*125,124,124);}c.strokeStyle='rgba(151,123,92,.08)';c.lineWidth=1;for(let i=0;i<250;i++){c.beginPath();let x=rand()*w,y=rand()*h;c.moveTo(x,y);c.bezierCurveTo(x+30,y-20,x+60,y+20,x+rand()*170,y+rand()*60);c.stroke();}c.strokeStyle='#a38a6d';c.lineWidth=3;c.strokeRect(27,27,w-54,h-54);c.lineWidth=1.5;c.strokeRect(36,36,w-72,h-72);});
 for(let k=0;k<4;k++)tx['pillow'+k]=canvas(256,256,(c,w,h)=>{c.fillStyle=['#e8e6d1','#eee4c6','#426b54','#e5dfbf'][k];c.fillRect(0,0,w,h);for(let i=0;i<13;i++){c.save();c.translate(rand()*w,rand()*h);c.rotate(rand()*PI*2);let sc=.3+rand()*.5;c.scale(sc,sc);c.fillStyle=['#376951','#709674','#acbea0','#204f41'][i%4];leafPath(c,130,230);c.fill();c.strokeStyle='#b3c4a4';c.lineWidth=2;c.beginPath();c.moveTo(65,220);c.lineTo(65,15);c.stroke();c.restore();}if(k===1||k===3){for(let i=0;i<5;i++){let x=50+rand()*160,y=30+rand()*190;for(let j=0;j<5;j++){c.save();c.translate(x,y);c.rotate(j/5*PI*2);c.fillStyle=['#ed795e','#e95146','#f39170'][i%3];c.beginPath();c.ellipse(0,-17,17,27,0,0,PI*2);c.fill();c.restore();}c.fillStyle='#e8b16a';c.beginPath();c.arc(x,y,6,0,PI*2);c.fill();}}c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=5;c.strokeRect(3,3,250,250);});
 tx.screen=canvas(768,440,(c,w,h)=>{let g=c.createRadialGradient(430,215,5,400,200,470);g.addColorStop(0,'#102e56');g.addColorStop(1,'#040d1b');c.fillStyle=g;c.fillRect(0,0,w,h);for(let i=0;i<190;i++){c.fillStyle=`rgba(190,223,245,${rand()*.7})`;c.fillRect(rand()*w,rand()*h,rand()*1.8+1,1.2);}c.save();c.translate(w*.53,h*.52);for(let i=30;i>0;i--){c.strokeStyle=`rgba(58,181,247,${.02+i*.001})`;c.lineWidth=i*2;c.beginPath();c.ellipse(0,3,200,29,-.04,0,PI*2);c.stroke();}c.shadowColor='#7ad7ff';c.shadowBlur=17;c.lineWidth=9;c.strokeStyle='#8eddff';c.beginPath();c.ellipse(0,3,205,22,-.04,PI,PI*2);c.stroke();for(let i=16;i>0;i--){c.lineWidth=2;c.strokeStyle=`rgba(77,181,245,${.09+i*.018})`;c.beginPath();c.arc(0,-1,61+i*2,PI,0);c.stroke();}c.fillStyle='#031124';c.beginPath();c.arc(0,2,58,PI,0);c.fill();c.strokeStyle='#b6e5ff';c.lineWidth=4;c.beginPath();c.ellipse(0,3,206,15,-.04,0,PI);c.stroke();c.restore();for(let i=0;i<6;i++){c.fillStyle='#7da9c5';c.fillRect(12,12+i*27,10,13);}});
 tx.window=canvas(512,512,(c,w,h)=>{let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#cddcdb');g.addColorStop(1,'#eef0dd');c.fillStyle=g;c.fillRect(0,0,w,h);for(let k=0;k<3;k++){let x=k*190-50,y=k===1?80:140;c.fillStyle=['#cbc6b2','#dfd9c3','#c9cfbe'][k];c.fillRect(x,y,166,h-y);for(let j=0;j<8;j++)for(let i=0;i<3;i++){c.fillStyle='#a4b6b1';c.fillRect(x+13+i*51,y+20+j*55,30,35);c.fillStyle='#c0cdca';c.fillRect(x+16+i*51,y+23+j*55,24,28);}}c.fillStyle='rgba(246,241,222,.28)';c.fillRect(0,0,w,h);});
 tx.clock=canvas(256,256,(c,w,h)=>{c.fillStyle='#49433a';c.beginPath();c.arc(128,128,123,0,PI*2);c.fill();c.fillStyle='#f1ead4';c.beginPath();c.arc(128,128,109,0,PI*2);c.fill();c.strokeStyle='#625442';c.lineWidth=3;for(let i=0;i<12;i++){let a=i/12*PI*2;c.beginPath();c.moveTo(128+Math.sin(a)*94,128+Math.cos(a)*94);c.lineTo(128+Math.sin(a)*102,128+Math.cos(a)*102);c.stroke();}c.lineWidth=5;c.beginPath();c.moveTo(85,100);c.lineTo(128,128);c.lineTo(128,55);c.stroke();});
 tx.dart=canvas(256,256,(c,w,h)=>{for(let i=0;i<20;i++){const a=i/20*PI*2;for(const [r,col]of [[123,'#383a33'],[107,i%2?'#e8ddc3':'#46473b'],[82,i%2?'#9b5746':'#6a7860'],[74,i%2?'#e8ddc3':'#42473d']]){c.beginPath();c.moveTo(128,128);c.arc(128,128,r,a,a+PI/10);c.closePath();c.fillStyle=col;c.fill();}}c.fillStyle='#9b5746';c.beginPath();c.arc(128,128,12,0,PI*2);c.fill();});
 return tx;}
function pot(b,r=.2,h=.32,col=C.ivory){b.put(lathe([[r*.76,0],[r*.84,.025],[r,h*.9],[r,h],[r*.87,h],[r*.85,h-.05]]),col);b.cyl(r*.85,r*.85,.02,'#625640',0,h-.04,0);b.cyl(r*.88,r*.88,.024,'#c6bfa6',0,.012,0);}
function plant(b,type,variant=0){seed=500+variant*89;let small=type==='unknown',h=type==='bird'?.46:type==='monstera'?.32:small?.19:.29,r=type==='bird'?.23:type==='monstera'?.2:small?.125:.17;
 if(type==='flowers'){b.put(lathe([[.11,0],[.13,.02],[.14,.34],[.12,.37],[.10,.37]]),C.gold);for(let i=0;i<9;i++){let a=i*2.4,x=Math.sin(a)*.15,z=Math.cos(a)*.15,y=.43+rand()*.14;b.rod([0,.3,0],[x,y,z],.008,'#74854a');for(let j=0;j<6;j++)b.put(sphere(.055,.04,.05,8,5),['#e7a132','#df7542','#f1ba4c'][i%3],T(x+Math.sin(j)*.035,y+Math.cos(j)*.03,z));}return;}
 pot(b,r,h,type==='bird'?'#e9dfc5':type==='fern'?'#d8d2b5':C.ivory);
 if(type==='fern'){for(let i=0;i<17;i++){let a=i*2.399,dx=Math.sin(a),dz=Math.cos(a),len=.32+rand()*.2;let prev=[0,h,0];for(let j=1;j<=10;j++){let t=j/10,p=[dx*len*t,h+.31*Math.sin(t*2.0)+.08-dz*.01,dz*len*t];b.rod(prev,p,.005,'#8eac48');for(const side of[-1,1]){const m=mm(T(...p),mm(RY(a+side*.65),RX(1.0+t*.8)));b.put(plane(.038+.016*(1-t),.09*(1-t*.45)),i%3?'#a1bb53':'#77a34b',m,{tex:'narrow'});}prev=p;}}return;}
 if(type==='hydrangea'){for(let i=0;i<5;i++){let a=i*2.4,x=Math.sin(a)*.18,z=Math.cos(a)*.18,y=.58+rand()*.15;b.rod([0,h,0],[x,y,z],.012,'#55774d');for(let j=0;j<25;j++){let aa=j*2.4,zz=1-2*(j+.5)/25,rr=Math.sqrt(1-zz*zz)*.13;b.put(sphere(.042,.035,.038,7,5),['#a9a6c6','#c3bed6','#939dbb','#d5d1e3'][j%4],T(x+Math.cos(aa)*rr,y+zz*.1,z+Math.sin(aa)*rr));}b.put(plane(.18,.3),C.leaf,mm(T(x*.6,h+.05,z*.6),mm(RY(a),RX(1.05))),{tex:'bird'});}return;}
 if(type==='dracaena'||type==='bamboo'){const height=type==='dracaena'?.62:.46;for(let k=0;k<3;k++){let a=k*2.1,x=Math.sin(a)*.07,z=Math.cos(a)*.07;b.rod([x,h,z],[x,h+height-k*.1,z],.022,'#88855d');for(let i=0;i<9;i++){let f=i*2.4;b.put(plane(.10,.36),i%2?'#3a7145':'#648d50',mm(T(x,h+height-k*.1-.06,z),mm(RY(f),RX(.7+i%4*.3))),{tex:'narrow'});}}return;}
 let count=type==='bird'?12:type==='monstera'?9:9;for(let i=0;i<count;i++){let a=i*2.399+variant,base=type==='bird'?.7+rand()*.8:type==='monstera'?.45+rand()*.35:h+.08+rand()*.14,rad=type==='bird'?.16:type==='monstera'?.14:.075,px=Math.sin(a)*rad,pz=Math.cos(a)*rad,le=type==='bird'?.78+rand()*.38:type==='monstera'?.42+rand()*.29:.17+rand()*.17,w=type==='bird'?.33+rand()*.13:type==='monstera'?.35+rand()*.16:.11+rand()*.08,tilt=type==='bird'?.30+rand()*.95:.55+rand()*.85;
 b.rod([0,h,0],[px,base,pz],type==='bird'?.013:.009,'#527948');b.put(plane(w,le,.12),i%3?'#ffffff':'#d0daba',mm(T(px,base,pz),mm(RY(a),RX(tilt))),{tex:type==='monstera'?'monstera':'bird'});}
}
function model(o){const b=new Builder();switch(o.type){
case 'sofa':b.box(2.95,.24,.97,C.sofa,0,.29,0,.09);b.box(2.86,.49,.22,'#c1bea8',0,.68,-.40,.07);for(const x of[-1.39,1.39])b.box(.26,.31,.99,C.sofa,x,.58,0,.07);for(const x of[-.88,0,.88])b.box(.84,.20,.76,'#d0cbb6',x,.47,.06,.065);for(const x of[-1.27,1.27])for(const z of[-.33,.34])b.box(.09,.15,.09,C.dark,x,.075,z,.014);break;
case 'pillow':b.box(.53,.52,.13,'#d9d3bb',0,.26,0,.065);b.flat(.48,.46,'pillow'+o.variant,0,.025,.072,0,0);break;
case 'coffee':for(const x of[-.66,.66])for(const z of[-.28,.28])b.box(.055,.21,.055,C.dark,x,.12,z,.005);b.box(1.73,.19,.81,'#a29d8d',0,.31,0,.055);b.box(1.71,.045,.8,'#f5efdf',0,.425,0,.035);break;
case 'desk':b.box(2.34,.065,.79,C.ivory,0,.77,0,.026);b.box(1.8,.008,.53,'#bd8053',.12,.808,.09,.008);for(const x of[-1.02,1.02])for(const z of[-.29,.29])b.box(.045,.76,.055,C.dark,x,.38,z,.007);break;
case 'monitor':b.box(1.77,1.02,.055,'#323c3b',0,.59,0,.017);b.flat(1.69,.94,'screen',0,.12,.03,0,0,'#ffffff',{glow:1});b.box(.055,.12,.065,C.dark,0,.05,0,.005);b.box(.45,.025,.2,C.dark,0,.014,0,.012);break;
case 'laptop':b.box(.35,.015,.27,'#4e5450',0,.009,0,.012);b.box(.35,.23,.018,'#344145',0,.13,-.115,.008);b.flat(.32,.20,'screen',0,.029,-.103,0,0,'#ffffff',{glow:1});break;
case 'console':b.box(.085,.37,.23,'#232d33',0,.19,0,.015);for(const x of[-.06,.06])b.box(.035,.4,.24,'#f0eee2',x,.21,0,.018);break;
case 'keyboard':b.box(.40,.022,.15,C.dark,0,.012,0,.008);for(let i=0;i<12;i++)for(let j=0;j<4;j++)b.box(.027,.012,.026,i<4?'#424841':'#92a762',-.18+i*.032,.03,-.054+j*.034,.003);break;
case 'chair':b.box(.64,.13,.62,'#ece5d4',0,.43,0,.07);b.box(.60,.48,.12,'#ede8d8',0,.72,.25,.085);for(const x of[-.28,.28])b.box(.10,.23,.58,'#e8e1cf',x,.56,0,.046);for(const x of[-.24,.24])for(const z of[-.22,.22])b.box(.043,.39,.044,'#c3b18e',x,.20,z,.005);for(let x=-.21;x<.22;x+=.085)b.box(.006,.35,.004,'#d6ccb7',x,.72,.183,.001);break;
case 'side':b.box(.64,.56,.58,'#aba38c',0,.40,0,.025);for(let j=0;j<2;j++){b.box(.60,.255,.018,'#b4ac96',0,.28+j*.27,.301,.008);b.ball(.023,.023,.025,C.dark,0,.30+j*.27,.323);}b.box(.67,.04,.61,'#806447',0,.70,0,.015);for(const x of[-.24,.24])for(const z of[-.20,.20])b.box(.055,.14,.055,C.dark,x,.07,z,.004);break;
case 'sideboard':b.box(2.12,.08,.46,'#947454',0,.16,0,.018);b.box(2.10,.06,.47,'#b39367',0,.65,0,.015);for(const x of[-.97,.97])b.box(.08,.49,.41,'#a88a61',x,.41,0,.009);for(const x of[-.54,.02,.58])b.box(.53,.29,.36,'#ede2c8',x,.47,0,.008);break;
case 'bin':b.box(.37,.66,.31,'#c2ad87',0,.33,0,.035);b.box(.39,.025,.32,'#8d7759',0,.67,0,.009);b.box(.10,.017,.09,'#70624c',0,.04,.175,.004);break;
case 'pouf':b.ball(.46,.23,.46,'#dfb539',0,.24,0);b.ball(.43,.08,.41,'#eac758',0,.4,0);break;
case 'stack':for(let i=0;i<3;i++)b.box(.7,.08,.64,['#c4bbaa','#b87649','#e4dbc6'][i],0,.04+i*.08,0,.055,(i-1)*.07);b.box(.69,.055,.62,'#eee4ce',0,.29,0,.05);break;
case 'tea':b.box(.58,.024,.36,'#795138',0,.015,0,.014);b.cyl(.11,.08,.09,'#655641',-.14,.075,0);b.ball(.108,.06,.105,'#6d5b3e',-.14,.10,0);b.cyl(.085,.085,.016,'#a88a50',-.14,.165,0);b.ball(.022,.02,.022,C.gold,-.14,.19,0);for(const x of[.03,.17])for(const z of[-.09,.09])b.put(lathe([[.026,0],[.038,.047],[.031,.052],[.022,.012]]),C.gold,T(x,.03,z));b.cyl(.04,.038,.19,C.dark,.26,.12,-.05);for(let i=0;i<3;i++)b.rod([.24+i*.012,.06,-.05],[.23+i*.021,.26,-.05],.006,'#c0aa7b');break;
case 'tissue':b.box(.22,.09,.13,'#f0e9d7',0,.05,0,.015);b.box(.09,.04,.065,'#fffaf0',0,.112,0,.013);break;
case 'books':for(let i=0;i<3;i++)b.box(.28,.038,.19,['#b58964','#e7d8b9','#7f957a'][i],0,.023+i*.04,0,.003,i*.04);break;
case 'speaker':b.cyl(.14,.14,.045,C.dark,0,.025,0);b.cyl(.016,.016,1.05,'#726348',0,.54,0);b.box(.30,.22,.24,'#9b8770',0,1.12,0,.02);b.box(.27,.15,.013,'#494b46',0,1.12,.127,.005);break;
case 'rug':b.box(4.35,.025,3.2,'#c0bfae',0,.016,0,.012);b.flat(4.33,3.18,'rug',0,.031,1.59,-PI/2,0);break;
case 'clock':b.flat(.46,.46,'clock',0,-.23,.008,0,0);break;
case 'dart':b.flat(.46,.46,'dart',0,-.23,.008,0,0);break;
case 'chandelier':b.rod([0,0,0],[0,-.4,0],.018,C.dark);for(let i=0;i<6;i++){let a=i*PI/3,x=Math.sin(a)*.42,z=Math.cos(a)*.42;b.rod([0,-.4,0],[x,-.35,z],.016,C.dark);b.cyl(.09,.09,.19,'#d6c9ab',x,-.26,z);for(let j=0;j<8;j++){let f=j/8*PI*2;b.rod([x+.095*Math.sin(f),-.35,z+.095*Math.cos(f)],[x+.095*Math.sin(f),-.15,z+.095*Math.cos(f)],.004,C.gold);}}break;
case 'pendants':for(let i=0;i<3;i++){let x=(i-1)*.4,h=.2+i*.10;b.rod([x,0,0],[x,-h,0],.008,C.dark);for(let k=0;k<6;k++){let a=k/6*PI*2,aa=(k+1)/6*PI*2;b.rod([x,-h,0],[x+.21*Math.sin(a),-h-.34,.21*Math.cos(a)],.006,C.gold);b.rod([x+.21*Math.sin(a),-h-.34,.21*Math.cos(a)],[x+.21*Math.sin(aa),-h-.34,.21*Math.cos(aa)],.006,C.gold);b.rod([x+.21*Math.sin(a),-h-.34,.21*Math.cos(a)],[x+.14*Math.sin(a),-h-.43,.14*Math.cos(a)],.006,C.gold);}}break;
default:plant(b,o.species||'unknown',o.variant||0);
}return b.finish();}
function architecture(closed=false){const out=[];function item(id,b,props={}){out.push({id,x:0,z:0,model:I(),parts:b.finish(),...props});}
let b=new Builder();b.box(7.45,.22,6.05,'#bfb39a',0,-.14,0,.07);b.box(7.25,.04,5.85,'#e6dac0',0,-.015,0,.02);b.flat(7.2,5.8,'floor',0,.011,2.9,-PI/2);item('floor',b);
b=new Builder();b.box(.82,2.8,.15,C.cream,-3.19,1.4,-2.96,.005);b.box(4.93,2.8,.15,C.cream,1.135,1.4,-2.96,.005);b.box(1.45,.50,.15,C.cream,-2.1,2.55,-2.96,.005);b.box(.10,2.23,.16,'#6a5140',-2.78,1.11,-2.85,.006);b.box(.10,2.23,.16,'#6a5140',-1.42,1.11,-2.85,.006);b.box(1.46,.10,.16,'#6a5140',-2.10,2.2,-2.85,.006);b.box(1.26,2.15,.03,'#8c8573',-2.1,1.075,-3.04,.004);b.box(1.13,2.06,.03,'#b5ac96',-2.06,1.03,-3.00,.004);b.box(.16,.10,.1,C.dark,-1.61,1.02,-2.93,.009);for(const[y,d,h,c]of[[2.73,.22,.06,'#f8f0da'],[2.80,.28,.05,'#ebe1ca'],[2.86,.33,.05,'#fcf5e3']])b.box(7.3,h,d,c,0,y,-2.91,.008);b.box(4.94,.08,.04,'#685744',1.13,.05,-2.85,.002);b.box(.82,.08,.04,'#685744',-3.19,.05,-2.85,.002);item('backwall',b,{wall:true});
b=new Builder();b.box(.15,.68,5.8,C.cream,3.64,.34,0,.005);b.box(.15,.34,5.8,C.cream,3.64,2.65,0,.005);b.box(.15,1.8,.37,C.cream,3.64,1.57,-2.72,.005);b.box(.15,1.8,.37,C.cream,3.64,1.57,2.72,.005);b.flat(5.13,1.73,'window',3.70,.75,0,0,-PI/2,'#ffffff',{glow:.55,shadow:false});for(const z of[-2.58,-.88,.86,2.58])b.box(.08,1.8,.06,'#4f5145',3.55,1.60,z,.004);for(const y of[.71,2.49])b.box(.08,.07,5.22,'#4f5145',3.55,y,0,.004);for(const [y,w,h,c]of[[2.73,.25,.06,'#f8f0da'],[2.80,.30,.05,'#ebe1ca'],[2.86,.34,.05,'#fcf5e3']])b.box(w,h,5.9,c,3.56,y,0,.008);b.box(.04,.08,5.8,'#685744',3.53,.05,0,.002);item('eastwall',b,{wall:true});
b=new Builder();b.box(.54,.075,5.18,'#ddd1b5',3.32,.695,0,.02);b.box(.42,.64,5.13,'#e4d9c2',3.38,.33,0,.007);item('bay',b);
b=new Builder();for(const side of[-1,1]){const n=closed?31:8;for(let i=0;i<n;i++){let z=side*(2.58-i*(closed?.081:.061));b.cyl(.059,.067,2.44,i%3===0?'#e4dcca':'#f2ecda',3.39+Math.sin(i*2)*.016,1.30,z,{shadow:false});}}item('curtains',b,{wall:true});
return out;}
const base=[];function o(id,name,type,x,z,w,d,more={}){base.push({id,name,type,x,z,w,d,r:0,y:0,visible:true,category:'furniture',...more});}
o('rug','放射纹地毯','rug',.5,1.00,4.35,3.2,{category:'decor'});
o('sofa','米色三人沙发','sofa',.4,-.13,2.95,.99);
for(let i=0;i<4;i++)o('pillow'+i,['绿叶抱枕','橙花抱枕','深绿抱枕','红花抱枕'][i],'pillow',-1+i*.65,-.29,.53,.13,{parent:'sofa',y:.55,variant:i,category:'decor'});
o('coffee','白石面茶几','coffee',.50,1.22,1.73,.81);
o('tea','茶盘与茶具组','tea',.35,0,.58,.36,{parent:'coffee',y:.45,category:'decor'});
o('tissue','纸巾盒','tissue',-.51,.06,.22,.13,{parent:'coffee',y:.45,category:'decor'});
o('desk','大屏工作台','desk',.23,-2.40,2.34,.79);
o('monitor','蓝色大屏','monitor',-.25,-.18,1.77,.10,{parent:'desk',y:.81,category:'electronics'});
o('laptop','笔记本电脑','laptop',.79,-.02,.35,.27,{parent:'desk',y:.81,category:'electronics'});
o('console','白色游戏主机','console',1.02,-.22,.16,.24,{parent:'desk',y:.81,category:'electronics'});
o('keyboard','绿键机械键盘','keyboard',.19,.19,.40,.15,{parent:'desk',y:.81,category:'electronics'});
o('chair1','奶油色扶手椅 A','chair',-.52,-1.53,.66,.65);
o('chair2','奶油色扶手椅 B','chair',.69,-1.53,.66,.65,{r:-.16});
o('pouf','黄色懒人沙发','pouf',2.52,1.30,.92,.92);
o('stack','叠放的坐垫','stack',0,0,.73,.68,{parent:'pouf',y:.43,category:'decor'});
o('side','双抽屉边柜','side',2.43,-.13,.67,.61);
o('books','边柜书本','books',-.11,.04,.28,.2,{parent:'side',y:.73,category:'decor'});
o('bouquet','金瓶橙色花材','plant',.14,-.08,.30,.30,{parent:'side',y:.73,category:'plants',species:'flowers'});
o('speaker','落地音箱 / 灯架','speaker',2.89,-.76,.30,.3,{category:'electronics'});
o('sideboard','长边柜','sideboard',-3.27,-.25,2.12,.47,{r:PI/2});
o('bamboo','边柜线叶绿植','plant',-.72,0,.34,.34,{parent:'sideboard',y:.685,category:'plants',species:'bamboo'});
o('bin','金米色垃圾桶','bin',-2.93,-1.65,.39,.34);
o('clock','圆形挂钟','clock',-3.16,-2.84,.46,.03,{y:1.84,category:'decor',wallMount:true});
o('dart','飞镖盘','dart',-1.03,-2.84,.46,.03,{y:1.92,category:'decor',wallMount:true});
o('chandelier','黑金水晶吊灯','chandelier',.38,-.05,1.04,1.04,{y:2.84,ceiling:true,category:'lighting'});
o('pendants','金色几何吊灯组','pendants',-2.45,1.72,1.3,.45,{y:2.86,ceiling:true,category:'lighting'});
o('bird','窗边大型鹤望兰类','plant',2.80,-2.17,.46,.46,{species:'bird',category:'plants',variant:1});
o('monstera','大叶龟背竹类','plant',2.53,-1.12,.44,.44,{species:'monstera',category:'plants',variant:2});
o('fern','黄绿色蕨类','plant',1.91,-1.13,.40,.40,{species:'fern',category:'plants',variant:3});
o('hydrangea','蓝紫色绣球花材','plant',2.18,-1.85,.38,.38,{species:'hydrangea',category:'plants',variant:4});
o('dracaena','前景线叶植物','plant',2.95,.45,.36,.36,{species:'dracaena',category:'plants',variant:5});
for(let i=0;i<9;i++)o('sill'+i,'窗台小盆 '+String.fromCharCode(65+i),'plant',3.30,-1.68+i*.41,.25,.25,{y:.74,surface:'bay',species:'unknown',variant:i+6,category:'plants'});
const presets=[
{id:'original',name:'照片原位',eyebrow:'01 / PHOTO STORY',tag:'忠于照片',desc:'沙发背后的工作区，窗边的茂盛绿意。保留你家熟悉的样子。',tip:'原位方案保留照片关系，不代表所有位置的自然光已经足够。',changes:{}},
{id:'garden',name:'追光小森林',eyebrow:'02 / MORNING GARDEN',tag:'推荐 · 养护优先',desc:'高株更靠明亮窗面，盆栽错落分组，把浇水和椅子后撤的位置留出来。',tip:'优先给大型观叶留出窗边位置；窗台分组留白。仍需观察真实晨光与对面楼遮挡。',changes:{sofa:[-.03,.25,0],coffee:[-.02,1.60,0],rug:[.24,1.25,0],desk:[-.36,-2.42,0],chair1:[-1.03,-1.50,0],chair2:[.20,-1.5,-.12],side:[1.89,.20,0],pouf:[2.42,1.7,0],bird:[2.80,-1.84,0],monstera:[2.79,-.93,0],fern:[2.54,.83,0],hydrangea:[2.89,-2.48,0],dracaena:[2.92,.08,0],speaker:[2.66,-.26,0],sill0:[3.30,-2.10,0],sill1:[3.30,-1.75,0],sill2:[3.30,-1.4,0],sill3:[3.30,-.42,0],sill4:[3.30,-.07,0],sill5:[3.30,.28,0],sill6:[3.30,1.2,0],sill7:[3.30,1.55,0],sill8:[3.30,1.9,0]}},
{id:'cinema',name:'观影围合',eyebrow:'03 / SLOW EVENING',tag:'屏幕朝向优化',desc:'把沙发转向大屏。茶几与黄色坐垫围成一个适合电影夜的小角落。',tip:'沙发面向现有大屏；这个方案偏重观影，工作椅的日常收放也要一起考虑。',changes:{sofa:[.20,1.77,PI],coffee:[.20,.44,PI],rug:[.42,.96,0],pouf:[2.15,.65,0],side:[1.99,1.77,0],chair1:[-1.73,-1.34,-.22],chair2:[1.85,-1.37,.22],desk:[.08,-2.42,0],bird:[2.86,-2.12,0],monstera:[2.78,-.51,0],fern:[2.58,2.25,0],dracaena:[2.92,1.62,0],hydrangea:[2.91,-1.32,0],speaker:[2.49,-1.01,0]}},
{id:'airy',name:'清爽留白',eyebrow:'04 / ROOM TO BREATHE',tag:'通道更敞开',desc:'沙发转向东窗，中央留白。把工作、休息和植物照料分成三个小区域。',tip:'适合看窗景、聊天和植物养护；并非正对大屏的观影布局。家具尺寸需现场复核。',changes:{sofa:[-1.97,.17,PI/2],coffee:[-.60,.20,PI/2],rug:[-.90,.56,PI/2],side:[-2.0,2.02,0],pouf:[.52,1.98,0],desk:[-.30,-2.42,0],chair1:[-.93,-1.45,0],chair2:[.36,-1.45,-.12],sideboard:[-3.20,-.35,PI/2],bird:[2.85,-2.13,0],monstera:[2.73,.28,0],fern:[2.46,1.28,0],hydrangea:[2.80,-1.40,0],dracaena:[2.87,2.13,0],speaker:[2.80,-.53,0]}}
];
return {textures,model,architecture,plants,base,presets,C,room:{w:7.2,d:5.8,h:2.85}};
})();
