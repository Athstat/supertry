import { ReactNode } from "react"
import { logger } from "../../services/logger";
import {MobileCacheProvider} from "./MobileCacheProvider";
import { WebCacheProvider } from "./WebCacheProvider";

type Props = {
    children?: ReactNode
}


export default function CacheProvider({ children }: Props) {

    const shouldUseMobile = isBridgeAvailable();

    if (shouldUseMobile) {
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

function isBridgeAvailable() {
    try {
        return Boolean(window.ScrummyBridge)
    } catch (err) {
        logger.error(err);
        return false;
    }
}