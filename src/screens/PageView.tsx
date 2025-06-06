import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string
}

export default function PageView({ children, className }: Props) {


    return (
        <div className="w-full dark:text-white h-full flex flex-col items-center justify-start lg:py-8" >
            <div className={twMerge(
                "w-full lg:w-[50%]",
                className
            )} >
                {children}
            </div>
        </div>
    )
}
