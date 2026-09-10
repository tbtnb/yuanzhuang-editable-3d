/* Mobile panels share one explicit state: closed, library, or details.
   Selecting/dragging an object never opens a panel. Desktop is unchanged. */
'use strict';
(()=>{
 const mq=matchMedia('(max-width:700px), (max-width:960px) and (max-height:520px)');
 const $=id=>document.getElementById(id),sidebar=$('sidebar'),inspector=$('inspector'),library=$('mobileLibrary'),label=$('selectionLabel');
 if(!sidebar||!inspector||!library||!label)return;
 let panel=null,lastFocus=null,selection=null;
 const dock=document.createElement('nav');dock.className='mobile-dock';dock.setAttribute('aria-label','手机布置工具');document.body.append(dock);dock.append(library);
 library.innerHTML='<span aria-hidden="true">▦</span><span class="library-caption">布局与物品</span>';library.setAttribute('aria-controls','sidebar');
 const details=document.createElement('button');details.id='mobileDetails';details.type='button';details.className='button';details.innerHTML='<span class="mobile-selected-name"></span><b>详情</b>';details.setAttribute('aria-controls','inspector');details.hidden=true;dock.append(details);
 const backdrop=document.createElement('button');backdrop.type='button';backdrop.id='mobileBackdrop';backdrop.hidden=true;backdrop.setAttribute('aria-label','收起面板，返回房间');document.body.append(backdrop);
 const bar=document.createElement('div');bar.className='mobile-panel-head';bar.innerHTML='<strong>布局与物品</strong><button type="button" id="closeLibrary" aria-label="收起布局与物品">收起 <span aria-hidden="true">×</span></button>';sidebar.prepend(bar);
 const oldCloseTitle=$('closeInspector').title,oldLabelHint=label.querySelector('small').textContent;
 function attr(el,name,value){if(el.getAttribute(name)!==String(value))el.setAttribute(name,String(value));}
 function focus(el){if(el&&!el.hidden)el.focus({preventScroll:true});}
 function sync(){
  const mobile=mq.matches,lib=mobile&&panel==='library',detail=mobile&&panel==='details'&&!!selection;
  sidebar.classList.toggle('open',lib);inspector.classList.toggle('mobile-detail-open',detail);
  sidebar.inert=mobile&&!lib;inspector.inert=mobile&&!detail;
  if(mobile){attr(sidebar,'aria-hidden',!lib);attr(inspector,'aria-hidden',!detail);}else{sidebar.removeAttribute('aria-hidden');inspector.removeAttribute('aria-hidden');}
  backdrop.hidden=!mobile||!panel;dock.hidden=!mobile;
  details.hidden=!selection;details.disabled=!selection;
  if(selection){details.querySelector('.mobile-selected-name').textContent=selection.name;attr(details,'aria-label','查看'+selection.name+'详情');}
  attr(library,'aria-expanded',lib);attr(details,'aria-expanded',detail);attr(label,'aria-expanded',detail);
  library.querySelector('.library-caption').textContent=lib?'收起面板':'布局与物品';
  if(mobile){attr(label,'role','button');attr(label,'aria-controls','inspector');label.tabIndex=selection?0:-1;label.querySelector('small').textContent='点此看详情';}
  else{label.removeAttribute('role');label.removeAttribute('aria-controls');label.tabIndex=-1;label.querySelector('small').textContent=oldLabelHint;}
  $('closeInspector').setAttribute('aria-label',mobile?'收起详情':'取消选择');$('closeInspector').title=mobile?'收起详情':oldCloseTitle;
  document.body.classList.toggle('mobile-panel-open',mobile&&!!panel);
 }
 function setPanel(next,restoreFocus=false){
  if(!mq.matches)next=null;if(next==='details'&&!selection)next=null;
  const previous=panel;if(next&&!previous)lastFocus=document.activeElement;panel=next;sync();
  if(next)requestAnimationFrame(()=>focus(next==='library'?$('closeLibrary'):$('closeInspector')));
  else if(restoreFocus)focus(previous==='library'?library:selection?details:lastFocus);
 }
 function toggleLibrary(e){if(!mq.matches)return;e.preventDefault();e.stopImmediatePropagation();setPanel(panel==='library'?null:'library',true);}
 library.addEventListener('click',toggleLibrary,true);
 details.addEventListener('click',()=>setPanel(panel==='details'?null:'details',true));
 $('closeLibrary').addEventListener('click',()=>setPanel(null,true));backdrop.addEventListener('click',()=>setPanel(null,true));
 $('closeInspector').addEventListener('click',e=>{if(!mq.matches)return;e.preventDefault();e.stopImmediatePropagation();setPanel(null,true);},true);
 label.addEventListener('click',e=>{if(!mq.matches)return;e.preventDefault();e.stopPropagation();setPanel(panel==='details'?null:'details',true);});
 label.addEventListener('keydown',e=>{if(mq.matches&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();setPanel('details');}});
 // Delegation also works when the app replaces the canvas for the 2D fallback renderer.
 document.addEventListener('pointerdown',e=>{if(mq.matches&&e.target.id==='roomCanvas'&&panel)setPanel(null);},true);
 window.addEventListener('nest:selection',e=>{selection=e.detail;if(mq.matches)setPanel(null);else sync();});
 window.addEventListener('nest:ready',()=>{selection=window.EastWindow?.getSelectedInfo()||null;sync();});
 // Applying a layout does not require a selected object, but should return to the room too.
 sidebar.addEventListener('click',e=>{if(mq.matches&&e.target.closest('[data-preset]'))setPanel(null);});
 document.addEventListener('keydown',e=>{
  if(!mq.matches||!panel||$('dialog').open)return;
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();setPanel(null,true);return;}
  if(e.key==='Tab'){const root=panel==='library'?sidebar:inspector,buttons=Array.from(root.querySelectorAll('button,input,select,a[href],[tabindex="0"]')).filter(el=>!el.disabled&&el.getClientRects().length);if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&(document.activeElement===first||!root.contains(document.activeElement))){e.preventDefault();focus(last);}else if(!e.shiftKey&&(document.activeElement===last||!root.contains(document.activeElement))){e.preventDefault();focus(first);}}
 },true);
 mq.addEventListener('change',()=>{panel=null;sync();});
 sync();
})();
