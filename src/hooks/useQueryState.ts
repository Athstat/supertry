import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type Options = {
  init?: string;
  cleanUp?: boolean;
};

export function useQueryState<T extends string = string>(
  key: string, 
  options?: Options
) {
  const { init, cleanUp } = options || {};
  const [params, setParams] = useSearchParams();
  
  // Memoize the value to prevent unnecessary recalculations
  const value = useMemo(() => 
    params.get(key) ?? init ?? null
  , [params, key, init]);

  const setValue = useCallback(
    (newValue?: string | null) => {
      setParams(prev => {
        const newParams = new URLSearchParams(prev);
        
        if (newValue == null || newValue === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, newValue);
        }
        
        return newParams;
      });
    },
    [key, setParams] // Remove params from dependencies
  );

  // Set initial value only once on mount
  useEffect(() => {
    if (init && !params.has(key)) {
      setParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set(key, init);
        return newParams;
      });
    }
  }, []); // Empty dependency array - run only once on mount

  // Cleanup effect
  useEffect(() => {
    if (!cleanUp) return;
    
    return () => {
      setParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete(key);
        return newParams;
      });
    };
  }, [cleanUp, key, setParams]);

  return [value as T | null, setValue] as const;
}

export function useQueryValue(key: string) {
  const [searchParams] = useSearchParams();
  const value = searchParams.get(key);

  return value;
}
