import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    title?: string,
    onClose?: () => void,
    open?: boolean,
    className?: string
}

export default function StoryModal({children, title, onClose, className} : Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-black top-0 left-0 fixed h-full  z-[60] bg-opacity-65" >
        <div
            className={twMerge(
                'bg-white w-[95%] rounded-xl h-[95vh] relative',
                className
            )}
        >
            {children}
        </div>
    </div>
  )
}
