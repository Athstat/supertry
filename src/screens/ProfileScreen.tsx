import { useState} from "react";
import {
  User,
  Medal,
  Bell,
  Mail,
  Lock,
  ChevronRight,
  Edit2,
  LogOut,
} from "lucide-react";
import { FriendsSection } from "../components/profile/FriendsSection";
import { friends } from "../data/friends";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import useSWR from "swr";
import { userRankingsService } from "../services/userRankingsService";
import UserStatsGrid from "../components/profile/UserStatsGrid";

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);

  const userInfo = useAuthUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Victory",
      icon: "🏆",
      description: "Won your first league match",
      earnedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Rising Star",
      icon: "⭐",
      description: "Reached top 100 in rankings",
      earnedDate: "2024-02-20",
    },
    {
      id: "3",
      name: "Team Builder",
      icon: "👥",
      description: "Created 5 different teams",
      earnedDate: "2024-03-01",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,q_auto,w_720/67338d48953975001dd4b446.png"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                <Edit2 size={14} />
              </button>
            </div>
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
                <button className="px-4 py-2 bg-primary-600 dark:bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <UserStatsGrid />
        </div>

        {/* Friends Section */}
        <FriendsSection
          friends={friends}
          followingCount={142}
          followersCount={98}
        />

        {/* Achievements */}
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
        </div>

        {/* Settings */}
        <div className="bg-white dark:bg-dark-800/40 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-gray-100">
            <User size={20} className="text-primary-600" />
            Settings
          </h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">Email</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800/40 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">Password</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

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
