import React, { useState } from "react";
import {
  User,
  Trophy,
  Medal,
  Star,
  Bell,
  Moon,
  Mail,
  Lock,
  ChevronRight,
  Edit2,
} from "lucide-react";
import { FriendsSection } from "../components/profile/FriendsSection";
import { friends } from "../data/friends";

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const userStats = {
    totalPoints: 2456,
    currentRank: 7,
    currentDivision: 2,
    bestRank: 3,
    bestSeason: "2023/24",
    favoriteTeam: "Crusaders",
    gamesPlayed: 156,
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
                    Xiang Lee
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    @superCrypt
                  </p>
                </div>
                <button className="px-4 py-2 bg-primary-600 dark:bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-white">
                Total Points
              </div>
              <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                {userStats.totalPoints}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-white">
                Current Division
              </div>
              <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                #{userStats.currentDivision}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-white">
                Current Rank
              </div>
              <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                #{userStats.currentRank}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
              <div className="text-sm text-gray-600 dark:text-white">
                Best Rank
              </div>
              <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                #{userStats.bestRank}
              </div>
            </div>
          </div>
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

            {/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-gray-500" />
                <span className="font-medium dark:text-gray-100">
                  Dark Mode
                </span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? "bg-indigo-600" : "bg-gray-300 dark:bg-dark-600"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
}
