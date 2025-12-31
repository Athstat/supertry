import { ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { logger } from "../../services/logger";
import { APP_CACHE_KEY } from "../../types/constants";
import { idxKVStore } from "../../utils/web/indexedDbUtils";
import { LoadingState } from "../../components/ui/LoadingState";
import { Cache, SWRConfig } from "swr";
import { mobileCacheProvider } from "./mobileCacheProvider";

type Props = {
    children?: ReactNode
}


export default function CacheProvider({ children }: Props) {

    const [isBridgeAvailable, setBridgeAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        const checkBridge = () => {
            try {
                const available = Boolean(window.ScrummyBridge);
                setBridgeAvailable(available);
            } catch (err) {
                logger.error("Bridge check failed", err);
                setBridgeAvailable(false);
            }
        };

        // Give a small delay for bridge to initialize if needed
        if (window.ScrummyBridge) {
            checkBridge();
        } else {
            const interval = setInterval(() => {
                if (window.ScrummyBridge) {
                    clearInterval(interval);
                    checkBridge();
                }
            }, 100); // check every 100ms until bridge appears
        }
    }, []);

    if (isBridgeAvailable === null) {
        return <LoadingState />; // wait until we know
    }

    if (isBridgeAvailable) {
        return (
            <MobileCacheProvider>
                {children}
            </MobileCacheProvider>
        )
    }

    return (
        <WebCacheProvider>
            {children}
        </WebCacheProvider>
    )
}


export function WebCacheProvider({ children }: Props) {

    const [isLoading, setLoading] = useState(false);
    const mapRef = useRef(new Map<string, unknown>());

    useEffect(() => {
        const fetcher = async () => {
            setLoading(true);
            try {
                mapRef.current = await webMapFactory();
            } catch (err) {
                logger.error("Failed to get map from factory ", err);
            }
            setLoading(false);
        };

        fetcher();
    }, []);

    const providerFunc = useCallback(() => {
        const map = mapRef.current;

        setInterval(() => {
            const appCache = JSON.stringify(Array.from(map.entries()))
            idxKVStore.set(APP_CACHE_KEY, appCache)
        }, 1000 * 60 * 20); // 20 minutes

        // Before unloading the app, we write back all the data into `localStorage`.
        window.addEventListener('beforeunload', () => {
            const appCache = JSON.stringify(Array.from(map.entries()))
            idxKVStore.set(APP_CACHE_KEY, appCache)
        });

        return map as Cache;
    }, [mapRef]);

    if (isLoading) {
        return (
            <LoadingState />
        )
    }

    console.log("Using WebView Cache");

    return (
        <SWRConfig value={{
            provider: providerFunc
        }} >
            {children}
        </SWRConfig>
    )
}


async function webMapFactory() {
    let map = new Map<string, unknown>();

    try {

        const prevCache = await idxKVStore.get(APP_CACHE_KEY);
        map = new Map(JSON.parse(prevCache || '[]'));

    } catch (err) {
        logger.error("Failed to get value from index store, defaulting to inmem map ", err);
    }

    return map;
}

export function MobileCacheProvider({ children }: Props) {
    
    console.log("Using Mobile Cache");
    
    return (
        <SWRConfig
            value={{ provider: mobileCacheProvider }}
        >
            {children}
        </SWRConfig>
    )
}