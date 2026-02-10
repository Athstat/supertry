import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../../types/games';
import { Info } from 'lucide-react';
import WarningCard from '../../ui/cards/WarningCard';
import FixtureCardHeader from './FixtureCardHeader';
import FixtureCardTeam from './FixtureCardTeam';
import FixtureCardGameStatus from './FixtureCardGameStatus';
import { useNavigate } from 'react-router-dom';

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
  fixture, className, showCompetition,
  showLogos, showVenue, message, hideDate,
}: Props) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/fixtures/${fixture.game_id}`);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={twMerge(
          'p-3.5 flex cursor-pointer justify-center flex-col gap-1.5 bg-white shadow-sm border border-slate-300 dark:border-slate-700 text-white hover:bg-slate-50/50  dark:hover:bg-dark-800/50 dark:bg-slate-800/40 transition-colors',
          className
        )}
      >

        <FixtureCardHeader
          fixture={fixture}
          showCompetition={showCompetition}
          showVenue={showVenue}
        />

        <div className="flex flex-row">
          <FixtureCardTeam
            fixture={fixture}
            showLogo={showLogos}
            isHome={true}
          />

          <FixtureCardGameStatus 
            fixture={fixture}
            hideDate={hideDate}
          />

          <FixtureCardTeam
            fixture={fixture}
            showLogo={showLogos}
            isHome={false}
          />
        </div>

        {/* Voting Section */}
        {/* <ProFixtureVotingBox fixture={fixture} /> */}

        {message && (
          <WarningCard>
            <Info className="w-4 h-4" />
            <p className="text-xs truncate">{message}</p>
          </WarningCard>
        )}
      </div>
    </>
  );
}
