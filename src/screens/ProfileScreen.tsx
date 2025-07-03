import { User, LogOut, Shield, ChevronRight, Settings, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import UserNotificationsSettings from '../components/settings/UserNotificationsSettings';
import { useFetch } from '../hooks/useFetch';
import { useAuthUser } from '../hooks/useAuthUser';
import { LoadingState } from '../components/ui/LoadingState';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isGuestAccount, setIsGuestAccount] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showFinalDeleteConfirmation, setShowFinalDeleteConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //const userInfo = useAuthUser();

  // useEffect(() => {
  //   const info = authService.getUserInfo();
  //   setUserInfo(info);
  //   setIsGuestAccount(authService.isGuestAccount());
  // }, []);

  useEffect(() => {
    const fetchUserFromDB = async () => {
      setIsLoading(true);
      try {
        const info = await authService.getUserInfo();
        if (!info) return;
        //console.log('[ProfileScreen] User info:', info);
        setIsGuestAccount(authService.isGuestAccount());
        const user = await authService.getUserFromDB(info.id);
        //console.log('[ProfileScreen] User:', user);
        setUserInfo(user);
      } catch (error) {
        console.error('[ProfileScreen] Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    //console.log('[ProfileScreen] Fetching user from DB');
    fetchUserFromDB();
  }, []);

  const handleLogout = async () => {
    console.log('[ProfileScreen] Logging out');
    setIsLoggingOut(true);
    try {
      await logout();
      // Don't navigate - ProtectedRoute will automatically redirect when isAuthenticated changes
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
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

  const handleCompleteProfile = () => {
    navigate('/complete-profile');
  };

  // const { data: databaseUser, isLoading } = useFetch(
  //   "database-user",
  //   userInfo.id ?? 'fallback',
  //   authService.getUserById
  // );

  // console.log("databaseUser", databaseUser);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">Profile</h1>
      </div>
      <div className="space-y-4">
        {/* User Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
        >
          {isLoading ? (
            <LoadingState message="Loading profile..." />
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userInfo?.username || userInfo?.first_name || 'Guest User'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isGuestAccount ? 'Guest Account' : userInfo?.email}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Complete Profile Card for Guest Users */}
        {isGuestAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to Scrummy!
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
        )}

        {userInfo && <UserNotificationsSettings databaseUser={userInfo} />}

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
  );
}
