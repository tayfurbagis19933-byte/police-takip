const CACHE='police-takip-v15';
const SHELL=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=='GET')return;
  // Supabase ve diğer dış istekler: doğrudan ağ
  if(url.origin!==location.origin){
    // OCR / PDF kütüphaneleri: ilk indirmeden sonra çevrimdışı da çalışsın
    if(/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com/.test(url.host)){
      e.respondWith(caches.open(CACHE).then(async c=>{
        const hit=await c.match(req);if(hit)return hit;
        try{const res=await fetch(req);if(res&&res.ok)c.put(req,res.clone());return res}catch(err){return hit||Response.error()}
      }));
    }
    return;
  }
  // Uygulama dosyaları: önce ağ, olmazsa önbellek
  e.respondWith(fetch(req).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window'}).then(cs=>cs.length?cs[0].focus():self.clients.openWindow('./index.html')));
});
