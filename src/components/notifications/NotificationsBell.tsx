import { Bell } from "lucide-react";
import { useInAppMessageCount } from "../../hooks/notifications/useInAppMessageCount";
import { twMerge } from "tailwind-merge";

type Props = {
    onClick?: () => void
}

export default function NotificationsBell({ onClick }: Props) {

    const {unread_count} = useInAppMessageCount();

    const handleClick = () => {
        if (onClick) {
            onClick()
        }
    }

    return (
        <div className="relative flex flex-col" >
            <button
                onClick={handleClick}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} />

                {unread_count > 0 && <div className={twMerge(
                    'bg-red-500 absolute bottom-0 right-0 text-white w-4 h-4 rounded-full'
                )} >
                    <p className="text-xs" >{unread_count}</p>
                </div>}

            </button>
        </div>
    )
}
