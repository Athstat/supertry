import { useNavigate, useLocation } from 'react-router-dom';
import ScrummyLogoHorizontal from '../../branding/scrummy_logo_horizontal';
import NotificationsBellButton from '../../notifications/NotificationsBellButton';
import { useNavigationBars } from '../../../hooks/navigation/useNavigationBars';
import CompetitionSelector from '../../fantasy-seasons/CompetitionSelector';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../../../types/constants';
import UserProfileButton from '../../auth/user_profile/UserProfileButton';
import { Activity } from 'react';
import { isInProduction } from '../../../utils/webUtils';
import BetaTag from '../../branding/BetaTag';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { topNavViewMode } = useNavigationBars();

  const pathsToShowCompetitionSelector = [
    '/dashboard',
    '/league',
    '/players',
    '/fixtures'
  ]

  const showCompetitionSelector = pathsToShowCompetitionSelector.find((p) => {
    return location.pathname?.startsWith(p);
  })

  const isInQa = isInProduction() === false;


  return (
    <Activity mode={topNavViewMode}>
      <header className={twMerge(
        "sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-none mb-0 pb-0",
        AppColours.BACKGROUND
      )}>
        <div className="container mx-auto px-1 h-16 overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div
              className="flex flex-row overflow-hidden items-start justify-start cursor-pointer"
              onClick={() => navigate('/dashboard')}
              tabIndex={0}
              aria-label="Navigate to home"
            >
              <ScrummyLogoHorizontal className="w-40" />
            </div>

            {isInQa && <BetaTag />}


          </div>

          {showCompetitionSelector && (
            <div className="ml-2">
              <CompetitionSelector />
            </div>
          )}

          <div className="flex items-center gap-4">
            <NotificationsBellButton />
            <UserProfileButton />
          </div>

        </div>
      </header>
    </Activity>
  );
}
