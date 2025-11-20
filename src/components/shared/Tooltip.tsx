import { Fragment, useEffect, useRef, useState } from 'react'
import SecondaryText from './SecondaryText';

type Props = {
    title?: string
    text?: string,
    showTooltip?: boolean,
    coordinates?: {x: number, y: number, width?: number, height?: number}
}

export default function TooltipCard({ text, title, showTooltip, coordinates }: Props) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [styleLeft, setStyleLeft] = useState<number | undefined>(undefined);
    const [styleTop, setStyleTop] = useState<number | undefined>(undefined);
    const [transform, setTransform] = useState<string>('translate(-50%, -100%)');

    useEffect(() => {
        if (!showTooltip || !coordinates) return;

        const updatePosition = () => {
            const tooltipEl = ref.current;
            if (!tooltipEl) return;

            const tooltipRect = tooltipEl.getBoundingClientRect();
            const vw = window.innerWidth;

            const margin = 12;

            // Desired anchor point (viewport coordinates)
            const anchorX = coordinates.x;
            const anchorY = coordinates.y;

            // Clamp horizontal position so tooltip doesn't overflow viewport
            const halfW = tooltipRect.width / 2;
            const clampedX = Math.min(Math.max(anchorX, halfW + margin), vw - halfW - margin);

            // By default show above the anchor (translate -100%). If there's not enough
            // space above, show below the element.
            const willFitAbove = anchorY - tooltipRect.height - margin > 0;

            if (willFitAbove) {
                setTransform('translate(-50%, -100%)');
                setStyleTop(anchorY);
            } else {
                // Show below: anchor below element's bottom. If coordinates includes height, use it.
                const belowOffset = (coordinates.height ?? 0) + 8;
                setTransform('translate(-50%, 0)');
                setStyleTop(anchorY + belowOffset);
            }

            setStyleLeft(clampedX);
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [showTooltip, coordinates]);

    return (
        <Fragment>
            {showTooltip && (
                <div
                    ref={ref}
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        transform,
                        left: styleLeft,
                        top: styleTop,
                    }}
                >
                    <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-white px-3 py-2 rounded-lg shadow-xl border border-slate-400 dark:border-slate-600 whitespace-nowrap">
                        <div className="text-sm font-bold text-center">{title}</div>
                        <SecondaryText className="text-xs text-center mt-1 max-w-[200px] whitespace-normal">{text}</SecondaryText>
                        {/* Tooltip Arrow */}
                        <div className={`absolute ${transform === 'translate(-50%, -100%)' ? 'top-full' : 'bottom-full'} left-1/2 transform -translate-x-1/2`}>
                            <div className="border-4 border-transparent border-t-slate-800 dark:border-t-slate-900"></div>
                        </div>
                    </div>
                </div>
            )}
        </Fragment >
    )
}
