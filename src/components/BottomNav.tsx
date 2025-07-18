import { useLocation, Link } from 'react-router-dom';
import { Home, Trophy, Users, BarChart, Calendar, User } from 'lucide-react';
import { useState } from 'react';

export function BottomNav() {
  const { pathname } = useLocation();
  const [rippleMap, setRippleMap] = useState<Record<string, { x: number; y: number }>>({});

  const handleRipple = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRippleMap(prev => ({
      ...prev,
      [id]: { x, y },
    }));

    setTimeout(() => {
      setRippleMap(prev => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });
    }, 600);
  };

  const navItems = [
    { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Dashboard' },
    { id: 'leagues', path: '/leagues', icon: Trophy, label: 'Leagues' },
    { id: 'fixtures', path: '/fixtures', icon: Calendar, label: 'Fixtures' },
    { id: 'players', path: '/players', icon: Users, label: 'Players' },
    { id: 'profile', path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(item => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full relative overflow-hidden ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={e => handleRipple(item.id, e)}
            >
              {rippleMap[item.id] && (
                <span
                  className="absolute bg-gray-200 dark:bg-gray-700 rounded-full animate-ripple"
                  style={{
                    left: rippleMap[item.id].x,
                    top: rippleMap[item.id].y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
              <Icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
