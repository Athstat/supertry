import { Cache } from "swr"
import { logger } from "../../services/logger";
import { APP_CACHE_KEY } from "../../types/constants";


/** Creates a cache that can be synced with mobile scrummy bridge */
export function mobileCacheProvider(): Cache {

  try {

    const map = mapFactory();

    window.__WEB_VIEW_CACHE__ = map;

    window.addEventListener('beforeunload', () => {
      const appCache = JSON.stringify(Array.from(map.entries()))
      localStorage.setItem(APP_CACHE_KEY, appCache);

      persistCache(map);
    });

    window.addEventListener('message', (event) => {
      if (typeof event.data !== 'string') return;

      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "PERSIST_WEBVIEW_CACHE") {
          persistCache(map);
        }
      } catch (err) {
        logger.error("Error persisting webview cache ", err);
      }
    });

    setInterval(() => {
      persistCache(map);
    }, 1000 * 60 * 20); // 20 minutes

    return map as Cache;
  } catch (err) {
    logger.error("Failed to get local storage provider defaulting to simple inmemory cache ", err);
    return new Map<string, unknown>() as Cache;
  }
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(APP_CACHE_KEY);
}

function persistCache(map: Map<string, unknown>) {

  const scrummyBridge = window?.ScrummyBridge;
  const serialized = JSON.stringify(Array.from(map.entries()));

  try {
    localStorage.setItem(APP_CACHE_KEY, serialized);
    console.log("Just saved ", serialized);
  } catch (err) {
    logger.error("Failed to write cache to local storage ", err);
  }


  try {
    if (scrummyBridge?.persistCache) {
      scrummyBridge.persistCache();
    }
  } catch (err) {
    logger.error("Error caching app data to webview", err);
  }

}

/** Function that creates a map object */
function mapFactory() {
  try {

    const initCache = JSON.parse(window?.INIT_WEBVIEW_CACHE || localStorage.getItem(APP_CACHE_KEY) || '[]');
    const map: Map<string, unknown> = new Map(initCache);

    console.log("Initial Cache ", initCache);

    return map;
  } catch (err) {
    logger.error("Error loading initial cache ", err);
  }

  return new Map<string, unknown>();
}