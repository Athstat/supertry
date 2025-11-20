import { RefObject, useCallback, useEffect, useState } from "react";

/**
 * Recursively finds the nearest scrollable parent that scrolls on X or Y axis.
 */
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
  if (!node) return null;

  const style = getComputedStyle(node);
  const overflowX = style.overflowX;
  const overflowY = style.overflowY;

  const isScrollable =
    overflowX === "scroll" ||
    overflowX === "auto" ||
    overflowY === "scroll" ||
    overflowY === "auto";

  return isScrollable ? node : getScrollParent(node.parentElement);
}

/**
 * Hook: Tracks the page-based x/y coordinates of an element,
 * accounting for both window scrolling and scrollable containers.
 */
export function useNodeCoordinates(ref: RefObject<HTMLElement | null>) {
  const [x, setX] = useState<number>();
  const [y, setY] = useState<number>();
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const measureView = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    // getBoundingClientRect returns coordinates relative to the viewport.
    const rect = node.getBoundingClientRect();

    // For fixed-positioned tooltips appended to body, we want viewport coordinates.
    // Use the element's center x and its top y by default.
    const vx = rect.left + rect.width / 2;
    const vy = rect.top;

    setX(vx);
    setY(vy);
    setWidth(rect.width);
    setHeight(rect.height);
  }, [ref]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const scrollParent = getScrollParent(node);

    measureView();

    // Listen to window scroll/resize
    window.addEventListener("scroll", measureView, true);
    window.addEventListener("resize", measureView);

    // Also listen to scroll events on the nearest scrollable parent so
    // horizontal/vertical scrolling inside containers triggers a re-measure.
    if (scrollParent && scrollParent !== document.body && scrollParent !== document.documentElement) {
      scrollParent.addEventListener("scroll", measureView, true);
    }

    return () => {
      window.removeEventListener("scroll", measureView, true);
      window.removeEventListener("resize", measureView);
      if (scrollParent && scrollParent !== document.body && scrollParent !== document.documentElement) {
        scrollParent.removeEventListener("scroll", measureView, true);
      }
    };
  }, [measureView, ref]);

  return {
    x,
    y,
    width,
    height,
    coordinates:
      x !== undefined && y !== undefined && width !== undefined && height !== undefined
        ? { x, y, width, height }
        : undefined,
  };
}
