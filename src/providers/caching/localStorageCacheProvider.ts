import { Cache } from "swr"
import { logger } from "../../services/logger";

const CACHE_KEY = 'web-app-cache';

/** Creates a cache that can be synced with local storage */
export function localStorageCacheProvider(): Cache {

  console.log("Using Local Storage Cache 🍪");

  const map: Map<string, unknown> = new Map(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'))

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

  return map as Cache
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(CACHE_KEY);
}

async function persistCache(map: Map<string, unknown>) {
  const webviewBridge = window.ReactNativeWebView;

  const serialized = JSON.stringify(Array.from(map.entries()))
  
  localStorage.setItem(CACHE_KEY, serialized);
  
  if (webviewBridge) {
    const message = { type: 'SAVE_WEBVIEW_CACHE', payload: serialized };
    webviewBridge.postMessage(JSON.stringify(message));
  }

}