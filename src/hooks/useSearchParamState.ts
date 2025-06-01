import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/** Interfaces a useState like approach for search params */
export function useSearchParamState(key: string, initVal?: string) {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (initVal) {
            searchParams.set(key, initVal);
            setSearchParams(searchParams);
        }

        // clean up function, deletes search param value
        // component is distructed
        
        return () => {
            searchParams.delete(key);
            setSearchParams(searchParams);
        }
    }, [searchParams, key, initVal]);


    return [
        searchParams.get(key),
        (val: string) => {
            searchParams.set(key, val);
            setSearchParams(searchParams);
        }
    ]
}