const CACHE_NAME = 'comunica-app-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './drag-drop-touch.js', // <-- Adicione esta linha no seu array de arquivos do sw.js
  './manifest.json',
  './imagens/gabriel.jpg',
  './imagens/acao/quero.jpg',
  './imagens/acao/escolher.jpg',
  './imagens/acao/sim.jpg',
  './imagens/acao/não.jpg',
  './imagens/objetos/almoçar.jpg',
  './imagens/objetos/tomar café.jpg',
  './imagens/objetos/biscoito piraque morango.jpg',
  './imagens/objetos/batata frita palito.jpg',
  './imagens/objetos/chocolate nestle.jpg',
  './imagens/objetos/macarrão.jpg',
  './imagens/objetos/pizza.jpg'
];

// Instala o Service Worker e guarda os arquivos no cache do celular
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativa o Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Serve os arquivos do cache quando estiver offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
