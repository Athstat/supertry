import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type Options = {
  init?: string;
  cleanUp?: boolean;
};

export function useQueryState<T>(key: string, options?: Options) {
  const init = options?.init;
  // const cleanUp = options?.cleanUp;

  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? init;

  const setValue = useCallback(
    (newValue?: string) => {
      const newParams = new URLSearchParams(params);

      if (newValue === '' || newValue === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, newValue);
      }

      setParams(newParams);
    },
    [params, key, setParams]
  );

  useEffect(() => {
    if (init && !params.has(key)) {
      setValue(init);
    }
  }, [init, key, params, setValue]);

  // useEffect(() => {

  //     return () => {
  //         if (cleanUp === true) {

  //             const newParams = new URLSearchParams(params);
  //             newParams.delete(key);
  //             setParams(newParams);

  //         }
  //     }
  // }, []);

  return [value as T, setValue] as const;
}

export function useQueryValue(key: string) {
  const [searchParams] = useSearchParams();
  const value = searchParams.get(key);

  return value;
}
