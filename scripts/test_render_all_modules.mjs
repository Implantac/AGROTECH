import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Mock Leaflet and browser globals in case of SSR
globalThis.window = {
  location: { protocol: 'http:' },
  addEventListener: () => {},
  removeEventListener: () => {},
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
};
globalThis.document = {
  createElement: () => ({ setAttribute: () => {}, style: {} }),
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
};
globalThis.navigator = {
  userAgent: 'node',
  serviceWorker: { register: async () => {} },
};

async function testAllModules() {
  const { ALL_MODULES } = await import('../agtech-platform/src/components/QuickAccessModal.js').catch(async () => {
    // If not compiled to js, we can test via Vite SSR
    return null;
  }) || {};
}
