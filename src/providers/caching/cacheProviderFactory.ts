import { Cache } from "swr";
import { mobileCacheProvider } from "./mobileCacheProvider";
import { localStorageCacheProvider } from "./localStorageCacheProvider";

/** Factory that selects the right cache provider for a given environment */
export function cacheProviderFactory() : () => Cache {
    try {
        if (window.ScrummyBridge) {
            console.log("Using Mobile Cache Provider")
            return mobileCacheProvider;
        } else {
            console.log("Using Web Cache Provider")
            return localStorageCacheProvider;
        }
    } catch (err) {
        console.log("Error creating cache provider defaulting to in mem map ", err);
    }

    return inMemCacheProvider;
}

function inMemCacheProvider() : Cache {
    return new Map() as Cache
}