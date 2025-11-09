import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react'

type Props = {
    icon?: ReactNode,
    onClick?: () => void,
    title?: string
}

/** Renders profile settings card */
export default function ProfileSettingCard({ icon, onClick, title }: Props) {
    
    return (
        <button
            onClick={onClick}
            className="w-full bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden px-6 py-4 flex items-center space-x-3 transition-colors disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-800/40"
        >
            <div className="flex items-center text-gray-500 gap-3">
                {icon}
                <span className="font-medium dark:text-gray-100">{title}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
        </button>

    )
}
