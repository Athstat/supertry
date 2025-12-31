import { Cache } from "swr"
import { logger } from "../../services/logger";

const CACHE_KEY = 'web-app-cache';

/** Creates a cache that can be synced with local storage */
export function localStorageCacheProvider(): Cache {

  const map: Map<string, unknown> = new Map(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'));

  window.__WEB_VIEW_CACHE__ = map;

  window.addEventListener('beforeunload', () => {
    persistCache(map);
  });

  window.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === "PERSIST_WEBVIEW_CACHE") {
        persistCache(map);
      }
    } catch(err) {
      logger.error("Error persisting webview cache ", err);
    }
  });

  const delay = 1000 * 10; // 1 Minute

  setInterval(() => {
    persistCache(map);
  }, delay);

  return map as Cache
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(CACHE_KEY);
}

async function persistCache(map: Map<string, unknown>) {
  const scrummyBridge = window?.ScrummyBridge;
  const serialized = JSON.stringify(Array.from(map.entries()));
  
  localStorage.setItem(CACHE_KEY, serialized);
  
  if (scrummyBridge?.persistCache) {
    scrummyBridge.persistCache();
  }

}