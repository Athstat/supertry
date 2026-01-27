import { ReactNode } from "react"
import TextHeading from "../typography/TextHeading"
import { twMerge } from "tailwind-merge"

type Props = {
    title?: string,
    leadingIcon?: ReactNode,
    children?: ReactNode,
    trailingSlot?: ReactNode,
    className?: string
}
export default function RoundedScreenHeader({ children, title, leadingIcon, className, trailingSlot }: Props) {
    return (
        <div className={twMerge(
            "bg-[#1196F5] text-white p-4 rounded-b-[20px] flex flex-col gap-2",
            className
        )} >

            <div className="flex flex-row items-center gap-2 justify-between" >
                <div className="flex flex-row items-center gap-2" >
                    <div className="w-[40px] h-[40px] bg-[#88CBFA] rounded-full flex flex-col items-center justify-center" >
                        {leadingIcon}
                    </div>
                    <TextHeading className="text-[22px] font-semibold" >{title}</TextHeading>
                </div>

                {trailingSlot}
            </div>

            {children}
        </div>
    )
}
