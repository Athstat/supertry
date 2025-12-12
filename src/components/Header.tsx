import { User } from 'lucide-react';
import { Activity } from './shared/Activity';
import { useNavigate, useLocation } from 'react-router-dom';
import ScrummyLogoHorizontal from './branding/scrummy_logo_horizontal';
import { isInProduction } from '../utils/webUtils';
import BetaTag from './branding/BetaTag';
import NotificationsBell from './notifications/NotificationsBell';
import { useNavigationBars } from '../hooks/navigation/useNavigationBars';
import CompetitionSelector from './dashboard/CompetitionSelector';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { topNavViewMode } = useNavigationBars();

  const isInQa = isInProduction() !== true;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleInAppMessages = () => {
    navigate('/in-app-messages');
  };

  const isProfileActive = location.pathname === '/profile';
  const showCompetitionSelector =
    location.pathname === '/dashboard' || location.pathname.startsWith('/league');

  return (
    <Activity mode={topNavViewMode}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm shadow-none mb-0 pb-0">
        <div className="container mx-auto px-4 h-16 overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex flex-row overflow-hidden items-start justify-start cursor-pointer"
              onClick={() => navigate('/dashboard')}
              tabIndex={0}
              aria-label="Navigate to home"
            >
              <ScrummyLogoHorizontal className="" />
            </div>

            {isInQa && <BetaTag />}

            {showCompetitionSelector && (
              <div className="ml-2">
                <CompetitionSelector />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <NotificationsBell onClick={handleInAppMessages} />

            <button
              onClick={handleProfileClick}
              className={`p-2 transition-colors ${isProfileActive
                ? 'text-primary-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              aria-label="Profile"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>
    </Activity>
  );
}
