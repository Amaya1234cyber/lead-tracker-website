'use strict';

const STORAGE_KEY = 'leadTrackerItems';
const inputEl = document.getElementById('input-el');
const inputBtn = document.getElementById('input-btn');
const tabBtn = document.getElementById('tab-btn');
const deleteBtn = document.getElementById('delete-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importFile = document.getElementById('import-file');
const searchEl = document.getElementById('search-el');
const listEl = document.getElementById('ul-el');
const countEl = document.getElementById('lead-count');
const emptyEl = document.getElementById('empty-state');
const statusEl = document.getElementById('status');

let leads = [];
let statusTimer;

function announce(message, isError = false) {
  window.clearTimeout(statusTimer);
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
  statusTimer = window.setTimeout(() => { statusEl.textContent = ''; }, 4000);
}

function normalizeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  let candidate = raw;
  if (!/^[a-z][a-z\d+.-]*:/i.test(candidate)) candidate = `https://${candidate}`;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) return null;
    return url.href;
  } catch {
    return null;
  }
}

async function loadLeads() {
  try {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    const saved = stored[STORAGE_KEY];
    if (Array.isArray(saved)) {
      leads = saved.filter(item => item && typeof item.url === 'string' && normalizeUrl(item.url));
    } else {
      // One-time migration from the original extension's localStorage format.
      try {
        const legacy = JSON.parse(localStorage.getItem('myLeads') || '[]');
        if (Array.isArray(legacy)) {
          const unique = [...new Set(legacy.map(normalizeUrl).filter(Boolean))];
          leads = unique.map(createLead);
          if (leads.length) await chrome.storage.local.set({ [STORAGE_KEY]: leads });
          localStorage.removeItem('myLeads');
        }
      } catch (migrationError) {
        console.warn('Legacy lead migration skipped:', migrationError);
      }
    }
    render();
  } catch (error) {
    announce('Could not load saved leads. Try reloading the extension.', true);
    console.error('Lead Tracker load error:', error);
  }
}

async function persist(nextLeads = leads) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: nextLeads });
    leads = nextLeads;
    render();
    return true;
  } catch (error) {
    announce('Could not save changes. Check Chrome storage access.', true);
    console.error('Lead Tracker save error:', error);
    return false;
  }
}

function createLead(url) {
  return { id: crypto.randomUUID(), url, createdAt: new Date().toISOString() };
}

async function addLead(value) {
  const url = normalizeUrl(value);
  if (!url) {
    announce('Enter a valid website URL (http or https).', true);
    inputEl.focus();
    return;
  }
  if (leads.some(lead => lead.url === url)) {
    announce('This link is already in your saved leads.', true);
    return;
  }
  if (await persist([createLead(url), ...leads])) {
    inputEl.value = '';
    announce('Lead saved successfully.');
  }
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const filtered = leads.filter(lead => lead.url.toLowerCase().includes(query));
  listEl.replaceChildren();
  countEl.textContent = `${leads.length} ${leads.length === 1 ? 'lead' : 'leads'} saved`;
  emptyEl.hidden = filtered.length > 0;
  if (!leads.length) {
    emptyEl.querySelector('strong').textContent = 'No leads saved yet';
    emptyEl.querySelector('p').textContent = 'Paste a link above or save the page you\'re viewing.';
  } else if (!filtered.length) {
    emptyEl.querySelector('strong').textContent = 'No matching leads';
    emptyEl.querySelector('p').textContent = 'Try a different search term.';
  }

  for (const lead of filtered) {
    const item = document.createElement('li');
    item.className = 'lead-item';
    const link = document.createElement('a');
    link.className = 'lead-link';
    link.href = lead.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = lead.url;
    link.title = lead.url;

    const actions = document.createElement('div');
    actions.className = 'item-actions';
    const copy = makeAction('Copy link', '⧉', async () => {
      try { await navigator.clipboard.writeText(lead.url); announce('Link copied.'); }
      catch { announce('Could not copy this link.', true); }
    });
    const remove = makeAction('Remove lead', '×', async () => {
      const nextLeads = leads.filter(entry => entry.id !== lead.id);
      if (await persist(nextLeads)) announce('Lead removed.');
    }, ' remove');
    actions.append(copy, remove);
    item.append(link, actions);
    listEl.append(item);
  }
}

function makeAction(label, symbol, handler, extraClass = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `item-action${extraClass}`;
  button.textContent = symbol;
  button.title = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', handler);
  return button;
}

inputBtn.addEventListener('click', () => addLead(inputEl.value));
inputEl.addEventListener('keydown', event => {
  if (event.key === 'Enter') addLead(inputEl.value);
});

tabBtn.addEventListener('click', async () => {
  tabBtn.disabled = true;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url) throw new Error('The current tab URL is unavailable.');
    await addLead(tab.url);
  } catch (error) {
    announce('This page cannot be saved (Chrome internal pages are restricted).', true);
    console.warn('Lead Tracker tab error:', error);
  } finally {
    tabBtn.disabled = false;
  }
});

searchEl.addEventListener('input', render);

deleteBtn.addEventListener('click', async () => {
  if (!leads.length) { announce('There are no leads to clear.'); return; }
  if (!window.confirm(`Delete all ${leads.length} saved leads? This cannot be undone.`)) return;
  if (await persist([])) announce('All leads cleared.');
});

exportBtn.addEventListener('click', () => {
  if (!leads.length) { announce('Save a lead before exporting.', true); return; }
  const blob = new Blob([JSON.stringify({ app: 'Lead Tracker', version: 2, exportedAt: new Date().toISOString(), leads }, null, 2)], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `lead-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  announce('Your leads have been exported.');
});

importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async () => {
  const file = importFile.files?.[0];
  importFile.value = '';
  if (!file) return;
  try {
    if (file.size > 2 * 1024 * 1024) throw new Error('The file is larger than 2 MB.');
    const data = JSON.parse(await file.text());
    const imported = Array.isArray(data) ? data : data.leads;
    if (!Array.isArray(imported)) throw new Error('This file is not a Lead Tracker export.');
    const existing = new Set(leads.map(lead => lead.url));
    const nextLeads = [...leads];
    let added = 0;
    for (const entry of imported) {
      const url = normalizeUrl(typeof entry === 'string' ? entry : entry?.url);
      if (url && !existing.has(url)) {
        nextLeads.push(createLead(url));
        existing.add(url);
        added += 1;
      }
    }
    if (await persist(nextLeads)) announce(`${added} new ${added === 1 ? 'lead' : 'leads'} imported.`);
  } catch (error) {
    announce(error.message || 'Could not import this file.', true);
  }
});

loadLeads();
