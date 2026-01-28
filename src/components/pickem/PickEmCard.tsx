import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../types/fixtures';
import { format } from 'date-fns';
import { useState } from 'react';
import TeamLogo from '../team/TeamLogo';
import { fixtureSummary } from '../../utils/fixtureUtils';
import { useGameVotes } from '../../hooks/useGameVotes';
import { gamesService } from '../../services/gamesService';
import ConsensusBar from './ConsensusBar';
import { Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import PickEmCardSkeleton from './PickEmCardSkeleton';

type Props = {
  fixture: IFixture;
  className?: string;
};

export default function PickEmCard({ fixture, className }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { userVote, percentages, homeVotes, awayVotes, drawVotes, isLoading, mutate } = useGameVotes(
    fixture,
    inView
  );
  const [isVoting, setIsVoting] = useState(false);
  const [clickedButton, setClickedButton] = useState<'home_team' | 'away_team' | 'draw' | null>(
    null
  );

  const { gameKickedOff } = fixtureSummary(fixture);
  const isLocked = gameKickedOff;

  const votedHomeTeam = userVote?.vote_for === 'home_team';
  const votedDraw = userVote?.vote_for === 'draw';
  const votedAwayTeam = userVote?.vote_for === 'away_team';

  const handleVote = async (voteFor: 'home_team' | 'away_team' | 'draw') => {
    if (isLocked || isVoting) return;

    setIsVoting(true);
    setClickedButton(voteFor);

    try {
      if (!userVote) {
        await gamesService.postGameVote(fixture.game_id, voteFor);
      } else {
        await gamesService.putGameVote(fixture.game_id, voteFor);
      }

      // Refresh the votes data
      await mutate();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
      setClickedButton(null);
    }
  };

  if (isLoading) {
    return <PickEmCardSkeleton ref={ref} className={className} />;
  }

  return (
    <div
      ref={ref}
      className={twMerge(
        'p-4 flex flex-col bg-white shadow-md border border-slate-300 dark:border-slate-700 gap-3 dark:bg-slate-800/50 transition-all duration-200',
        !isLocked && 'hover:shadow-lg',
        isLocked && 'opacity-70',
        className
      )}
    >
      {/* Header - Competition and Date */}
      <div className="w-full items-center justify-center flex flex-col gap-0.5">
        {fixture.competition_name && (
          <p className="text-[10px] text-slate-500 dark:text-slate-500">
            {fixture.competition_name}
            {fixture.round !== null ? `, Week ${fixture.round}` : ''}
          </p>
        )}
        {fixture.kickoff_time && (
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {format(fixture.kickoff_time, 'EEE, dd MMM')} • {format(fixture.kickoff_time, 'h:mm a')}
          </p>
        )}
      </div>

      {/* Locked Badge */}
      {isLocked && (
        <div className="w-full flex items-center justify-center">
          <span className="px-3 py-1 text-[10px] font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
            LOCKED
          </span>
        </div>
      )}

      {/* Interactive Prediction Row */}
      <div className="grid grid-cols-3 items-center gap-2">
        {/* Home Team */}
        <button
          onClick={() => handleVote('home_team')}
          disabled={isLocked || isVoting}
          className={twMerge(
            'flex flex-col items-center gap-3 p-3 rounded-xl transition-all duration-200 max-w-[120px] justify-self-start',
            !isLocked &&
              'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
            votedHomeTeam &&
              !isLocked &&
              'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 shadow-lg',
            (isLocked || isVoting) && 'cursor-not-allowed opacity-60'
          )}
        >
          <div className="relative">
            {clickedButton === 'home_team' && isVoting ? (
              <div className="w-14 h-14 flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <TeamLogo
                url={fixture?.team?.image_url}
                teamName={fixture?.team?.athstat_name}
                className={twMerge(
                  'w-14 h-14 transition-transform duration-200',
                  votedHomeTeam && !isLocked && 'scale-110'
                )}
              />
            )}
          </div>
          <p className="text-xs text-center font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
            {fixture?.team?.athstat_name}
          </p>
        </button>

        {/* Draw Button */}
        <button
          onClick={() => handleVote('draw')}
          disabled={isLocked || isVoting}
          className={twMerge(
            'flex flex-col items-center gap-2 px-4 py-3 rounded-full transition-all duration-200 max-w-[100px] justify-self-center',
            !isLocked &&
              'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
            votedDraw &&
              !isLocked &&
              'bg-slate-200 dark:bg-slate-600 ring-2 ring-slate-500 shadow-lg',
            (isLocked || isVoting) && 'cursor-not-allowed opacity-60',
            'border-2 border-slate-300 dark:border-slate-600'
          )}
        >
          <div className="relative">
            {clickedButton === 'draw' && isVoting ? (
              <Loader className="w-5 h-5 animate-spin text-slate-600 dark:text-slate-300" />
            ) : (
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">DRAW</span>
            )}
          </div>
        </button>

        {/* Away Team */}
        <button
          onClick={() => handleVote('away_team')}
          disabled={isLocked || isVoting}
          className={twMerge(
            'flex flex-col items-center gap-3 p-3 rounded-xl transition-all duration-200 max-w-[120px] justify-self-end',
            !isLocked &&
              'hover:bg-slate-100 dark:hover:bg-slate-700/50 active:scale-95 cursor-pointer',
            votedAwayTeam &&
              !isLocked &&
              'bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500 shadow-lg',
            (isLocked || isVoting) && 'cursor-not-allowed opacity-60'
          )}
        >
          <div className="relative">
            {clickedButton === 'away_team' && isVoting ? (
              <div className="w-14 h-14 flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : (
              <TeamLogo
                url={fixture?.opposition_team?.image_url}
                teamName={fixture?.opposition_team?.athstat_name}
                className={twMerge(
                  'w-14 h-14 transition-transform duration-200',
                  votedAwayTeam && !isLocked && 'scale-110'
                )}
              />
            )}
          </div>
          <p className="text-xs text-center font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
            {fixture?.opposition_team?.athstat_name}
          </p>
        </button>
      </div>

      {/* Total Votes Display */}
      <div className="w-full flex items-center justify-center">
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Total votes:{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {homeVotes.length + awayVotes.length + drawVotes.length}
          </span>
        </p>
      </div>

      {/* Consensus Bar */}
      <ConsensusBar
        homePercentage={percentages.home}
        drawPercentage={percentages.draw}
        awayPercentage={percentages.away}
        homeTeamName={fixture?.team?.athstat_name || 'Home'}
        awayTeamName={fixture?.opposition_team?.athstat_name || 'Away'}
      />
    </div>
  );
}
