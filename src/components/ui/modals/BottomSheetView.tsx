import { ReactNode } from "react"
import BottomSheetHandle from "./BottomSheetHandle"
import { twMerge } from "tailwind-merge"
import { AnimatePresence, motion } from "framer-motion"
import { AppColours } from "../../../types/constants"

type Props = {
    children?: ReactNode,
    className?: string,
    hideHandle?: boolean,
    noAnimation?: boolean,
    showTopBorder?: boolean,
    overlayBg?: boolean,
    onClickOutside?: () => void
}

/** Renders a bottom sheet view that starts from the bottom of the screen */
export default function BottomSheetView({ className, children, hideHandle, noAnimation, showTopBorder, onClickOutside }: Props) {


    const handleClickOutside = () => {
        if (onClickOutside) {
            onClickOutside();
        }
    }

    return (
        <div className="z-[150] bg-black/50 dark:bg-black/70 top-0 left-0 fixed w-full h-full flex flex-col" >
            
            <div onClick={handleClickOutside} className="h-full flex-1" >
            </div>

            <Root noAnimation={noAnimation} >
                <div className={twMerge(
                    "lg:max-w-[40%] overflow-y-auto no-scrollbar flex flex-col gap-2 md:max-w-[50%] max-h-[130px] min-h-[130px]  w-full bg-white dark:bg-[#0D0D0D] rounded-t-3xl drop-shadow-2xl shadow-[0_-8px_20px_rgba(0,0,0,0.3)]",
                    className,
                    showTopBorder && "border-t dark:border-slate-600",
                    AppColours.BACKGROUND
                )}>

                    {!hideHandle && <div className="flex flex-row items-center justify-center w-full" >
                        <BottomSheetHandle />
                    </div>}

                    {children}
                </div>
            </Root>
        </div>
    )
}

type NoAnimationProps = {
    children?: ReactNode
}

function NoAnimationRoot({ children }: NoAnimationProps) {
    return (
        <div
            className="fixed z-[200] bottom-0 left-0 right-0 w-full  flex flex-col items-center justify-center"
        >
            {children}
        </div>
    )
}

function AnimatedRoot({ children }: NoAnimationProps) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed z-[200] bottom-0 right-0 left-0 w-full  flex flex-col items-center justify-center"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: ["100%", "50%", "0%"] }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

type RootProps = {
    noAnimation?: boolean,
    children?: ReactNode
}

function Root({ children, noAnimation }: RootProps) {
    if (noAnimation) {
        return (
            <NoAnimationRoot>
                {children}
            </NoAnimationRoot>
        )
    }

    return (
        <AnimatedRoot>
            {children}
        </AnimatedRoot>
    )
}
