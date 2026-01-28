import { useLocation, Link } from 'react-router-dom';
import { Home, Trophy, Users, Calendar } from 'lucide-react';
import { useState, useRef, useEffect, Activity } from 'react';
import { useNavigationBars } from '../../../hooks/navigation/useNavigationBars';
import { School } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../../../types/constants';

export function BottomNav() {
  const { bottomNavViewMode } = useNavigationBars();
  const { pathname } = useLocation();
  const [rippleMap, setRippleMap] = useState<Record<string, { x: number; y: number }>>({});
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleRipple = (id: string, e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
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

  // const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   setShowMoreMenu(!showMoreMenu);
  //   handleRipple('more', e);
  // };

  // const handleMenuItemClick = (path: string) => {
  //   navigate(path);
  //   setShowMoreMenu(false);
  // };

  // const moreMenuItems = [
  //   { icon: Trophy, label: 'Competitions', path: '/seasons' },
  //   { icon: Sparkles, label: 'Prediction Rankings', path: '/predictions' },
  //   { icon: ArrowDownUp, label: 'Fantasy Rankings', path: '/fantasy-rankings' },
  // ];

  const navItems = [
    { id: 'dashboard', path: '/dashboard', icon: Home, label: 'Home' },
    { id: 'players', path: '/players', icon: Users, label: 'Players' },
    { id: 'leagues', path: '/leagues', icon: Trophy, label: 'Fantasy' },
    { id: 'fixtures', path: '/fixtures', icon: Calendar, label: 'Fixtures' },
    { id: 'schools', path: '/schools', icon: School, label: 'Schools' },
  ];

  return (
    <Activity mode={bottomNavViewMode}>
      <div className={twMerge(
        "fixed bottom-0 left-0 right-0 bg-white backdrop-blur-sm z-[100] shadow-sm",
        AppColours.BACKGROUND,
        "bg-white"
      )}>
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

          {/* More Menu
          <div ref={menuRef} className="relative w-full h-full">
            <button
              onClick={handleMoreClick}
              className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden text-gray-500 dark:text-gray-400"
            >
              {rippleMap['more'] && (
                <span
                  className="absolute bg-gray-200 dark:bg-gray-700 rounded-full animate-ripple"
                  style={{
                    left: rippleMap['more'].x,
                    top: rippleMap['more'].y,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="5" cy="12" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
              </svg>
              <span className="text-xs mt-1">More</span>
            </button>

            {/* Popup Menu */}
          {/* {showMoreMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-white dark:bg-dark-850 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-[9999]">
                {moreMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleMenuItemClick(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </Activity>
  );
}
