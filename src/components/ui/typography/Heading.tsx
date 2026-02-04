import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

/** Renders a standard heading */

export default function Heading1({ children, className }: Props) {
    return (
        <h1
            className={twMerge(
                'font-semibold text-black dark:text-white text-xl',
                className
            )}

            style={{ fontFamily: 'Oswald, sans-serif' }}
        >
            {children}
        </h1>
    )
}
