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
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRippleMap((prev) => ({
      ...prev,
      [id]: { x, y },
    }));

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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-850/80 backdrop-blur-lg border-t-2 border-gray-200 dark:border-gray-700/50 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map(({ id, path, icon: Icon, label }) => {
            const isActive = pathname === path;
            const ripple = rippleMap[id];

            return (
              <Link
                key={id}
                to={path}
                onClick={(e) => handleRipple(id, e)}
                className={`relative flex flex-col items-center py-2 px-3 min-w-[64px] overflow-hidden ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className={`mb-1 transition-colors ${
                      isActive
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium truncate max-w-[64px] text-center">
                  {label}
                </span>
                {ripple && (
                  <span
                    className="absolute rounded-full bg-gray-400/20 animate-ripple"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
