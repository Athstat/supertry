import { XIcon } from "lucide-react"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    icon?: any,
    title?: string,
    className?: string,
    open?: boolean,
    height?: string,
    width?: string,
    onClose?: () => void
}


export default function SettingsModal({ children, icon, title, className, width, height, onClose, open }: Props) {

    const Icon = icon;

    if (!open) return;

    return (
        <div className="top-0 left-0 bg-black/40 fixed w-full h-screen overflow-hidden flex flex-col items-center justify-center " >

            <div className="w-[90%] h-[70%] bg-black rounded-xl" >
                <div className={twMerge(
                    "w-full h-full bg-white dark:bg-dark-800/50  p-5 rounded-xl",
                    width && `w-[${width}]`,
                    height && `w-[${height}]`,
                )} >
                    <div className="w-full dark:text-white flex flex-row items-center justify-between" >
                        <div className="flex flex-row items-center gap-2" >
                            {icon && <Icon />}
                            <p className="text-lg font-semibold" >{title}</p>
                        </div>

                        <button  className="p-2 cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-800 rounded-full" onClick={onClose} >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className={twMerge("w-full", className)} >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
