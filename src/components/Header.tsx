import React from "react";
import { Bell, Moon, Shield, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const isProfileActive = location.pathname === "/profile";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-850/80 border-b border-gray-700 dark:border-dark-600 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold dark:text-gray-100">
            RugbyFantasy
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            Leagues
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            My Teams
          </a>
          <a
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
          >
            Leaderboard
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button
            onClick={handleProfileClick}
            className={`p-2 transition-colors ${
              isProfileActive
                ? "text-primary-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
            aria-label="Profile"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
