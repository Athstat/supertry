/** Renders a bottom sheet handle */

import { twMerge } from "tailwind-merge"

type Props = {
    className?: string,
    onMouseDown?: () => void,
    onDragStart?: () => void,
    onDragEnd?: () => void
}
export default function BottomSheetHandle({ className, onMouseDown, onDragEnd, onDragStart }: Props) {
    return (
        <div
            className={twMerge(
                "mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/40 dark:bg-white/20",
                className
            )}

            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onMouseDown={onMouseDown}
        />
    )
}
