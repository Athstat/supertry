import { useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import UserAvatarCard from "./avatar/UserAvatarCard";
import { useAuth } from "../../../contexts/auth/AuthContext";

/** Renders a user profile button component */
export default function UserProfileButton() {

    const {authUser} = useAuth();
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
            <UserAvatarCard
                imageUrl={authUser?.avatar_url}
                className="w-[35px] h-[35px]"
                iconCN="w-6 h-6"
            />
        </button>
    )
}
