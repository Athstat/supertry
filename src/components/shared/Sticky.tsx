import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?:  string
}

export function Sticky({children, className} : Props) {

    return (
        <div className={twMerge(
            "sticky w-full top-16 bg-white dark:bg-dark-800 z-[999]",
            className
        )}>
            {children}
        </div>
    )
}
