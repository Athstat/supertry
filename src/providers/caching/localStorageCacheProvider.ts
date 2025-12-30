import { Cache } from "swr"

const CACHE_KEY = 'web-app-cache';

/** Creates a cache that can be synced with local storage */
export function localStorageCacheProvider(): Cache {

  console.log("Using Local Storage Cache 🍪");

  const map: Map<string, unknown> = new Map(JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'))

  window.addEventListener('beforeunload', () => {
    persistCache(map);
  });

  return {
    get: <Data>(key: string) => map.get(key) as Data, 
    set: <Data>(key: string, value: Data) => {
      map.set(key, value);
      persistCache(map);
    },
    delete: (key: string) => {
      map.delete(key);
      persistCache(map);
    },
    keys: () => {
      return map.keys() as IterableIterator<string>;
    }
  };
}

/** Function that clears the apps, cache */
export function clearAppCache() {
  localStorage.removeItem(CACHE_KEY);
}

function persistCache(map: Map<string, unknown>) {
  const webviewBridge = window.ReactNativeWebView;

  if (!webviewBridge) {
    return;
  }

  const serialized = JSON.stringify(Array.from(map.entries()))
  const message = { type: 'SAVE_WEBVIEW_CACHE', payload: serialized };

  localStorage.setItem(CACHE_KEY, serialized);
  webviewBridge.postMessage(JSON.stringify(message));

  console.log("Message sent to webview ", message);
}