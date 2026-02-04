import { RefObject, useEffect } from 'react';

export function useChatScroll(
  scrollRef: RefObject<HTMLElement>,
  deps: unknown[]
) {
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.scrollTop = element.scrollHeight;
  }, deps);
}
