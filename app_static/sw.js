// Super AgTech Service Worker - Offline-First Field Caching & Outbox Background Sync
// Em conformidade com o Princípio 12 do Agro Rural OS (Offline Outbox Pattern)

const CACHE_NAME = 'super-agtech-cache-v2';
const DATA_CACHE_NAME = 'super-agtech-data-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker AGROTECH] Pré-carregando shell da aplicação para operação offline no campo...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de versões defasadas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker AGROTECH] Removendo cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de Requisições
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Apenas requisições GET são armazenadas em cache
  if (event.request.method !== 'GET') return;

  // 2. Estratégia Network-First para APIs de Leitura com Fallback para Cache Local
  if (url.pathname.startsWith('/api/v1/talhoes') ||
      url.pathname.startsWith('/api/v1/mercado/cotacoes') ||
      url.pathname.startsWith('/api/v1/frota') ||
      url.pathname.startsWith('/api/v1/sync/outbox')) {
    
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(event.request, copy);
            });
          }
          return response;
        })
        .catch(() => {
          // Quando estiver sem conexão no talhão, serve o último dado em cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Resposta JSON segura caso não haja cache prévio
            return new Response(JSON.stringify({
              offline: true,
              aviso: 'Dispositivo operando em modo offline no talhão. Dados em cache local.',
              timestamp: new Date().toISOString()
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // 3. Estratégia Cache-First com Network Fallback para Assets Estáticos da SPA
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Se for navegação de página e estiver 100% offline, entrega a casca SPA index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

// 4. Background Sync para Drenagem da Fila Outbox
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-outbox-operations') {
    console.log('[ServiceWorker AGROTECH] Sinal de rede restabelecido. Drenando fila de apontamentos outbox...');
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            tipo: 'OUTBOX_TRIGGER_SYNC',
            mensagem: 'Conectividade restaurada. Disparando reconciliação da outbox.',
            timestamp: Date.now()
          });
        });
      })
    );
  }
});
