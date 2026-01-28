import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../../types/fixtures';
import { useState } from 'react';
import { fixtureSummary } from '../../../utils/fixtureUtils';
import { useGameVotes } from '../../../hooks/useGameVotes';
import { gamesService } from '../../../services/gamesService';
import ConsensusBar from '../ConsensusBar';
import { Loader } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import PickEmCardSkeleton from '../PickEmCardSkeleton';
import PickemCardHeader from './PickemCardHeader';
import PickemCardTeamOption from './PickemCardTeamOption';

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

  const votedDraw = userVote?.vote_for === 'draw';

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
      <PickemCardHeader fixture={fixture} />

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
        <PickemCardTeamOption
          team={fixture.team}
          fixture={fixture}
          fetchGameVotes={inView}
        />

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
        <PickemCardTeamOption
          team={fixture.opposition_team}
          fixture={fixture}
          fetchGameVotes={inView}
        />
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
