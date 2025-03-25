import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, Users, BarChart3, User } from "lucide-react";

export function BottomNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/")
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          to="/leagues"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/leagues")
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Trophy size={20} />
          <span className="text-xs mt-1">Leagues</span>
        </Link>

        <Link
          to="/players"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/players")
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Players</span>
        </Link>

        <Link
          to="/my-teams"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/my-teams")
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Users size={20} />
          <span className="text-xs mt-1">My Teams</span>
        </Link>

        <Link
          to="/rankings"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/rankings")
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Rankings</span>
        </Link>
      </div>
    </div>
  );
}
