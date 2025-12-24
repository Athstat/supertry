import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react'
import SecondaryText from '../shared/SecondaryText';
import { useAuth } from '../../contexts/AuthContext';
import { isGuestUser } from '../../utils/deviceId/deviceIdUtils';

type Props = {
    icon?: ReactNode,
    onClick?: () => void,
    title?: string,
    description?: string,
    hideForGuestUsers?: boolean
}

/** Renders profile settings card */
export default function ProfileSettingCard({ icon, onClick, title, description, hideForGuestUsers }: Props) {

    const { authUser } = useAuth();
    const isGuest = isGuestUser(authUser);

    if (isGuest && hideForGuestUsers) {
        return;
    }

    return (
        <button
            onClick={onClick}
            className="w-full bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden px-4 py-3 flex flex-row items-center space-x-3 transition-colors disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-800/40"
        >
            <div className='text-gray-500' >
                {icon}
            </div>

            <div className='flex flex-col items-start justify-center' >
                <div className='flex flex-row items-center gap-2' >
                    <span className="font-medium dark:text-gray-100">{title}</span>
                    <ChevronRight size={20} className="text-gray-400" />
                </div>
                <SecondaryText className='text-xs text-left' >{description}</SecondaryText>
            </div>


        </button>
    )
}
