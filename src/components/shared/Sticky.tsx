import { forwardRef, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?:  string
}

export const Sticky = forwardRef<HTMLDivElement, Props>((props, ref) => {

    const {className, children} = props;
    
    return (
        <div className={twMerge(
            "sticky top-0 bg-white dark:bg-dark-800",
            className
        )}>
            <div ref={ref} ></div>
            {children}
        </div>
    )
})
