import { Cache } from "swr"
import { APP_CACHE_KEY } from "../../types/constants"
import { idxKVStore } from "../../utils/web/indexedDbUtils";
import { logger } from "../../services/logger";

export function localStorageCacheProvider(): Cache {

  // When initializing, we restore the data from `localStorage` into a map.
  const map = mapFactory();

  setInterval(() => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    idxKVStore.set(APP_CACHE_KEY, appCache)
  }, 1000 * 5);

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    idxKVStore.set(APP_CACHE_KEY, appCache)
  });

  return map as Cache
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(APP_CACHE_KEY);
}

function mapFactory() {
  let map = new Map<string, unknown>();

  try {

    idxKVStore.get(APP_CACHE_KEY).then((val) => {
      map = new Map(JSON.parse(val || '[]'));
    });

  } catch (err) {
    logger.error("Failed to get value from index store, defaulting to inmem map ", err);
  }

  return map;
}