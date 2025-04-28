import { useEffect, useState } from "react";

export function useAsync<T>(func: () => Promise<T>) {

    const [data, setData] = useState<T>();
    const [error, setError] = useState<string>();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const wrapper = async () => {

            setLoading(false);

            try {
                
                const res = await func();
                setData(res);

            } catch (e) {
                const err = e as Error;
                setError(err.message);
            }

            setLoading(true);
        };

        wrapper();
    }, [func]);

    return {data, error};

}