import { Cache } from "swr"
import { logger } from "../../services/logger";

const CACHE_KEY = 'web-app-cache';

/** Creates a cache that can be synced with local storage */
export function localStorageCacheProvider(): Cache {

  const map: Map<string, unknown> = new Map(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'));

  window.__WEB_VIEW_CACHE__ = map;

  setInterval(() => {
    persistCache(map);
  }, 1000 * 10);

  window.addEventListener('visibilitychange', () => {
    
    if (document.visibilityState === 'hidden') {
      persistCache(map);
    }

  });

  window.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);

      if (msg.type === "PERSIST_WEBVIEW_CACHE") {
        persistCache(map);
      }
    } catch (err) {
      logger.error("Error persisting webview cache ", err);
    }
  });

  return map as Cache
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(CACHE_KEY);
}

function persistCache(map: Map<string, unknown>) {

  const scrummyBridge = window?.ScrummyBridge;
  const serialized = JSON.stringify(Array.from(map.entries()));

  try {
    localStorage.setItem(CACHE_KEY, serialized);
  } catch (err) {
    console.log("Failed to write cache to local storage ", err);
  }


  try {
    console.log("Persisting the cache here no bridge no yet", map);

    if (scrummyBridge?.persistCache) {
      console.log("Persisting the cache ", map);
      scrummyBridge.persistCache();
    }
  } catch (err) {
    console.log("Error caching app data to webview", err);
  }

}