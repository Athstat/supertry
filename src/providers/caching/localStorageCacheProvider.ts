import { Cache } from "swr"

const CACHE_KEY = 'app-cache'

/** Creates a cache that can be synced with local storage */
export function localStorageCacheProvider() : Cache {

  console.log("Using Local Storage Cache 🍪");

  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'))

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem(CACHE_KEY, appCache)
  })
  
  return map as Cache;
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(CACHE_KEY);
}