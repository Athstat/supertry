import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../types/games';
import { format } from 'date-fns';
import { useState } from 'react';
import DialogModal from '../shared/DialogModal';
import TeamLogo from '../team/TeamLogo';
import { useNavigate } from 'react-router-dom';
import { fixtureSumary } from '../../utils/fixtureUtils';
import { Info } from 'lucide-react';
import WarningCard from '../shared/WarningCard';
import { useGameVotes } from '../../hooks/useGameVotes';
import { gamesService } from '../../services/gamesService';
import { mutate } from 'swr';
import { VotingOptionBar } from '../shared/bars/VotingOptionBar';
type Props = {
  fixture: IFixture;
  className?: string;
  showCompetition?: boolean;
  showLogos?: boolean;
  showVenue?: boolean;
  message?: string;
  hideDate?: boolean;
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
  const {
    team_score,
    competition_name,
    kickoff_time,
    round,
    game_status,
    opposition_score,
    venue,
    team_name,
    opposition_team_name,
  } = fixture;

  const matchFinal = game_status === 'completed' && team_score && opposition_score;

  const homeTeamWon = matchFinal ? team_score > opposition_score : false;
  const awayTeamWon = matchFinal ? team_score < opposition_score : false;

  const [showModal, setShowModal] = useState(false);
  const toogle = () => setShowModal(!showModal);

  const { gameKickedOff } = fixtureSumary(fixture);

  // Voting functionality
  const { homeVotes, awayVotes, userVote, isLoading } = useGameVotes(fixture);
  const [isVoting, setIsVoting] = useState(false);

  // Calculate voting percentages
  const totalVotes = homeVotes.length + awayVotes.length;
  const homePerc = totalVotes === 0 ? 0 : Math.round((homeVotes.length / totalVotes) * 100);
  const awayPerc = totalVotes === 0 ? 0 : Math.round((awayVotes.length / totalVotes) * 100);

  const votedHomeTeam = userVote?.vote_for === 'home_team';
  const votedAwayTeam = userVote?.vote_for === 'away_team';
  const hasUserVoted = votedHomeTeam || votedAwayTeam;

  const handleVote = async (voteFor: 'home_team' | 'away_team') => {
    if (gameKickedOff) return;

    setIsVoting(true);

    try {
      if (!userVote) {
        await gamesService.postGameVote(fixture.game_id, voteFor);
      } else {
        await gamesService.putGameVote(fixture.game_id, voteFor);
      }

      // Refresh the votes data
      await mutate(`game-votes-${fixture.game_id}`);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <>
      <div
        onClick={toogle}
        className={twMerge(
          'p-4 flex cursor-pointer flex-col text-white hover:bg-slate-50/50 gap-1 dark:hover:bg-dark-800 transition-colors',
          className
        )}
      >
        {
          <div className="w-full items-center justify-center flex flex-col">
            {showCompetition && competition_name && (
              <p className="text-[10px] lg:text-sm text-gray-600 dark:text-slate-400">
                {competition_name}, Week {round}
              </p>
            )}
            {showVenue && (
              <p className="text-[10px] lg:text-sm text-gray-600 dark:text-slate-400">{venue}</p>
            )}
          </div>
        }

        <div className="flex flex-row">
          <div className="flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center">
            <div className="flex flex-row gap-2 items-center w-full justify-start">
              <div className="flex flex-col gap-4 items-center w-full justify-start">
                {showLogos && <TeamLogo url={fixture.team_image_url} className="w-10 h-10" />}

                <p className={twMerge('text-xs md:text-sm w-fit text-center', awayTeamWon && '')}>
                  {fixture.team_name}
                </p>
              </div>

              {gameKickedOff && fixture.team_score !== null && fixture.opposition_score !== null ? (
                <div
                  className={twMerge(
                    'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
                    homeTeamWon && 'font-bold'
                  )}
                >
                  {fixture.team_score}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex-1 text-slate-700 dark:text-slate-400 flex flex-col items-center text-center justify-center">
            {/* <p className='text-xs' >{fixture.venue}</p> */}
            {!hideDate && kickoff_time && (
              <p className="text-xs">{format(kickoff_time, 'dd, MMM yyyy')}</p>
            )}
            {kickoff_time && (
              <p className="text-sm font-semibold">{format(kickoff_time, 'h:mm a')}</p>
            )}
          </div>

          <div className="flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center">
            <div className="flex flex-row gap-2 items-center w-full justify-start">
              {gameKickedOff && fixture.team_score !== null && fixture.opposition_score !== null ? (
                <div
                  className={twMerge(
                    'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
                    awayTeamWon && 'font-bold'
                  )}
                >
                  {fixture.opposition_score}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 items-center w-full justify-end">
                {showLogos && (
                  <TeamLogo
                    url={fixture.opposition_team_image_url ?? fixture.opposition_image_url}
                    className="w-10 h-10"
                  />
                )}

                <p
                  className={twMerge(
                    'text-xs md:text-sm w-fit text-wrap text-center',
                    awayTeamWon && ''
                  )}
                >
                  {fixture.opposition_team_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <WarningCard>
            <Info className="w-4 h-4" />
            <p className="text-sm truncate">{message}</p>
          </WarningCard>
        )}

        {/* Voting Section */}
        <div
          className={twMerge(
            'flex mt-4 flex-col w-full gap-2 items-center justify-center',
            isVoting && 'animate-pulse opacity-60 cursor-progress'
          )}
          onClick={e => e.stopPropagation()} // Prevent modal from opening when voting
        >
          {/* Voting UI - Before kickoff and before voting */}
          {!hasUserVoted && !gameKickedOff && (
            <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400">
              <p className="text-xs">Who you got winning?</p>
              <div className="flex flex-row gap-2 w-full">
                <button
                  onClick={() => handleVote('home_team')}
                  className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1.5 text-xs hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                  disabled={isVoting}
                >
                  {team_name}
                </button>
                <button
                  onClick={() => handleVote('away_team')}
                  className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1.5 text-xs hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                  disabled={isVoting}
                >
                  {opposition_team_name}
                </button>
              </div>
            </div>
          )}

          {/* Show voting bars after user has voted or after kickoff */}
          {(hasUserVoted || gameKickedOff) && (
            <>
              <VotingOptionBar
                hasUserVoted={votedHomeTeam}
                voteCount={homeVotes.length}
                votePercentage={homePerc}
                title={`${team_name}`}
                onClick={() => handleVote('home_team')}
                isGreen={!!(votedHomeTeam && matchFinal && homeTeamWon)}
                isRed={!!(votedHomeTeam && matchFinal && awayTeamWon)}
                disable={isVoting || gameKickedOff}
              />
              <VotingOptionBar
                hasUserVoted={votedAwayTeam}
                voteCount={awayVotes.length}
                votePercentage={awayPerc}
                title={`${opposition_team_name}`}
                onClick={() => handleVote('away_team')}
                isGreen={!!(votedAwayTeam && matchFinal && awayTeamWon)}
                isRed={!!(votedAwayTeam && matchFinal && homeTeamWon)}
                disable={isVoting || gameKickedOff}
              />
            </>
          )}
        </div>
      </div>
      <FixtureCardModal fixture={fixture} showModal={showModal} onClose={toogle} />
    </>
  );
}

type ModalProps = {
  showModal: boolean;
  onClose: () => void;
  fixture: IFixture;
};

function FixtureCardModal({ onClose, fixture, showModal }: ModalProps) {
  const title = `${fixture.team_name} vs ${fixture.opposition_team_name}`;

  const navigate = useNavigate();

  const { gameKickedOff } = fixtureSumary(fixture);

  const goToFullMatchDetails = () => {
    navigate(`/fixtures/${fixture.game_id}`, { state: fixture });
  };

  return (
    <DialogModal
      onClose={onClose}
      open={showModal}
      title={title}
      className="text-black dark:text-white flex flex-col gap-3"
      hw="lg:w-[50%]"
    >
      <div className="flex p-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 text-xs text-wrap text-center rounded-xl bg-slate-100 dark:bg-slate-800 flex-row items-center justify-center">
        <p>
          {fixture.competition_name} 𐄁 {fixture.venue}
        </p>
      </div>

      <div className="flex flex-row items-center justify-center dark:text-white">
        <div className="flex flex-1 gap-5 flex-col items-center justify-center">
          <TeamLogo className="w-20 h-20" url={fixture.team_image_url} />
          <p className="text-xs md:text-sm lg:text-base dark:text-white text-wrap text-center">
            {fixture.team_name}
          </p>
        </div>

        <div className="flex flex-1 flex-row">
          {!gameKickedOff && <KickOffInformation fixture={fixture} />}
          {gameKickedOff && <MatchResultsInformation fixture={fixture} />}
        </div>

        <div className="flex flex-1 gap-5 flex-col items-center justify-center">
          <TeamLogo
            className="w-20 h-20"
            url={fixture.opposition_team_image_url ?? fixture.opposition_image_url}
          />
          <p className="text-xs md:text-sm lg:text-base dark:text-white text-wrap text-center">
            {fixture.opposition_team_name}
          </p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-center p-3">
        <button
          onClick={goToFullMatchDetails}
          className="underline text-blue-400 dark:text-blue-200 hover:text-blue-500"
        >
          View Full Match Details
        </button>
      </div>
    </DialogModal>
  );
}

function KickOffInformation({ fixture }: Props) {
  const { kickoff_time } = fixture;

  return (
    <div className="flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center">
      {kickoff_time && <p className="font-medium text-sm">{format(kickoff_time, 'h:mm a')}</p>}
      {kickoff_time && (
        <p className="dark:text-slate-300 text-sm text-slate-800">
          {format(kickoff_time, 'dd MMM yyyy')}
        </p>
      )}
    </div>
  );
}

function MatchResultsInformation({ fixture }: Props) {
  const { kickoff_time, game_status } = fixture;

  return (
    <div className="flex  flex-1 w-full flex-col items-center justify-center">
      <div>
        {game_status && (
          <span className="text-sm text-slate-500 font-medium dark:text-slate-400">
            {game_status === 'completed' && 'Final'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-row gap-2 items-center justify-center">
        {/* Home Team Score */}
        <div className="dark:text-white flex-1 text-2xl font-medium flex items-center justify-center">
          <p>{fixture.team_score}</p>
        </div>

        <div className="flex flex-1 flex-col dark:text-white text-center items-center justify-center">
          <p>-</p>
        </div>

        {/* Away Team Score */}
        <div className="dark:text-white  text-wrap flex-1 text-2xl font-medium flex items-center justify-center">
          <p>{fixture.opposition_score}</p>
        </div>
      </div>

      <div>
        {kickoff_time && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {format(kickoff_time, 'h:mm a')}
          </span>
        )}
      </div>
    </div>
  );
}
