import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

type Props = {
    isGuestAccount?: boolean
}

export default function LogoutButton({ isGuestAccount }: Props) {

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            setIsLoggingOut(false);
        } catch { };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: isGuestAccount ? 0.3 : 0.2,
            }}
            className="bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
        >
            <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-6 py-4 flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
            >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
        </motion.div>
    )
}
