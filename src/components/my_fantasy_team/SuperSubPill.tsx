import { twMerge } from "tailwind-merge"

type Props = {
    className?: string
}

/** Renders Super Sub Pill */
export default function SuperSubPill({className} : Props) {
    return (
        <p className={twMerge(
            "px-2 w-fit  cursor-pointer text-sm rounded-full bg-yellow-100 border border-yellow-500 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-500 dark:border-yellow-500/40",
            className
        )}>
            Super Sub
        </p>
    )
}
