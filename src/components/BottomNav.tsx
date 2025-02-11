import { useLocation, Link } from "react-router-dom";
import { Home, Trophy, Users, Shield } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

export function BottomNav() {
  const { pathname } = useLocation();
  const [rippleMap, setRippleMap] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const handleRipple = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRippleMap((prev) => ({
      ...prev,
      [id]: { x, y },
    }));

    // Clean up ripple effect after animation
    setTimeout(() => {
      setRippleMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }, 600);
  };

  const navItems = [
    { id: "dashboard", path: "/dashboard", icon: Home, label: "Home" },
    { id: "leagues", path: "/join-league", icon: Shield, label: "Leagues" },
    { id: "my-teams", path: "/my-teams", icon: Users, label: "My Teams" },
    { id: "rankings", path: "/rankings", icon: Trophy, label: "Rankings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-850 border-t border-gray-700 dark:border-dark-600 px-6 py-2 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map(({ id, path, icon: Icon, label }) => (
          <Link
            key={id}
            to={path}
            onClick={(e) => handleRipple(id, e)}
            className="relative flex flex-col items-center py-2 px-6 rounded-lg overflow-hidden"
          >
            {/* Ripple effect */}
            {rippleMap[id] && (
              <span
                className="absolute bg-gray-400/20 dark:bg-gray-600/20 rounded-full animate-ripple"
                style={{
                  left: rippleMap[id].x,
                  top: rippleMap[id].y,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}

            <Icon
              size={24}
              className={`transition-colors duration-200 ${
                pathname.startsWith(path)
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <span
              className={`text-xs mt-1 transition-colors duration-200 ${
                pathname.startsWith(path)
                  ? "text-primary-600 dark:text-primary-400 font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
