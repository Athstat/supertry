import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Props = {
    children?: React.ReactNode,
    onClose?: () => void,
    title?: string,
    open?: boolean,
    className?: string
}

export default function DialogModal({ children, onClose, title, open, className }: Props) {

    const handleOnClose = () => {
        if (onClose) {
            onClose();
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center ">
            <div className="bg-black w-[95%] md:w-[80%] lg:w-2/3 max-h-[90vh] my-4 rounded-lg" >
                <div className="bg-white dark:bg-gray-900/50 w-full max-h-[90vh]  rounded-lg p-6 shadow-xl overflow-y-auto flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold truncate dark:text-gray-100">{title}</h2>
                        <button
                            onClick={handleOnClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-600 dark:text-gray-400"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Tabs */}
                    <div className={twMerge("", className)}>
                        {children}
                    </div>
                </div>
            </div>
        </div >
    )
}
