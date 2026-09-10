/* Phone-only detail behavior: selection stays lightweight; details open explicitly. */
'use strict';
(()=>{
  const mq=window.matchMedia('(max-width:700px)');
  const inspector=document.getElementById('inspector');
  const canvas=document.getElementById('roomCanvas');
  const label=document.getElementById('selectionLabel');
  const labelHint=label?.querySelector('small');
  const closeBtn=document.getElementById('closeInspector');
  if(!inspector||!canvas||!label)return;

  function selected(){return inspector.classList.contains('open');}
  function setLabelHint(){
    if(!labelHint)return;
    labelHint.textContent=mq.matches?'点此看详情':'拖动摆放';
  }
  function closeDetails(){
    inspector.classList.remove('mobile-detail-open');
    label.setAttribute('aria-expanded','false');
  }
  function sync(){
    setLabelHint();
    if(!mq.matches||!selected())closeDetails();
    label.tabIndex=mq.matches&&selected()?0:-1;
    label.setAttribute('role',mq.matches?'button':'status');
    label.setAttribute('aria-label',mq.matches?'查看所选物品详情':'当前选中物品');
  }
  function toggleDetails(){
    if(!mq.matches||!selected())return;
    const open=!inspector.classList.contains('mobile-detail-open');
    inspector.classList.toggle('mobile-detail-open',open);
    label.setAttribute('aria-expanded',String(open));
    if(open){
      const heading=inspector.querySelector('.object-heading, h2, h3');
      requestAnimationFrame(()=>heading?.scrollIntoView({block:'nearest'}));
    }
  }

  label.addEventListener('click',e=>{
    if(!mq.matches)return;
    e.preventDefault();
    e.stopPropagation();
    toggleDetails();
  });
  label.addEventListener('keydown',e=>{
    if(!mq.matches)return;
    if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleDetails();}
  });

  /* Any attempt to manipulate the room immediately gives the canvas back its space. */
  canvas.addEventListener('pointerdown',()=>{if(mq.matches)closeDetails();},{capture:true,passive:true});

  /* On phones, the X in the detail drawer collapses it while keeping the object selected. */
  closeBtn?.addEventListener('click',e=>{
    if(!mq.matches||!inspector.classList.contains('mobile-detail-open'))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    closeDetails();
  },true);

  /* Selecting another object never auto-opens its detail drawer. */
  const name=document.getElementById('selectionName');
  if(name)new MutationObserver(()=>{if(mq.matches)closeDetails();}).observe(name,{childList:true,characterData:true,subtree:true});
  new MutationObserver(sync).observe(inspector,{attributes:true,attributeFilter:['class']});
  mq.addEventListener?.('change',sync);
  sync();
})();
