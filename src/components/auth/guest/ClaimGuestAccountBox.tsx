import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function ClaimGuestAccountBox() {

    const navigate = useNavigate();
    
    const handleCompleteProfile = () => {
        navigate('/complete-profile');
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
            >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Welcome to SCRUMMY!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Enhance your experience by creating a full account.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                    Adding your email will allow you to access your teams across all your devices and keep
                    them secure.
                </p>
                <button
                    onClick={handleCompleteProfile}
                    className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                    Complete Your Profile
                    <ChevronRight className="ml-2 h-5 w-5" />
                </button>
            </motion.div>

        </div>
    )
}
