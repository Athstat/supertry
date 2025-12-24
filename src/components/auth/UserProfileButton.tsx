import { User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

/** Renders a user profile button component */
export default function UserProfileButton() {

    const location = useLocation();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const isProfileActive = location.pathname === '/profile';

    return (
        <button
            onClick={handleProfileClick}

            // className={`p-2 transition-colors ${isProfileActive
            //     ? 'text-primary-500'
            //     : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            //     }`}

            className={twMerge(
                'p-2 transition-colors',
                isProfileActive ? 
                    'text-primary-500' :
                    'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            )}
            aria-label="Profile"
        >
            <User size={20} />
        </button>
    )
}
