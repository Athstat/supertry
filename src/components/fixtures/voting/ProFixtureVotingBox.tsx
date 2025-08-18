import { twMerge } from 'tailwind-merge';
import { VotingOptionsResults, VotingOptionBar } from '../../shared/bars/VotingOptionBar';
import { useState } from 'react';
import { mutate } from 'swr';
import { useGameVotes } from '../../../hooks/useGameVotes';
import { gamesService } from '../../../services/gamesService';
import { fixtureSumary, isProGameTBD } from '../../../utils/fixtureUtils';
import { IFixture } from '../../../types/games';
import { useInView } from 'react-intersection-observer';

type Props = {
  fixture: IFixture;
  className?: string;
};

export default function ProFixtureVotingBox({ fixture, className }: Props) {
  const { team_score, game_status, opposition_score, team, opposition_team } = fixture;

  const team_name = team.athstat_name;
  const opposition_team_name = opposition_team.athstat_name;

  const matchFinal = game_status === 'completed' && team_score && opposition_score;

  const homeTeamWon = matchFinal ? team_score > opposition_score : false;
  const awayTeamWon = matchFinal ? team_score < opposition_score : false;

  const { gameKickedOff } = fixtureSumary(fixture);

  // Voting functionality
  const { ref, inView } = useInView({ triggerOnce: true });
  const { homeVotes, awayVotes, userVote, isLoading } = useGameVotes(fixture, inView);
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

  const isTbdGame = isProGameTBD(fixture);

  if (isTbdGame) return;

  if (isLoading)
    return (
      <div className="w-full min-h-24 mt-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-pulse"></div>
    );

  return (
    <div
      ref={ref}
      className={twMerge(
        'flex mt-4 flex-col w-full gap-1 items-center justify-center',
        isVoting && 'animate-pulse opacity-60 cursor-progress',
        className
      )}
      onClick={e => e.stopPropagation()} // Prevent modal from opening when voting
    >
      {/* Voting UI - Before kickoff and before voting */}
      {!hasUserVoted && !gameKickedOff && (
        <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400">
          <p className="text-xs">Who you got winning?</p>
          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={() => handleVote('home_team')}
              className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1 text-[10px] hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              disabled={isVoting}
            >
              {team_name}
            </button>
            <button
              onClick={() => handleVote('away_team')}
              className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1 text-[10px] hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              disabled={isVoting}
            >
              {opposition_team_name}
            </button>
          </div>
        </div>
      )}

      {gameKickedOff && (
        <VotingOptionsResults
          homeTeam={fixture.team.athstat_name}
          awayTeam={fixture.opposition_team.athstat_name}
          hasScores={fixture.game_status === 'completed'}
          homeTeamWon={homeTeamWon}
          awayTeamWon={awayTeamWon}
          homeScore={fixture.team_score}
          awayScore={fixture.opposition_score}
          votedAwayTeam={votedAwayTeam}
          votedHomeTeam={votedHomeTeam}
          homeVotes={homeVotes.length}
          awayVotes={awayVotes.length}
        />
      )}

      {/* Show voting bars after user has voted or after kickoff */}
      {hasUserVoted && !gameKickedOff && (
        <div className="flex flex-col w-full">
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
        </div>
      )}
    </div>
  );
}
