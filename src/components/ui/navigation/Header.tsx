import { useNavigate, useLocation } from 'react-router-dom';
import ScrummyLogoHorizontal from '../../branding/scrummy_logo_horizontal';
import { isInProduction } from '../../../utils/webUtils';
import BetaTag from '../../branding/BetaTag';
import NotificationsBellButton from '../../notifications/NotificationsBellButton';
import { useNavigationBars } from '../../../hooks/navigation/useNavigationBars';
import CompetitionSelector from '../../fantasy-seasons/CompetitionSelector';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../../../types/constants';
import UserProfileButton from '../../auth/user_profile/UserProfileButton';
import { Activity } from 'react';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { topNavViewMode } = useNavigationBars();

  const isInQa = isInProduction() !== true;

  const showCompetitionSelector =
    location.pathname === '/dashboard' || location.pathname.startsWith('/league');
    

  return (
    <Activity mode={topNavViewMode}>
      <header className={twMerge(
        "sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-none mb-0 pb-0",
        AppColours.BACKGROUND
      )}>
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
            <NotificationsBellButton/>
            <UserProfileButton />
          </div>

        </div>
      </header>
    </Activity>
  );
}
