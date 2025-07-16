import { LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserNotificationsSettings from '../components/settings/UserNotificationsSettings';
import LicensingModal from '../components/branding/licensing/LicensingModel';
import { authUserAtom, isGuestUserAtom } from '../state/authUser.atoms';
import { ScopeProvider } from 'jotai-scope';
import AuthUserDataProvider from '../components/auth/AuthUserDataProvider';
import { useAtomValue } from 'jotai';
import UserProfileHeader from '../components/auth/UserProfileHeader';
import ClaimGuestAccountBox from '../components/auth/ClaimGuestAccountBox';

export function UserProfileScreen() {

  const atoms = [authUserAtom, isGuestUserAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <AuthUserDataProvider>
        <Content />
      </AuthUserDataProvider>
    </ScopeProvider>
  );
}


function Content() {

  const { logout } = useAuth();

  const authUser = useAtomValue(authUserAtom);
  const isGuestAccount = useAtomValue(isGuestUserAtom); 

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false);

  console.log("Auth User ", authUser);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {};
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
    <main className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">Profile</h1>
      </div>
      <div className="space-y-4">

        {authUser && <UserProfileHeader 
          user={authUser}
          isGuestAccount={isGuestAccount}
        />}

        {/* Complete Profile Card for Guest Users */}
        {isGuestAccount && <ClaimGuestAccountBox />}

        {authUser && <UserNotificationsSettings databaseUser={authUser} />}
        <LicensingModal />

        {/* Logout Button */}
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
    </main>
  )
}