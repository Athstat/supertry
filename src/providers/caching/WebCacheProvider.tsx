import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { Cache, SWRConfig } from "swr";
import { LoadingState } from "../../components/ui/LoadingState";
import { logger } from "../../services/logger";
import { APP_CACHE_KEY } from "../../types/constants";
import { idxKVStore } from "../../utils/web/indexedDbUtils";

type Props = {
    children?: ReactNode
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
        return map as Cache;

    }, [mapRef]);

    useEffect(() => {
        const map = mapRef.current;

        const interval = setInterval(() => {
            const appCache = JSON.stringify(Array.from(map.entries()))
            idxKVStore.set(APP_CACHE_KEY, appCache)
        }, 1000 * 60 * 20); // 20 minutes

        const beforeunloadListner = () => {
            const appCache = JSON.stringify(Array.from(map.entries()))
            idxKVStore.set(APP_CACHE_KEY, appCache)
        }

        window.addEventListener('beforeunload', beforeunloadListner);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', beforeunloadListner);
        }
    })

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