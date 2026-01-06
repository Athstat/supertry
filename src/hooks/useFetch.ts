import { useEffect, useState } from "react";
import useSWR from "swr";
import { SWRResponse } from "swr/_internal";

export function useAsync<T>(func: () => Promise<T>) {

    const [data, setData] = useState<T>();
    const [error, setError] = useState<string>();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const wrapper = async () => {

            setLoading(true);

            try {

                const res = await func();
                setData(res);

            } catch (e) {
                const err = e as Error;
                setError(err.message);
            }

            setLoading(false);
        };

        wrapper();
    }, [func]);

    return { data, error, isLoading };

}

// TODO: Deperecate
/** Custom fetch hook with revalidation and caching */
export function useFetch<T, E = string | number | undefined>(
    cacheGroup: string,
    key: E,
    fetcher: (key: E) => Promise<T>,
    dependencies?: any[]
): SWRResponse<T, any> {
    const fetchKey = key !== undefined ? [key, cacheGroup] : null;
    return useSWR<T>(fetchKey, () => fetcher(key));
}