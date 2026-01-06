import { useState } from "react";

/** A smart a hook that calculates the best starting postion for an element to be
 * displayed on hover without being truncated by screen boundaries */
export function useHoverCoordinates(onHover?: () => void, onLeave?: () => void) {

    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Calculate optimal position to avoid viewport edges
        let x = rect.left + rect.width / 2;
        let y = rect.top - 10;

        // Adjust horizontal position if too close to edges
        const tooltipWidth = 200; // estimated tooltip width
        const horizontalMargin = 20; // increased margin for better aesthetics
        if (x - tooltipWidth / 2 < horizontalMargin) {
            x = tooltipWidth / 2 + horizontalMargin;
        } else if (x + tooltipWidth / 2 > viewport.width - horizontalMargin) {
            x = viewport.width - tooltipWidth / 2 - horizontalMargin;
        }

        // Adjust vertical position if too close to top
        const verticalMargin = 100; // increased margin for better spacing
        if (y < verticalMargin) {
            y = rect.bottom + 15; // Show below instead with more spacing
        }

        setCoordinates({ x, y });

        if (onHover) {
            onHover();
        }
    };

    const handleMouseLeave = () => {
        if (onLeave) {
            onLeave();
        }
    };

    return {
        handleMouseEnter,
        handleMouseLeave,
        coordinates
    }
}