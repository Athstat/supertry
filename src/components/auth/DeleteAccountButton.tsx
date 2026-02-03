import { motion } from 'framer-motion';
import { useState } from 'react'
import { logger } from '../../services/logger';
import { useAuth } from '../../contexts/auth/AuthContext';

type Props = {
    isGuestAccount?: boolean
}

export default function DeleteAccountButton({ isGuestAccount }: Props) {

    const {logout} = useAuth();

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch(err){
            logger.error("Error logging out ", err);
        };
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        setShowDeleteConfirmation(false);
        setShowFinalDeleteConfirmation(true);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
        setShowFinalDeleteConfirmation(false);
    };

    const finalConfirmDelete = async () => {
        console.log('Deleting account confirmed');
        setShowFinalDeleteConfirmation(false);
        // Here you would call your API to initiate account deletion
        // Then log the user out
        await handleLogout();
    };

    return (
        <div>
            {/* Delete Account Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: isGuestAccount ? 0.3 : 0.2,
                }}
                className="pt-2 flex items-center justify-center"
            >
                <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:underline"
                >
                    <span className="font-medium">Delete Account</span>
                </button>
            </motion.div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Do you really want to delete your account?
                        </h3>
                        <div className="flex space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                            >
                                No, cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Delete Confirmation Modal */}
            {showFinalDeleteConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Permanent account deletion
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This process can't be undone. It'll take 24-48 hours to complete.
                        </p>
                        <div className="flex flex-col">
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={finalConfirmDelete}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg mt-2"
                            >
                                Delete permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
