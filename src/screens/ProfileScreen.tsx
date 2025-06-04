import {
  User,
  LogOut,
  Shield,
  ChevronRight,
  Settings
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { authService } from "../services/authService";
import UserNotificationsSettings from "../components/settings/UserNotificationsSettings";
import { useFetch } from "../hooks/useFetch";
import { useAuthUser } from "../hooks/useAuthUser";



export function ProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isGuestAccount, setIsGuestAccount] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  //const userInfo = useAuthUser();

  // useEffect(() => {
  //   const info = authService.getUserInfo();
  //   setUserInfo(info);
  //   setIsGuestAccount(authService.isGuestAccount());
  // }, []);

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const info = await authService.getUserInfo();
      setIsGuestAccount(authService.isGuestAccount());
      if (!info) return;
      const user = await authService.getUserFromDB(info.id);
      console.log("[ProfileScreen] User:", user);
      setUserInfo(user);
    };
    console.log("[ProfileScreen] Fetching user from DB");
    fetchUserFromDB();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // For guest accounts, navigate to welcome screen with signin/create account options
      if (isGuestAccount) {
        navigate("/auth-choice");
      } else {
        navigate("/auth-choice");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  const handleCompleteProfile = () => {
    navigate("/complete-profile");
  };

  // const { data: databaseUser, isLoading } = useFetch(
  //   "database-user",
  //   userInfo.id ?? 'fallback',
  //   authService.getUserById
  // );

  // console.log("databaseUser", databaseUser);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-850">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* User Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userInfo?.username || "Guest User"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isGuestAccount ? "Guest Account" : userInfo?.email}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Complete Profile Card for Guest Users */}
          {isGuestAccount && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Scrummy!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Enhance your experience by creating a full account.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                Adding your email will allow you to access your teams across all
                your devices and keep them secure.
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
            transition={{ delay: isGuestAccount ? 0.3 : 0.2 }}
            className="bg-white dark:bg-dark-800 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full px-6 py-4 flex items-center justify-center space-x-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
