import { forwardRef, ReactNode } from 'react'

type Props = {
    children?: ReactNode,
    title?: string
}

export const GroupedStatsGrid = forwardRef<HTMLDivElement, Props>(({children, title}, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6"
        >
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
                {title}
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {children}
            </div>

        </div>
    )
})
