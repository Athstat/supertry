import { useEffect } from 'react';

export function useScrollTo(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref]);
}
