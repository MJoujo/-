/* ボキバトル service worker  ver e17e2e684f */
const VER="e17e2e684f",CORE="core-"+VER,IMG="img-v1",LIB="lib-v1";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(["./","index.html","manifest.webmanifest","img/icon-192.png"])).catch(()=>{}))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("core-")&&k!==CORE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith(".html")){   // 本体:ネットを優先(常に最新)、オフライン時はキャッシュ
      e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{const c=res.clone();caches.open(CORE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
    if(u.pathname.includes("/img/")){                                                   // 画像:キャッシュ優先
      e.respondWith(caches.open(IMG).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
    e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(res=>{const c=res.clone();caches.open(CORE).then(x=>x.put(r,c));return res}).catch(()=>m);return m||f}));return}
  self.addEventListener("periodicsync",e=>{if(e.tag==="nag")e.waitUntil(nag())});
self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(x){}e.waitUntil(self.registration.showNotification(d.title||"ボキバトル",{body:d.body||"今日の1レッスン、まだだよ",icon:"img/icon-192.png",tag:"nag",renotify:true}))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window"}).then(ws=>ws.length?ws[0].focus():clients.openWindow("./")))});
async function nag(){const c=await caches.open("nag-state"),r=await c.match("state");if(!r)return;const s=await r.json();if(!s.on)return;
  const now=new Date(),h=now.getHours();if(s.d===now.toDateString()||h<9||h>23)return;const n=s.n||0;
  const M=h<18?[`ヨネ「${s.name||"あんた"}、今日の1レッスンまだかい?」`,`ヨネ「2〜3分でいいんだよ。連続${n}日、続けようねぇ」`]
    :h<21?[`ニヤ豆「連続${n}日、今日で終わり?w」`,`ニヤ豆「サボり乙w ヨネばあちゃん泣いてるぞ」`]
    :[`ヨネ「あと${24-h}時間で連続記録が消えちゃう…!」`,`ニヤ豆「消える消える〜www」`,`ヨネ「おばあちゃん、悲しいよ…」`];
  await self.registration.showNotification(h<21?"ボキバトル":"🔥 連続記録がピンチ!",{body:M[Math.floor(Math.random()*M.length)],icon:"img/icon-192.png",tag:"nag",renotify:true})}
  if(/cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com/.test(u.host)){                // ライブラリ・フォント
    e.respondWith(caches.open(LIB).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res}).catch(()=>m);return m||f})))}
});
