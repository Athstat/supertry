import { useNavigate } from 'react-router-dom';
import { ISbrFixture } from '../../../../types/sbr';
import { twMerge } from 'tailwind-merge';
import SbrFixturePredictionBox from '../../predictions/SbrFixturePredictionBox';
import { useAtomValue } from 'jotai';
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom } from '../../../../state/sbrFixtureScreen.atoms';
import { ScopeProvider } from 'jotai-scope';
import SbrFixtureStatsStatusCard from '../../card/SbrFixtureStatsStatusCard';
import SbrFixtureDataProvider from '../../../../providers/SbrFixtureDataProvider';
import SbrFixtureCardTeam from './SbrFixtureCardTeam';
import SbrFixtureGameStatus from './SbrFixtureGameStatus';

type Props = {
  fixture: ISbrFixture;
  showLogos?: boolean;
  showCompetition?: boolean;
  className?: string;
  showKickOffTime?: boolean;
  hideVoting?: boolean;
};

export default function SbrFixtureCard({
  fixture,
  showLogos,
  showCompetition,
  className,
  hideVoting,
  showKickOffTime,
}: Props) {
  const atoms = [sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <SbrFixtureDataProvider fixture={fixture}>
        <SbrFixtureCardContent
          showCompetition={showCompetition}
          showKickOffTime={showKickOffTime}
          showLogos={showLogos}
          className={className}
          hideVoting={hideVoting}
        />
      </SbrFixtureDataProvider>
    </ScopeProvider>
  );
}

type ContentProps = {
  showLogos?: boolean;
  showCompetition?: boolean;
  className?: string;
  showKickOffTime?: boolean;
  hideVoting?: boolean;
};

function SbrFixtureCardContent({
  showCompetition,
  showLogos,
  hideVoting,
  className,
  showKickOffTime,
}: ContentProps) {
  
  const navigate = useNavigate();
  const fixture = useAtomValue(sbrFixtureAtom);

  if (!fixture) return;

  const handleClick = () => {
    navigate(`/sbr/fixtures/${fixture.fixture_id}`);
  };

  return (
    <div
      // onClick={handleClick}
      className={twMerge(
        'dark:bg-slate-800/40 gap-2.5 flex flex-col cursor-pointer bg-white rounded-xl border dark:border-slate-700 p-4',
        className
      )}
    >
      <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400">
        {showCompetition && fixture.season && <p className="text-[10px]">{fixture.season}</p>}
      </div>

      <SbrFixtureStatsStatusCard fixture={fixture} />

      <div onClick={handleClick} className="flex flex-row">
        {/* Home Team */}

        <SbrFixtureCardTeam
          fixture={fixture}
          isHome
          showLogos={showLogos}
        />

        {/* Kick off information */}
        <SbrFixtureGameStatus 
          fixture={fixture}
          showKickOffTime={showKickOffTime}
        />

        {/* Away Team */}

        <SbrFixtureCardTeam
          fixture={fixture}
          isHome={false}
          showLogos={showLogos}
        />
      </div>

      <SbrFixturePredictionBox fixture={fixture} hide={hideVoting} />
    </div>
  );
}
