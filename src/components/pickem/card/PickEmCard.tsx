import { twMerge } from 'tailwind-merge';
import { IFixture } from '../../../types/fixtures';
import { useState } from 'react';
import { fixtureSummary } from '../../../utils/fixtureUtils';
import { useGameVotes } from '../../../hooks/useGameVotes';
import { gamesService } from '../../../services/gamesService';
import { useInView } from 'react-intersection-observer';
import PickEmCardSkeleton from '../PickEmCardSkeleton';
import PickemCardHeader from './PickemCardHeader';
import PickemCardTeamOption from './PickemCardTeamOption';
import PickemCardDrawOption from './PickemCardDrawOption';

type Props = {
  fixture: IFixture;
  className?: string;
};

export default function PickEmCard({ fixture, className }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { userVote, homeVotes, awayVotes, drawVotes, isLoading, mutate } = useGameVotes(
    fixture,
    inView
  );
  const [isVoting, setIsVoting] = useState(false);
  const [clickedButton, setClickedButton] = useState<'home_team' | 'away_team' | 'draw' | null>(null);

  const { gameKickedOff } = fixtureSummary(fixture);
  const isLocked = gameKickedOff;

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

  const disabled = isLocked || isVoting;

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
          onVote={handleVote}
          isVoting={isVoting}
          disabled={disabled}
          clickedButton={clickedButton}
        />

        {/* Draw Button */}
        <PickemCardDrawOption
          fixture={fixture}
          onVote={handleVote}
          isVoting={isVoting}
          disabled={disabled}
          clickedButton={clickedButton}
        />

        {/* Away Team */}
        <PickemCardTeamOption
          team={fixture.opposition_team}
          fixture={fixture}
          fetchGameVotes={inView}
          onVote={handleVote}
          isVoting={isVoting}
          disabled={disabled}
          clickedButton={clickedButton}
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

    </div>
  );
}
