import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../../types/games';
import { format } from 'date-fns';
import { useState } from 'react';
import TeamLogo from '../../team/TeamLogo';
import { fixtureSummary, isGameLive, formatGameStatus } from '../../../utils/fixtureUtils';
import { Info } from 'lucide-react';
import WarningCard from '../../ui/cards/WarningCard';
import { analytics } from '../../../services/analytics/anayticsService';
import { useLiveFixture } from '../../../hooks/fixtures/useLiveFixture';
import { useLiveGameClock } from '../../../hooks/fixtures/useLiveGameClock';
import { abbreviateSeasonName } from '../../../utils/stringUtils';
import { IProTeam } from '../../../types/team';
import { QuickFixtureModal } from '../QuickFixtureModal';
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
  // Use live fixture polling hook
  const { liveFixture } = useLiveFixture({ fixture });

  // Use the live fixture data if available, otherwise use prop fixture
  const displayFixture = liveFixture || fixture;

  const {
    competition_name,
    venue,
  } = displayFixture;

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
        {
          <div className="w-full text-gray-600 items-center justify-center flex flex-col">
            {showCompetition && competition_name && fixture.round && venue && (
              <div className='flex flex-row items-center justify-center gap-1 text-[10px] lg:text-sm text-[#1F396F]  dark:text-slate-400' >
                <p>{abbreviateSeasonName(competition_name)}</p>
                <p className='text-xs' >|</p>
                <p>Round {fixture.round}</p>
                <p className='text-xs' >|</p>
                <p>{venue}</p>
              </div>
            )}
            {showVenue && (
              <p className="text-[10px] lg:text-sm text-gray-600 dark:text-slate-400">{venue}</p>
            )}
          </div>
        }

        <div className="flex flex-row justify-between w-full bg-red-600">

          <TeamLogoAndScore
            team={fixture.team}
            score={fixture.team_score}
            fixture={fixture}
            showLogos={showLogos}
          />

          <FixtureKickoffTimeSection 
            fixture={fixture}
            hideDate={hideDate}
          />

          <TeamLogoAndScore
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

type TeamLogoAndScoreProps = {
  team?: IProTeam,
  score?: number,
  fixture: IFixture,
  showLogos?: boolean
}

function TeamLogoAndScore({ team, score, fixture, showLogos }: TeamLogoAndScoreProps) {


  const {
    team_score,
    game_status,
    opposition_score,
  } = fixture;

  const matchFinal = game_status === 'completed' && team_score && opposition_score;

  const homeTeamWon = matchFinal ? team_score > opposition_score : false;
  const awayTeamWon = matchFinal ? team_score < opposition_score : false;

  const { gameKickedOff } = fixtureSummary(fixture);
  const showGameScore = gameKickedOff && fixture.team_score !== null && fixture.opposition_score !== null;

  const isAway = team?.athstat_id === fixture.opposition_team?.athstat_id;


  return (
    <div className="flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center">

      <div className="flex flex-row gap-2 items-center w-full justify-start">

        {isAway && showGameScore ? (
          <div
            className={twMerge(
              'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
              homeTeamWon && 'font-bold'
            )}
          >
            {score}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 items-center w-full justify-start">
          {showLogos && (
            <TeamLogo
              url={team?.image_url}
              teamName={team?.athstat_name}
              className="w-10 h-10"
            />
          )}

          <p className={twMerge('text-xs md:text-sm w-fit text-center', awayTeamWon && '')}>
            {team?.athstat_name}
          </p>
        </div>

        {!isAway && showGameScore ? (
          <div
            className={twMerge(
              'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
              homeTeamWon && 'font-bold'
            )}
          >
            {score}
          </div>
        ) : null}
      </div>

    </div>
  )
}

type KickoffSectionProps = {
  fixture: IFixture,
  hideDate?: boolean
}

function FixtureKickoffTimeSection({fixture, hideDate} : KickoffSectionProps) {
  // Use live fixture polling hook
  const { liveFixture } = useLiveFixture({ fixture });

  // Use the live fixture data if available, otherwise use prop fixture
  const displayFixture = liveFixture || fixture;

  // Use live game clock hook
  const liveGameClock = useLiveGameClock({
    gameStatus: displayFixture.game_status,
    serverGameClock: displayFixture.game_clock,
  });

  const {
    kickoff_time,
    game_status,
  } = displayFixture;

  return (
    <div className="flex-1 text-slate-700 dark:text-slate-400 flex flex-col items-center text-center justify-center">
      {/* <p className='text-xs' >{fixture.venue}</p> */}

      {kickoff_time && (
        <p className="text-[16px] font-medium">{format(kickoff_time, 'HH:mm ')}</p>
      )}

      {!hideDate && kickoff_time && (
        <p className="text-[10px]">{format(kickoff_time, 'EEE, dd MMM ')}</p>
      )}


      {isGameLive(game_status) && (
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex flex-row items-center gap-1">
            <div className="w-2 h-2 bg-green-500 animate-pulse dark:bg-green-400 rounded-full " />
            <span className="text-sm text-green-600 dark:text-green-400 font-bold">
              {formatGameStatus(game_status)}
            </span>
          </div>
          {liveGameClock && (
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
              {liveGameClock}
            </span>
          )}
        </div>
      )}
    </div>
  )
}