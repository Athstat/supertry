import { RefObject, useEffect } from 'react';

export function useChatScroll(
  scrollRef: RefObject<HTMLElement | null>,
  otherDeps: unknown[]
) {
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, ...otherDeps]);
}
