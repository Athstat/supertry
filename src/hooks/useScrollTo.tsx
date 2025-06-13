import { useEffect } from 'react';

export function useScrollTo(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ref]);
}

export function useScrollToCordnates(x: number, y: number) {
  useEffect(() => {
    window.scrollTo(x, y);
  }, []);
}
