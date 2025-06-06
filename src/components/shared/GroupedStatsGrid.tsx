import { forwardRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    children?: ReactNode,
    title?: string,
    className?: string,
    wrapperClassName?: string
}

export const GroupedStatsGrid = forwardRef<HTMLDivElement, Props>(({children, title, className, wrapperClassName}, ref) => {
    return (
        <div
            ref={ref}
            className={twMerge("bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6", wrapperClassName)}
        >
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
                {title}
            </h2>
            <div className={twMerge("grid grid-cols-2 gap-4", className)}>
                {children}
            </div>

        </div>
    )
})
