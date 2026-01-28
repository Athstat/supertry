import { ReactNode } from "react"
import TextHeading from "../typography/TextHeading"
import { twMerge } from "tailwind-merge"

type Props = {
    title?: string,
    leadingIcon?: ReactNode,
    children?: ReactNode,
    trailingSlot?: ReactNode,
    className?: string,
    titleCN?: string
}
export default function RoundedScreenHeader({ children, title, leadingIcon, className, trailingSlot, titleCN }: Props) {
    return (
        <div className={twMerge(
            "bg-[#1196F5] text-white p-4 rounded-b-[20px] flex flex-col gap-6",
            className
        )} >

            <div className="flex flex-row items-center gap-2 justify-between" >
                <div className="flex flex-row items-center gap-3" >
                    <div className="w-[42px] h-[42px]  bg-white/50 rounded-full flex flex-col items-center justify-center" >
                        {leadingIcon}
                    </div>
                    <TextHeading className={twMerge(
                        "text-[24px] font-semibold",
                        titleCN
                    )} >{title}</TextHeading>
                </div>

                {trailingSlot}
            </div>

            {children}
        </div>
    )
}
