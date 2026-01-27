import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../../types/games';
import { useState } from 'react';
import { Info } from 'lucide-react';
import WarningCard from '../../ui/cards/WarningCard';
import { analytics } from '../../../services/analytics/anayticsService';
import { QuickFixtureModal } from '../QuickFixtureModal';
import { FixtureCardHeaderSection } from './FixtureCardHeader';
import { FixtureCardTeamSection } from './FixtureCardTeamSection';
import { FixtureCardGameStatusSection } from './FixtureCardGameStatusSection';
type Props = {
  fixture: IFixture;
  className?: string;
  showCompetition?: boolean;
  showLogos?: boolean;
  showVenue?: boolean;
  message?: string;
  hideDate?: boolean;
  liveGameClock?: string | null;
};

export default function FixtureCard({
  fixture,
  className,
  showCompetition,
  showLogos,
  showVenue,
  message,
  hideDate,
}: Props) {


  const [showModal, setShowModal] = useState(false);
  const toogle = () => setShowModal(!showModal);

  const handleClick = () => {
    toogle();
    analytics.trackFixtureCardClicked(fixture);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={twMerge(
          'p-4 flex cursor-pointer justify-center flex-col bg-white shadow-sm border border-slate-300 dark:border-slate-700 text-white hover:bg-slate-50/50 gap-1 dark:hover:bg-dark-800/50 dark:bg-slate-800/40 transition-colors',
          className
        )}
      >
        <FixtureCardHeaderSection 
          fixture={fixture}
          showVenue={showVenue} 
          showCompetition={showCompetition}
        />

        <div className="flex flex-row justify-between w-full bg-red-600">

          <FixtureCardTeamSection
            team={fixture.team}
            score={fixture.team_score}
            fixture={fixture}
            showLogos={showLogos}
          />

          <FixtureCardGameStatusSection
            fixture={fixture}
            hideDate={hideDate}
          />

          <FixtureCardTeamSection
            team={fixture.opposition_team}
            score={fixture.opposition_score}
            fixture={fixture}
            showLogos={showLogos}
          />
        </div>

        {message && (
          <WarningCard>
            <Info className="w-4 h-4" />
            <p className="text-xs truncate">{message}</p>
          </WarningCard>
        )}
      </div>
      <QuickFixtureModal fixture={fixture} showModal={showModal} onClose={toogle} />
    </>
  );
}
