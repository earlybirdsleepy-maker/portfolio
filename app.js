const grid=document.querySelector('#grid'), dialog=document.querySelector('#detail');
let lastTrigger;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(filter='전체'){
 const list=works.filter(w=>filter==='전체'||w.cat===filter);
 document.querySelector('#count').textContent=list.length;
 grid.innerHTML=list.map(w=>`<button class="card" data-open="${w.id}" aria-label="${esc(w.title)} 영상과 제작 정보 보기"><div class="thumb"><img src="https://i.ytimg.com/vi/${w.id}/hqdefault.jpg" alt="${esc(w.title)} 썸네일" loading="lazy" width="480" height="270">${w.award?`<span class="badge">${esc(w.award)}</span>`:''}<span class="card-play" aria-hidden="true">▶</span>${w.vertical?'<span class="format">9:16</span>':''}</div><div class="card-meta"><span>${esc(w.client)}</span><span>${esc(w.cat)}</span></div><h3>${esc(w.title)}</h3></button>`).join('');
}
function openWork(id,trigger){
 const w=works.find(w=>w.id===id);if(!w)return;
 lastTrigger=trigger;
 document.querySelector('#detail-category').textContent=w.cat;
 document.querySelector('#detail-client').textContent=w.client;
 document.querySelector('#detail-title').textContent=w.title;
 document.querySelector('#detail-desc').textContent=w.desc;
 const award=document.querySelector('#detail-award');award.textContent=w.award||'';award.hidden=!w.award;
 const player=document.querySelector('#player');player.classList.toggle('vertical',!!w.vertical);
 player.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${w.id}?rel=0" title="${esc(w.title)} 영상" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
 document.querySelector('#youtube-link').href=`https://www.youtube.com/watch?v=${w.id}`;
 document.querySelector('#roles').innerHTML=w.role?`<p class="role-heading">제작 기여도</p><div class="roles">${w.role.map((n,i)=>`<div class="role-item"><span>${['기획','촬영','편집'][i]}</span><strong>${n}<small style="font-size:14px">%</small></strong><div class="role-bar"><i style="width:${n}%"></i></div></div>`).join('')}</div>`:'';
 document.querySelector('#metadata').innerHTML=[w.people&&['제작 인원',`${w.people}인`],w.date&&['제작 기간',w.date],w.credit&&['작업',w.credit],w.tools&&['프로그램',w.tools]].filter(Boolean).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
 document.querySelector('#extra').innerHTML=(w.details||[]).map(s=>`<li>${esc(s)}</li>`).join('');
 dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)openWork(b.dataset.open,b)});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render(b.dataset.filter)}));
document.querySelector('#close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{document.querySelector('#player').innerHTML='';document.body.classList.remove('modal-open');lastTrigger?.focus()});
render();
