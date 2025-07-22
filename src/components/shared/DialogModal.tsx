import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
    children?: React.ReactNode,
    onClose?: () => void,
    title?: string,
    open?: boolean,
    className?: string,

    /** The hight and width of the outer view point of the modal */
    hw?: string,
    outerCon?: string
}

export default function DialogModal({ children, onClose, title, open, className, hw, outerCon }: Props) {

    const handleOnClose = () => {
        if (onClose) {
            onClose();
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[200] flex flex-col items-center justify-center ">
            <div className={twMerge(
                "bg-black w-[95%] md:w-[80%] lg:w-2/3 max-h-[90vh] my-4 rounded-lg",
                hw
            )} >

                <div
                    className={twMerge(
                        "bg-white dark:bg-gray-800/70 border border-slate-300 dark:border-slate-700 w-full h-full  rounded-lg p-6 shadow-xl overflow-y-auto flex flex-col",
                        outerCon
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-md lg:text-xl font-bold text-gray-900 truncate dark:text-gray-100">{title}</h2>
                        <button
                            onClick={handleOnClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    
                    <div className={twMerge("", className)}>
                        {children}
                    </div>
                </div>
            </div>
        </div >
    )
}
