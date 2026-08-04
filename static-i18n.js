(function(){
  const supported=['ar','en','tr','de','fr','es'];
  const names={ar:'العربية',en:'English',tr:'Türkçe',de:'Deutsch',fr:'Français',es:'Español'};
  const dictionaries=window.NK_TRANSLATIONS||{};
  const blocked=new Set(['SCRIPT','STYLE','CODE','PRE','CANVAS','SVG','NOSCRIPT']);
  const nodes=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const parent=node.parentElement,text=node.nodeValue.trim();if(!text||blocked.has(parent.tagName)||parent.closest('[data-no-translate],.brand,.code-window,.image-slot,.boot'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});
  while(walker.nextNode()){const node=walker.currentNode;nodes.push({node,original:node.nodeValue,key:node.nodeValue.trim()})}
  function applyLanguage(language,save=true){const lang=supported.includes(language)?language:'en';const change=()=>{nodes.forEach(item=>{const value=lang==='ar'?item.key:(dictionaries[lang]?.[item.key]||dictionaries.en?.[item.key]||item.key);item.node.nodeValue=item.original.replace(item.key,value)});document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('.language-menu button[data-lang]').forEach(button=>button.classList.toggle('selected',button.dataset.lang===lang));document.querySelectorAll('.language-trigger b').forEach(label=>label.textContent=names[lang]);document.querySelectorAll('.language-widget').forEach(widget=>widget.classList.remove('open'));document.documentElement.classList.remove('language-changing')};if(save){document.documentElement.classList.add('language-changing');setTimeout(change,170);localStorage.setItem('nk-language',lang)}else change()}
  document.querySelectorAll('.language-trigger').forEach(trigger=>trigger.onclick=(event)=>{event.stopPropagation();trigger.closest('.language-widget').classList.toggle('open')});
  document.addEventListener('click',(event)=>{const button=event.target.closest('.language-menu button[data-lang]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();applyLanguage(button.dataset.lang)},true);
  document.addEventListener('click',()=>document.querySelectorAll('.language-widget').forEach(widget=>widget.classList.remove('open')));
  document.querySelectorAll('.auto-language-prompt,.translate-loader,.translation-toast').forEach(element=>{element.classList.remove('show');element.setAttribute('aria-hidden','true')});
  const saved=localStorage.getItem('nk-language');
  const device=(navigator.languages?.[0]||navigator.language||'en').toLowerCase().split('-')[0];
  applyLanguage(saved||(supported.includes(device)?device:'en'),false);
  document.documentElement.classList.add('static-language-ready');
  window.NKI18n={setLanguage:applyLanguage};
})();
