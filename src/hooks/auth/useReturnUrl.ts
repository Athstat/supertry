import { useCallback } from "react"

/** Hook that reads a return url and saves to local storage for use later on */
export function useReturnUrl() {
    const key = 'APP_RETURN_URL_ffibqwfburbfubuebrvberbvbebiqivriebviqbive'

    const readReturnUrl = useCallback(() => {
        return localStorage.getItem(key);
    }, []);

    const saveReturnUrl = useCallback((newReturnUrl: string) => {
        localStorage.setItem(key, newReturnUrl);
    }, []);

    const clearReturnUrl = useCallback(() => {
        localStorage.removeItem(key);
    }, []);

    return {
        readReturnUrl, saveReturnUrl, clearReturnUrl
    }
}