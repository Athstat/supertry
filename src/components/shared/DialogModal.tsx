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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70] animate-fade-scale-up ">
            <div className="bg-white p-4 dark:bg-gray-900 rounded-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold dark:text-gray-100">{title}</h2>
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
        </div >
    )
}
