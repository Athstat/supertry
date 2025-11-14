import { useCallback, useEffect, useState } from "react";
import { logger } from "../services/logger";

/** Hook that can take data, serialize it, and save it in local storage
 * useful for when you are making local auto saves before uploading data
 */
export function useLocalSave<T>(key: string) {

    const [data, setData] = useState<T>();

    useEffect(() => {
        const loader = () => {
            setData(loadFromStorage<T>(key));
        }

        loader();
    }, [key]);

    const saveChanges = useCallback((newData: T) => {
        saveToStorage(key, newData);
        setData(newData);
    }, [key]);

    const purge = useCallback(() => {
        localStorage.removeItem(key);
    }, [key]);

    return {
        data,
        saveChanges,
        purge
    }

}

function loadFromStorage<T>(key: string): T | undefined {
    try {

        const dataAsStr = localStorage.getItem(key);

        if (dataAsStr) {
            return JSON.parse(dataAsStr);
        }

    } catch (err) {
        logger.error("Error loading data from local storage ", err);
    }

    return undefined;
}

function saveToStorage<T>(key: string, data: T): void {
    
    try {

        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);

    } catch (err) {
        logger.error("Error loading data from local storage ", err);
    }

}