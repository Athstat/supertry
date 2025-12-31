import { get, set } from 'idb-keyval';

/** Provides an indexed key value store */
export const idxKVStore = {
    get: get,
    set: set
}