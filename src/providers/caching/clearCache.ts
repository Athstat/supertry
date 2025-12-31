import { APP_CACHE_KEY } from "../../types/constants";
import { idxKVStore } from "../../utils/web/indexedDbUtils";

/** Clears both local storage cache and also indexed DB cache */
export async function clearAppCache() {
  localStorage.removeItem(APP_CACHE_KEY);
  await idxKVStore.set(APP_CACHE_KEY, '[]');
}