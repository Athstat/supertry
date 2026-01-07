import { Info, XIcon } from "lucide-react";
import { ReactNode, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useClickOutside } from "../../hooks/useClickOutside";

type WaringProps = {
    open?: boolean,
    children?: ReactNode,
    onClose?: () => void,
    message?: string,
    className?: string
}

export function WarningPopup({ open, children, onClose, message, className }: WaringProps) {
    
    const modalRef = useRef<HTMLDivElement>(null);
    useClickOutside<HTMLDivElement>(modalRef, onClose);
    
    if (!open) return;
    
    return (
        <div className="bg-black/20 top-0 z-[100] fixed left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center" >
            <div
                className={twMerge(
                    "bg-white dark:text-slate-400 text-slate-600 dark:bg-slate-900 w-[80%] lg:w-[50%]   h-[200px] rounded-xl overflow-hidden p-4",
                    className
                )}
                ref={modalRef}
            >
                <div className="flex flex-row items-center justify-between" >
                    <div className="flex flex-row font-bold gap-1 items-center text-black dark:text-white " >
                        <Info className="w-4 h-4" />
                        <p className="" >Warning</p>
                    </div>
                    <button onClick={onClose} >
                        <XIcon className="w-4 h-4 text-black dark:text-white" />
                    </button>
                </div>

                <div className="flex flex-col flex-[2] h-4/5 items-center justify-center" >
                    <p>{children ?? message}</p>
                </div>

                {/* <div className="flex-1" >
                    <button>Dismiss</button>
                </div> */}

            </div>
        </div>
    )
}