import { useEffect, useState } from "react";
import useSWR from "swr";
import { FetcherResponse, SWRResponse } from "swr/_internal";

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

export function useFetch<T, E>(
    cacheGroup: string,
    key: E,
    fetcher: (key: E) => Promise<T>
): SWRResponse<T, any> {
    return useSWR<T>([cacheGroup, key], ([, actualKey]: [string, E]) => fetcher(actualKey));
}