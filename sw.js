/* Poliçe Takip - service worker
   index.html ile aynı klasöre koy. Uygulamanın internetsiz açılmasını,
   bildirimleri ve (destekleyen tarayıcılarda) arka planda vade kontrolünü sağlar. */
const CACHE = 'police-takip-v2';
const CORE = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Önce internetten dene (güncel sürüm gelsin), olmazsa kayıtlı kopyayı aç.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
      )
  );
});

// Bildirime dokununca uygulamayı aç.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      return self.clients.openWindow('./');
    })
  );
});

// Arka planda vade kontrolü (yalnızca destekleyen tarayıcılarda çalışır).
const pad = n => String(n).padStart(2, '0');
const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function readDB() {
  return new Promise(resolve => {
    const r = indexedDB.open('policeTakip', 1);
    r.onerror = () => resolve(null);
    r.onupgradeneeded = () => { r.transaction.abort(); resolve(null); };
    r.onsuccess = () => {
      const db = r.result;
      try {
        const t = db.transaction(['records', 'meta'], 'readonly');
        const out = {};
        t.objectStore('records').getAll().onsuccess = ev => { out.records = ev.target.result || []; };
        t.objectStore('meta').get('settings').onsuccess = ev => { out.settings = ev.target.result || {}; };
        t.oncomplete = () => { db.close(); resolve(out); };
        t.onerror = () => { db.close(); resolve(null); };
      } catch { db.close(); resolve(null); }
    };
  });
}

async function checkDue() {
  const data = await readDB();
  if (!data || !data.settings || !data.settings.notify) return;
  const today = isoDate(new Date());
  if (data.settings.lastNotified === today) return;
  const wd = Number(data.settings.warningDays) || 10;
  const start = new Date(today + 'T00:00:00');
  const n = (data.records || []).filter(r => {
    if (r.status !== 'active' || !r.end) return false;
    const d = Math.round((new Date(r.end + 'T00:00:00') - start) / 864e5);
    return d <= wd;
  }).length;
  if (!n) return;
  await self.registration.showNotification('Poliçe Takip', {
    body: `Yenileme bekleyen ${n} poliçe var.`,
    tag: 'due'
  });
}

self.addEventListener('periodicsync', e => {
  if (e.tag === 'police-due-check') e.waitUntil(checkDue().catch(() => {}));
});
