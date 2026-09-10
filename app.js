(() => {
  'use strict';
  const cases = window.CASES;
  const $ = id => document.getElementById(id);
  const statusMap = {violation:['위반 확인','red'],confirmed:['사용·진출 확인','amber'],industry:['산업 변화','blue'],followup:['후속 확인','gray']};
  const categories = ['전체 사례','먹거리','생활용품','유통 플랫폼','제조업','원산지'];
  const state = {category:'전체 사례',status:'all',query:'',sort:'newest'};
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = c => c.id === 'battery' ? '2025.12 · 일자 미확인' : c.date.replaceAll('-','.');
  const badge = c => `<span class="badge ${statusMap[c.status][1]}"><span class="status-dot" aria-hidden="true"></span>${statusMap[c.status][0]}</span>`;
  function selected() {
    const words = state.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return cases.filter(c => (state.category==='전체 사례'||c.category===state.category) && (state.status==='all'||c.status===state.status) && words.every(w => [c.title,c.summary,c.tags,c.origin,c.publisher,c.detail].join(' ').toLocaleLowerCase().includes(w))).sort((a,b)=>state.sort==='oldest'?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
  }
  function render() {
    $('categories').innerHTML = categories.map((c,i)=>`<button class="category" data-category="${c}" aria-pressed="${state.category===c}"><span class="category-icon" aria-hidden="true">${['▦','◈','◇','▤','▥','◎'][i]}</span>${c}<span class="category-count">${cases.filter(x=>i===0||x.category===c).length}</span></button>`).join('');
    $('statuses').innerHTML = `<button class="filter" data-status="all" aria-pressed="${state.status==='all'}">모든 상태</button>`+Object.entries(statusMap).map(([id,[label,color]])=>`<button class="filter" data-status="${id}" aria-pressed="${state.status===id}"><span class="status-dot ${color}" aria-hidden="true"></span>${label}</button>`).join('');
    const found = selected();
    $('list-heading').innerHTML = `${state.category} <span id="result-count">${found.length}</span>`;
    $('results-live').textContent = `${found.length}개의 사례가 있습니다.`;
    $('cards').innerHTML = found.map(c=>`<article class="card"><div class="card-meta">${badge(c)}<time datetime="${c.id==='battery'?'2025-12':c.date}">${date(c)}</time></div><h3><button class="card-open" data-open="${c.id}">${escape(c.title)}</button></h3><p class="card-description">${escape(c.summary)}</p><div class="card-bottom"><div class="card-tags"><span class="tag">${c.category}</span><span class="tag">${escape(c.stage)}</span></div><div class="card-footer"><span><span class="source-type">${escape(c.sourceType)}</span>${escape(c.publisher)}</span><span class="card-arrow" aria-hidden="true">↗</span></div></div></article>`).join('');
    $('empty').hidden = found.length>0;
    const active = state.category!=='전체 사례'||state.status!=='all'||state.query!=='';
    $('active-query').hidden = !active;
    $('query-text').textContent = [state.category,state.status==='all'?'모든 상태':statusMap[state.status][0],state.query?`“${state.query}”`:null].filter(Boolean).join(' / ');
  }
  let opener;
  function openCase(id, element) {
    const c = cases.find(c=>c.id===id); if(!c) return;
    opener = element || document.activeElement;
    $('detail-content').innerHTML = `<div class="detail-inner">${badge(c)}<h2 id="detail-title">${escape(c.title)}</h2><p class="detail-meta">${escape(c.category)} · 발표 ${date(c)} · 자료 확인 2026.09.08</p><p>${escape(c.summary)}</p><dl class="detail-facts"><div><dt>대상·키워드</dt><dd>${escape(c.tags)}</dd></div><div><dt>원산지·관계 국가</dt><dd>${escape(c.origin)}</dd></div><div><dt>확인 단계</dt><dd>${escape(c.stage)}</dd></div></dl><h3>무슨 일이 있었나요?</h3><p>${escape(c.detail)}</p><h3>함께 확인할 점</h3><p class="scope-note">${escape(c.caution)}</p><h3>원문 출처</h3><a class="source-link" href="${escape(c.url)}" target="_blank" rel="noopener noreferrer"><span>${escape(c.publisher)}에서 원문 읽기<small>${escape(c.sourceType)} · 새 창으로 열림</small></span><span aria-hidden="true">↗</span></a></div>`;
    if(!$('detail').open) $('detail').showModal();
    $('detail').scrollTop=0;
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('button'); if(!button)return;
    if(button.dataset.open)openCase(button.dataset.open,button);
    if(button.dataset.category){state.category=button.dataset.category;render();document.querySelector(`[data-category="${state.category}"]`).focus();}
    if(button.dataset.status){state.status=button.dataset.status;render();document.querySelector(`[data-status="${state.status}"]`).focus();}
  });
  $('search').addEventListener('input',e=>{state.query=e.target.value;render();});
  $('sort').addEventListener('change',e=>{state.sort=e.target.value;render();});
  function reset(){Object.assign(state,{category:'전체 사례',status:'all',query:'',sort:'newest'});$('search').value='';$('sort').value='newest';render();$('search').focus();}
  $('reset').onclick=reset; $('empty-reset').onclick=reset;
  $('detail-close').onclick=()=>$('detail').close();
  $('detail').addEventListener('close',()=>{if(opener?.isConnected)opener.focus();});
  $('about-open').onclick=$('footer-about').onclick=()=>$('about').showModal();
  $('about-close').onclick=()=>$('about').close();
  for(const id of ['detail','about']) $(id).addEventListener('click',e=>{if(e.target===$(id)){const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close();}});
  $('total-count').innerHTML=cases.length+'<small>건</small>';
  $('violation-count').innerHTML=cases.filter(c=>c.status==='violation').length+'<small>건</small>';
  render();
})();
