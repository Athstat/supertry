import { useEffect, useState } from "react";

export function useLocalStorage(key: string, defaultValue?: string | undefined) {
    const [value, setValue] = useState<string | undefined>(() => {
        return localStorage.getItem(key) || defaultValue;
    });

    useEffect(() => {
        if (value) {
            localStorage.setItem(key, value);
        }
    }, [value, key]);

    return [
        value,
        setValue
    ] as const
}