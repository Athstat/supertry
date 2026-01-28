import { useAtomValue } from 'jotai';
import { twMerge } from 'tailwind-merge';
import { ScopeProvider } from 'jotai-scope';
import { ISbrFixture } from '../../types/sbr';
import { useNavigate } from 'react-router-dom';
import SbrFixtureCardHeader from './card/SbrFixtureCardHeader';
import SbrFixtureCardTeamSection from './card/SbrFixtureCardTeamSection';
import SbrFixturePredictionBox from './predictions/SbrFixturePredictionBox';
import SbrFixtureDataProvider from '../../providers/SbrFixtureDataProvider';
import SbrFixtureCardStatusSection from './card/SbrFixtureCardStatusSection';
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom } from '../../state/sbrFixtureScreen.atoms';

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
        'dark:bg-slate-800/40 gap-2.5 flex flex-col cursor-pointer bg-[#F4F7F9] rounded-xl border-none dark:border dark:border-slate-700 p-4',
        "shadow-[0px_0px_3px_rgba(0,0,0,0.25)]",
        className
      )}
    >

      <SbrFixtureCardHeader fixture={fixture} showCompetition={showCompetition} />

      <div onClick={handleClick} className="flex flex-row">

        <SbrFixtureCardTeamSection
          fixture={fixture}
          showLogos={showLogos}
        />

        {/* Kick off information */}
        <SbrFixtureCardStatusSection 
          fixture={fixture}
          showKickOffTime={showKickOffTime}
        />

        <SbrFixtureCardTeamSection
          fixture={fixture}
          showLogos={showLogos}
          isAwayTeam
        />

      </div>

      <SbrFixturePredictionBox fixture={fixture} hide={hideVoting} />
    </div>
  );
}
