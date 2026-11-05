'use strict';
(() => {
  const KEY = 'leadTrackerItems';
  const form = document.querySelector('#lead-form');
  const input = document.querySelector('#lead-url');
  const list = document.querySelector('#lead-list');
  const count = document.querySelector('#lead-count');
  const empty = document.querySelector('#empty-state');
  const search = document.querySelector('#search-input');
  const toast = document.querySelector('#toast');
  const fileInput = document.querySelector('#import-file');
  let leads = [];
  let toastTimer;

  const normalizeUrl = value => {
    const raw = String(value || '').trim();
    if (!raw) return null;
    try {
      const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return null;
      return url.href;
    } catch { return null; }
  };
  const createLead = url => ({ id: crypto.randomUUID(), url, createdAt: new Date().toISOString() });
  const notify = (message, error = false) => {
    clearTimeout(toastTimer); toast.textContent = message; toast.classList.toggle('error', error); toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(leads)); return true; } catch { notify('Browser storage is unavailable or full.', true); return false; } };
  const dateLabel = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Saved lead' : `SAVED ${date.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}`; };
  const actionButton = (label, symbol, handler, extra = '') => {
    const button = document.createElement('button'); button.type = 'button'; button.className = `item-action ${extra}`; button.textContent = symbol; button.title = label; button.setAttribute('aria-label', label); button.addEventListener('click', handler); return button;
  };
  function render() {
    const query = search.value.trim().toLowerCase();
    const filtered = leads.filter(lead => lead.url.toLowerCase().includes(query));
    count.textContent = `${leads.length} ${leads.length === 1 ? 'saved' : 'saved'}`;
    list.replaceChildren(); empty.hidden = filtered.length > 0;
    empty.querySelector('strong').textContent = leads.length ? 'No matching leads' : 'No leads saved yet';
    empty.querySelector('p').textContent = leads.length ? 'Try another search term.' : 'Your next opportunity starts with one good link.';
    for (const lead of filtered) {
      const item = document.createElement('li'); item.className = 'lead-item';
      const mark = document.createElement('span'); mark.className = 'lead-favicon'; mark.textContent = '↗'; mark.setAttribute('aria-hidden','true');
      const main = document.createElement('div'); main.className = 'lead-main';
      const link = document.createElement('a'); link.className = 'lead-link'; link.href = lead.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = lead.url; link.title = lead.url;
      const meta = document.createElement('div'); meta.className = 'lead-meta'; meta.textContent = dateLabel(lead.createdAt);
      main.append(link, meta);
      const actions = document.createElement('div'); actions.className = 'lead-actions';
      actions.append(actionButton('Copy link','⧉',async()=>{try{await navigator.clipboard.writeText(lead.url);notify('Link copied.')}catch{notify('Could not access clipboard.',true)}}),actionButton('Remove lead','×',()=>{leads=leads.filter(x=>x.id!==lead.id);if(save()){render();notify('Lead removed.')}},'remove'));
      item.append(mark,main,actions); list.append(item);
    }
  }
  function add(value) {
    const url = normalizeUrl(value);
    if (!url) { notify('Enter a valid website URL.',true); input.focus(); return; }
    if (leads.some(item=>item.url===url)) { notify('This link is already saved.',true); return; }
    leads.unshift(createLead(url)); if(save()){input.value='';render();notify('Lead saved successfully.');}
  }
  form.addEventListener('submit',event=>{event.preventDefault();add(input.value)});
  search.addEventListener('input',render);
  document.querySelector('#clear-btn').addEventListener('click',()=>{if(!leads.length){notify('There are no leads to clear.');return;}if(confirm(`Delete all ${leads.length} saved leads? This cannot be undone.`)){const old=leads;leads=[];if(save()){render();notify('All leads cleared.')}else leads=old;}});
  document.querySelector('#export-btn').addEventListener('click',()=>{if(!leads.length){notify('Save a lead before exporting.',true);return;}const blob=new Blob([JSON.stringify({app:'Lead Tracker',version:2,exportedAt:new Date().toISOString(),leads},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`lead-tracker-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Your leads have been exported.');});
  document.querySelector('#import-btn').addEventListener('click',()=>fileInput.click());
  fileInput.addEventListener('change',async()=>{const file=fileInput.files?.[0];fileInput.value='';if(!file)return;try{if(file.size>2*1024*1024)throw Error('The file is larger than 2 MB.');const data=JSON.parse(await file.text());const entries=Array.isArray(data)?data:data.leads;if(!Array.isArray(entries))throw Error('This is not a Lead Tracker export.');const seen=new Set(leads.map(x=>x.url));let added=0;for(const entry of entries){const url=normalizeUrl(typeof entry==='string'?entry:entry?.url);if(url&&!seen.has(url)){leads.push(createLead(url));seen.add(url);added++;}}if(save()){render();notify(`${added} new ${added===1?'lead':'leads'} imported.`);}}catch(error){notify(error.message||'Could not import this file.',true);}});
  try { let stored=JSON.parse(localStorage.getItem(KEY)||'null'); if(!Array.isArray(stored)){ const legacy=JSON.parse(localStorage.getItem('myLeads')||'[]'); if(Array.isArray(legacy)){ stored=legacy.map(url=>({url})); if(stored.length)localStorage.setItem(KEY,JSON.stringify(stored)); } } if(Array.isArray(stored))leads=stored.filter(x=>x&&(typeof x.url==='string'||typeof x==='string')&&normalizeUrl(typeof x==='string'?x:x.url)).map(x=>({id:x.id||crypto.randomUUID(),url:normalizeUrl(typeof x==='string'?x:x.url),createdAt:x.createdAt||new Date().toISOString()})); } catch { leads=[]; }
  render();
})();
