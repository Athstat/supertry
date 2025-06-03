import {
  User,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import UserStatsGrid from "../components/profile/UserStatsGrid";
import UserNotificationsSettings from "../components/settings/UserNotificationsSettings";
import { useFetch } from "../hooks/useFetch";
import { authService } from "../services/authService";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";

export function ProfileScreen() {
  
  const navigate = useNavigate();

  const userInfo = useAuthUser();
  const { logout } = useAuth();

  const { data: databaseUser, isLoading } = useFetch(
    "database-user",
    userInfo.id ?? 'fallback',
    authService.getUserById
  );

  const handleGoToMyTeams = () => {
    navigate("/my-teams");
  }

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (isLoading) return <LoadingState />

  if (!databaseUser) return (
    <ErrorState message="Error retrieving your user profile" />
  )

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold dark:text-gray-100">
                    {userInfo
                      ? `${userInfo.firstName} ${userInfo.lastName}`
                      : "Loading..."}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {userInfo?.username || ""}
                  </p>
                  {/* <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {userInfo?.email || ""}
                  </p> */}
                </div>
                {/* <button className="px-4 py-2 bg-primary-600 dark:bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button> */}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <UserStatsGrid />
        </div>

        {/* Friends Section - Commented out
        <FriendsSection
          friends={friends}
          followingCount={142}
          followersCount={98}
        /> */}

        {/* Achievements - Commented out
        <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-gray-100">
            <Medal size={20} className="text-primary-600" />
            Achievements
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold dark:text-gray-100">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(achievement.earnedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Settings */}
        <div className="bg-white dark:bg-dark-800/40 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-gray-100">
            <User size={20} className="text-primary-600" />
            Settings
          </h2>
          <div className="space-y-4">
            {/* Email - Commented out
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">Email</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            */}

            {/* Password - Commented out
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">Password</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
            */}

            <UserNotificationsSettings 
              databaseUser={databaseUser}
            />

            {/* User Teams */}
            <button onClick={handleGoToMyTeams} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">My Teams</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>


            {/* Notifications - Commented out
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">
                  Notifications
                </span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications
                    ? "bg-primary-600"
                    : "bg-gray-300 dark:bg-dark-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            */}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut size={20} className="text-red-500" />
                <span className="font-medium text-red-600 dark:text-red-400">
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
