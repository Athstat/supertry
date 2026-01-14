import { useEffect, useState } from "react";

/** Hook for creating a delay */
export function useDelay(millis: number = 500) {
    const [isDelaying, setDelaying] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDelaying(false)
        }, millis);

        return () => {
            clearTimeout(timeout);
        }
    }, [millis]);

    return {
        isDelaying
    }
}