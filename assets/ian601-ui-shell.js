
(function(){
  'use strict';

  function make(tag,className,text){
    var node=document.createElement(tag);
    if(className) node.className=className;
    if(text!==undefined) node.textContent=text;
    return node;
  }
  function byIds(ids){
    for(var i=0;i<ids.length;i++){
      var node=document.getElementById(ids[i]);
      if(node) return node;
    }
    return null;
  }
  function moduleMeta(){
    var t=document.title||'';
    var m=t.match(/(?:IAN\s*601\s*[·|:-]?\s*)?Module\s*(\d+)\s*(?:[·|:-]\s*)?(.*?)(?:\s*\|\s*IAN\s*601)?$/i);
    var n=m?m[1]:'';
    var name=m?(m[2]||'').trim():'';
    name=name.replace(/Slide Lesson$/i,'').trim();
    if(!n){
      var badge=document.querySelector('.slide-badge,.kicker');
      var bm=badge && (badge.textContent||'').match(/Module\s*(\d+)/i);
      if(bm) n=bm[1];
    }
    if(!name){
      var h=document.querySelector('.slide h2,.slide h1');
      if(h) name=(h.textContent||'').trim();
    }
    return {number:n||'',name:name||'Data Analytics Methods and Approaches'};
  }

  function setupHeader(){
    var bar=document.querySelector('.topbar');
    if(!bar || bar.dataset.ian601Shell==='ready') return;
    bar.dataset.ian601Shell='ready';

    var meta=moduleMeta();
    var oldBrand=bar.querySelector(':scope > .brand');
    var oldControl=bar.querySelector(':scope > .toolbar, :scope > .controls, :scope > .top-actions, :scope > .top-controls');
    if(oldBrand) oldBrand.classList.add('shell-original-hidden');
    if(oldControl) oldControl.classList.add('shell-original-hidden');

    var mark=make('div','shell-brand-mark','PY');
    var wrap=make('div','shell-title-wrap');
    wrap.appendChild(make('div','shell-module-title','Module '+meta.number));
    wrap.appendChild(make('div','shell-course-title','IAN 601 · '+meta.name));

    var runtime=byIds(['runtime','runtime-status','pyStatus']);
    if(runtime){
      runtime.classList.add('shell-runtime');
      if(runtime.id==='runtime'){
        var rt=runtime.querySelector('#runtime-text');
        if(rt) runtime=rt;
      }
    }

    var status=make('div','shell-status');
    var slideText=make('span','shell-status-text','Slide 1');
    slideText.id='shellStatusText';
    var sep=make('span','shell-status-sep','·');
    var pct=make('span','shell-status-pct','0%');
    pct.id='shellStatusPct';
    status.append(slideText,sep,pct);

    var actions=make('div','shell-actions');
    var progress=byIds(['ian-progress-btn','learningProgressBtn','progressBtn']);
    var run=byIds(['run-slide-btn','runSlideBtn']);
    var modules=byIds(['ian-course-modules-btn','courseModulesBtn','modulesBtn']);
    var theme=byIds(['theme-btn','theme-toggle','themeBtn']);
    var full=byIds(['fullscreen-btn','ian-fullscreen-btn','fullBtn']);
    var reset=byIds(['restart-python','resetPythonBtn']);

    if(progress){
      progress.classList.add('shell-progress-action');
      actions.appendChild(progress);
    }
    if(run){
      run.classList.add('shell-run-action');
      actions.appendChild(run);
    }

    var settingsWrap=make('div','shell-settings-wrap');
    var settingsBtn=make('button','shell-settings-btn','⚙ Settings');
    settingsBtn.type='button';
    settingsBtn.setAttribute('aria-expanded','false');
    var menu=make('div','shell-settings-menu');
    menu.setAttribute('role','menu');

    [theme,reset,full].forEach(function(node){
      if(node){
        node.setAttribute('role','menuitem');
        menu.appendChild(node);
      }
    });

    var autoBtn=make('button','','Auto-hide Off');
    autoBtn.type='button';
    autoBtn.id='shellAutoHideBtn';
    autoBtn.setAttribute('role','menuitem');
    menu.appendChild(autoBtn);

    settingsWrap.append(settingsBtn,menu);
    actions.appendChild(settingsWrap);

    if(modules){
      modules.textContent='☰ Modules';
      actions.appendChild(modules);
    }

    bar.append(mark,wrap);
    if(runtime && runtime.parentElement && !runtime.closest('.shell-original-hidden')) bar.appendChild(runtime);
    bar.append(status,actions);

    settingsBtn.addEventListener('click',function(e){
      e.stopPropagation();
      var open=menu.classList.toggle('open');
      settingsBtn.setAttribute('aria-expanded',open?'true':'false');
    });
    menu.addEventListener('click',function(e){
      if(e.target!==autoBtn){
        menu.classList.remove('open');
        settingsBtn.setAttribute('aria-expanded','false');
      }
    });
    autoBtn.addEventListener('click',function(){
      var on=document.body.classList.toggle('shell-auto-hide');
      autoBtn.textContent=on?'Auto-hide On':'Auto-hide Off';
      menu.classList.remove('open');
      settingsBtn.setAttribute('aria-expanded','false');
    });
    document.addEventListener('click',function(e){
      if(!settingsWrap.contains(e.target)){
        menu.classList.remove('open');
        settingsBtn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){
        menu.classList.remove('open');
        settingsBtn.setAttribute('aria-expanded','false');
      }
    });

    if(oldControl){
      var remaining=[].slice.call(oldControl.children);
      if(remaining.length){
        var legacy=make('div','shell-legacy-status');
        remaining.forEach(function(node){legacy.appendChild(node)});
        bar.appendChild(legacy);
      }
    }
  }

  function setupFooter(){
    var footer=document.querySelector('footer.ian603-bottombar, footer.bottombar');
    if(!footer || footer.dataset.ian601Shell==='ready') return;
    footer.dataset.ian601Shell='ready';

    var audio=footer.querySelector('.audio-block');
    var left=footer.querySelector('.footer-left,.nav-left');
    var right=footer.querySelector('.footer-right,.nav-right');
    var navPanel=footer.querySelector('.bottom-nav-panel');
    if(!navPanel){
      navPanel=[].slice.call(footer.querySelectorAll('.bottom-nav')).find(function(n){return n!==footer;})||null;
    }

    if(audio && left && right && navPanel){
      var nav=make('div','presentation-nav');
      nav.setAttribute('aria-label','Slide navigation');
      var prev=left.querySelector('button');
      var next=right.querySelector('button');
      if(prev){
        prev.textContent='‹';
        prev.setAttribute('aria-label','Previous slide');
      }
      if(next){
        next.textContent='›';
        next.setAttribute('aria-label','Next slide');
      }
      nav.append(left,navPanel,right);
      footer.append(audio,nav);
    }

    var start=byIds(['start-narration-btn','startNarration']);
    var toggle=byIds(['narration-toggle-btn','narrationToggle']);
    if(start && toggle) start.classList.add('shell-redundant-start');

    var subtitle=byIds(['subtitle-bar','subtitleBar']);
    if(subtitle) subtitle.classList.add('caption-strip');

    var player=byIds(['audioPlayer']) || footer.querySelector('.audio-player');
    var play=byIds(['audio-play-btn','audioPlay']);
    if(player && play) player.insertBefore(play,player.firstChild);
  }

  function syncCc(){
    var cc=byIds(['cc-toggle-btn','ccToggle']);
    var subtitle=byIds(['subtitle-bar','subtitleBar']);
    var on=true;
    if(cc){
      var pressed=cc.getAttribute('aria-pressed');
      if(pressed==='true') on=true;
      else if(pressed==='false') on=false;
      else on=!/\boff\b/i.test(cc.textContent||'');
    }else if(subtitle){
      on=!subtitle.hidden;
    }
    document.body.classList.toggle('shell-cc-off',!on);
  }

  function setupCc(){
    var cc=byIds(['cc-toggle-btn','ccToggle']);
    var subtitle=byIds(['subtitle-bar','subtitleBar']);
    if(cc){
      cc.addEventListener('click',function(){setTimeout(syncCc,0)});
      try{new MutationObserver(syncCc).observe(cc,{attributes:true,attributeFilter:['aria-pressed']});}catch(e){}
    }
    if(subtitle){
      try{new MutationObserver(syncCc).observe(subtitle,{attributes:true,attributeFilter:['hidden','style','class']});}catch(e){}
    }
    syncCc();
  }

  function setupProgress(){
    function getSlides(){
      return [].slice.call(document.querySelectorAll('main.stage .slide, main.slides .slide'));
    }
    function activeIndex(slides){
      var idx=slides.findIndex(function(s){return s.classList.contains('active')});
      if(idx>=0) return idx;
      var select=byIds(['slide-select','slideSelect']);
      if(select && select.selectedIndex>=0) return Math.min(select.selectedIndex,slides.length-1);
      return 0;
    }
    function sync(){
      var slides=getSlides();
      if(!slides.length) return;
      var idx=activeIndex(slides);
      var num=idx+1;
      var total=slides.length;
      var pct=Math.max(1,Math.round(num/total*100));
      var st=document.getElementById('shellStatusText');
      var sp=document.getElementById('shellStatusPct');
      if(st) st.textContent='Slide '+num+'/'+total;
      if(sp) sp.textContent=pct+'%';
    }

    var slides=getSlides();
    slides.forEach(function(slide,index){
      try{new MutationObserver(sync).observe(slide,{attributes:true,attributeFilter:['class']});}catch(e){}
      var foot=slide.querySelector('.slide-footer');
      if(foot){
        var spans=foot.querySelectorAll('span');
        if(spans.length) spans[spans.length-1].textContent='Slide '+(index+1);
        else foot.textContent='Slide '+(index+1);
      }
      var num=slide.querySelector('.slide-num');
      if(num) num.textContent='Slide '+(index+1);
    });

    var select=byIds(['slide-select','slideSelect']);
    if(select) select.addEventListener('change',function(){setTimeout(sync,0)});
    var prev=byIds(['prev-btn','prevBtn']);
    var next=byIds(['next-btn','nextBtn']);
    if(prev) prev.addEventListener('click',function(){setTimeout(sync,0)});
    if(next) next.addEventListener('click',function(){setTimeout(sync,0)});
    document.addEventListener('keydown',function(e){
      if(['ArrowLeft','ArrowRight','PageUp','PageDown','Home','End'].indexOf(e.key)>=0) setTimeout(sync,0);
    });

    var stage=document.querySelector('main.stage,main.slides');
    if(stage){
      try{
        new MutationObserver(function(){
          var current=getSlides();
          current.forEach(function(slide){
            if(!slide.dataset.shellObserved){
              slide.dataset.shellObserved='1';
              try{new MutationObserver(sync).observe(slide,{attributes:true,attributeFilter:['class']});}catch(e){}
            }
          });
          sync();
        }).observe(stage,{childList:true,subtree:false});
      }catch(e){}
    }
    sync();
  }

  function init(){
    if(document.body.classList.contains('ian601-shell')) return;
    var meta=moduleMeta();
    var moduleNumber=Number(meta.number || 0);
    document.body.classList.add('ian601-shell');
    if(moduleNumber && (moduleNumber <= 4 || moduleNumber >= 10)){
      document.body.classList.add('shell-legacy-layout');
    }else{
      document.body.classList.add('shell-modern-layout');
    }
    setupHeader();
    setupFooter();
    setupCc();
    setupProgress();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();


/* IAN601_PYTHON_FOCUS_SHARED_START */
(function(){
  'use strict';

  function ready(fn){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true});
    else fn();
  }

  ready(function(){
    var activeBox=null;

    function actionBar(box){
      return box.querySelector('.cell-actions');
    }
    function editorTextarea(box){
      return box.querySelector('textarea.code-input');
    }
    function monacoInput(box){
      return box.querySelector('.monaco-host .monaco-editor textarea.inputarea, .monaco-host textarea.inputarea');
    }
    function layoutMonaco(box){
      try{
        if(!window.monaco || !window.monaco.editor || typeof window.monaco.editor.getEditors!=='function') return;
        var host=box ? box.querySelector('.monaco-host') : null;
        window.monaco.editor.getEditors().forEach(function(editor){
          try{
            var node=editor.getDomNode && editor.getDomNode();
            if(host && node && !host.contains(node)) return;
            if(host && host.clientWidth>0 && host.clientHeight>0){
              editor.layout({width:host.clientWidth,height:host.clientHeight});
            }else{
              editor.layout();
            }
          }catch(e){}
        });
      }catch(e){}
    }
    function resizeEditors(box){
      try{ window.dispatchEvent(new Event('resize')); }catch(e){}
      requestAnimationFrame(function(){
        layoutMonaco(box);
        requestAnimationFrame(function(){
          layoutMonaco(box);
        });
      });
      setTimeout(function(){
        try{ window.dispatchEvent(new Event('resize')); }catch(e){}
        layoutMonaco(box);
      },180);
    }
    function closeFocus(){
      if(!activeBox) return;
      var box=activeBox;
      var btn=box.querySelector('.python-focus-toggle');
      box.classList.remove('ian601-python-focus');
      document.body.classList.remove('python-focus-open');
      if(btn){
        btn.textContent='Expand';
        btn.setAttribute('aria-label','Expand Python editor');
        btn.setAttribute('aria-pressed','false');
        btn.title='Open a larger Python workspace';
      }
      activeBox=null;
      resizeEditors(box);
    }
    function openFocus(box){
      if(activeBox && activeBox!==box) closeFocus();
      activeBox=box;
      var btn=box.querySelector('.python-focus-toggle');
      box.classList.add('ian601-python-focus');
      document.body.classList.add('python-focus-open');
      if(btn){
        btn.textContent='Back to slide';
        btn.setAttribute('aria-label','Back to slide');
        btn.setAttribute('aria-pressed','true');
        btn.title='Return to the regular slide view';
      }
      requestAnimationFrame(function(){
        resizeEditors(box);
        var input=monacoInput(box) || editorTextarea(box);
        if(input){
          try{ input.focus({preventScroll:true}); }catch(e){ try{input.focus();}catch(_){} }
        }
      });
    }
    function buttonClass(actions){
      if(actions.querySelector('.control')) return 'control python-focus-toggle';
      if(actions.querySelector('.btn')) return 'btn ghost python-focus-toggle';
      return 'python-focus-toggle';
    }
    function enhanceBox(box){
      if(box.dataset.ian601PythonFocus==='ready') return;
      var textarea=editorTextarea(box);
      var monaco=box.querySelector('.monaco-host');
      if(!textarea && !monaco) return;

      var actions=actionBar(box);
      if(!actions){
        var head=box.querySelector('.cell-head');
        if(head){
          actions=document.createElement('div');
          actions.className='cell-actions';
          head.appendChild(actions);
        }
      }
      if(!actions) return;

      box.dataset.ian601PythonFocus='ready';

      var existing=actions.querySelector('.python-focus-toggle,.python-expand,.code-expand');
      if(existing){
        existing.classList.add('python-focus-toggle');
        return;
      }

      var btn=document.createElement('button');
      btn.type='button';
      btn.className=buttonClass(actions);
      btn.textContent='Expand';
      btn.setAttribute('aria-label','Expand Python editor');
      btn.setAttribute('aria-pressed','false');
      btn.title='Open a larger Python workspace';
      btn.addEventListener('click',function(event){
        event.preventDefault();
        event.stopPropagation();
        if(box.classList.contains('ian601-python-focus')) closeFocus();
        else openFocus(box);
      });
      actions.appendChild(btn);
    }
    function scan(){
      [].slice.call(document.querySelectorAll('.code-cell')).forEach(enhanceBox);
    }

    scan();

    var root=document.querySelector('main.stage,main.slides,#stage');
    if(root && window.MutationObserver){
      try{
        new MutationObserver(function(){ scan(); }).observe(root,{childList:true,subtree:true});
      }catch(e){}
    }

    document.addEventListener('keydown',function(event){
      if(event.key==='Escape' && activeBox){
        event.preventDefault();
        closeFocus();
      }
    });

    ['prevBtn','prev-btn','nextBtn','next-btn'].forEach(function(id){
      var btn=document.getElementById(id);
      if(btn) btn.addEventListener('click',function(){ if(activeBox) closeFocus(); },true);
    });
    ['slideSelect','slide-select'].forEach(function(id){
      var select=document.getElementById(id);
      if(select) select.addEventListener('change',function(){ if(activeBox) closeFocus(); },true);
    });
  });
})();
/* IAN601_PYTHON_FOCUS_SHARED_END */
