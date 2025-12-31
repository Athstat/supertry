import { ReactNode, useCallback, useEffect, useRef } from "react"
import { logger } from "../../services/logger";
import { APP_CACHE_KEY } from "../../types/constants";
import { Cache, SWRConfig } from "swr";

type Props = {
    children?: ReactNode
}

/** Renders a mobile cache provider */
export function MobileCacheProvider({ children }: Props) {

    const mapRef = useRef(new Map<string, unknown>());

    const getProvider = useCallback(() => {
        mapRef.current = mobileMapFactory();
        window.__WEB_VIEW_CACHE__ = mapRef.current;
        return mapRef.current as Cache;
    }, []);

    useEffect(() => {

        const map = mapRef.current;
        const beforeunloadListner = () => {
            const appCache = JSON.stringify(Array.from(map.entries()))
            localStorage.setItem(APP_CACHE_KEY, appCache);

            persistCacheMobile(map);
        }

        window.addEventListener('beforeunload', beforeunloadListner);

        const messageListner = (event: MessageEvent<unknown>) => {
            if (typeof event.data !== 'string') return;

            try {
                const msg = JSON.parse(event.data);

                if (msg.type === "PERSIST_WEBVIEW_CACHE") {
                    persistCacheMobile(map);
                }
            } catch (err) {
                logger.error("Error persisting webview cache ", err);
            }
        }

        window.addEventListener('message', messageListner);

        const interval = setInterval(() => {
            persistCacheMobile(map);
        }, 1000 * 60 * 20); // 20 minutes

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', beforeunloadListner);
            window.removeEventListener('message', messageListner);
        }
    })

    console.log("Using Mobile Cache");
    return (
        <SWRConfig
            value={{ provider: getProvider }}
        >
            {children}
        </SWRConfig>
    )
}

function mobileMapFactory() {
    try {

        const initCache = JSON.parse(window?.INIT_WEBVIEW_CACHE || localStorage.getItem(APP_CACHE_KEY) || '[]');
        const map: Map<string, unknown> = new Map(initCache);

        return map;
    } catch (err) {
        logger.error("Error loading initial cache ", err);
    }

    return new Map<string, unknown>();
}

function persistCacheMobile(map: Map<string, unknown>) {

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
