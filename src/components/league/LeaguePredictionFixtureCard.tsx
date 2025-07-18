import React, { useState, Fragment } from 'react';
import TeamLogo from '../team/TeamLogo';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { IFixture } from '../../types/games';
import { VotingOptionBar } from '../shared/bars/VotingOptionBar';
import { useGameVotes } from '../../hooks/useGameVotes';
import { gamesService } from '../../services/gamesService';
import { mutate } from 'swr';

type Props = {
  fixture: IFixture;
};

export default function LeaguePredictionFixtureCard({ fixture }: Props) {
  const {
    team_score,
    opposition_score,
    team_name,
    opposition_team_name,
    kickoff_time,
    game_status,
    team_image_url,
    opposition_team_image_url,
  } = fixture;
  const hasScores = team_score !== undefined && opposition_score !== undefined;
  const gameCompleted = game_status === 'completed';
  const hasKickedOff =
    game_status === 'completed' ||
    game_status === 'in_progress' ||
    (kickoff_time && new Date(kickoff_time) < new Date());

  const homeTeamWon = hasScores && team_score > opposition_score;
  const awayTeamWon = hasScores && team_score < opposition_score;

  // Use the real voting hook
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
    if (hasKickedOff) return;

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
    <div className="dark:bg-slate-800/40 cursor-pointer bg-white rounded-xl border dark:border-slate-800/60 p-4 my-2">
      <div className="flex flex-row">
        {/* Home Team */}
        <div className="flex-1 flex gap-2 flex-col items-center justify-start">
          <TeamLogo className="lg:w-14 lg:h-14" url={team_image_url} />
          <p className="text-xs lg-text-sm truncate text-wrap text-center">{team_name}</p>
          <p className="text-slate-700 dark:text-slate-400">
            {gameCompleted && team_score ? team_score : '-'}
          </p>
        </div>
        {/* Middle info */}
        <div className="flex-1 flex flex-col items-center justify-center dark:text-slate-400 text-slate-700">
          {!hasScores && game_status !== 'completed' && <p className="text-sm">VS</p>}
          {kickoff_time && <p className="text-xs">{format(new Date(kickoff_time), 'h:mm a')}</p>}
          {gameCompleted && (
            <div className="flex w-full flex-row items-center justify-center gap-1">
              <div>Final</div>
            </div>
          )}
        </div>
        {/* Away Team */}
        <div className="flex-1 flex w-1/3 gap-2 flex-col items-center justify-end">
          <TeamLogo className="lg:w-14 lg:h-14" url={opposition_team_image_url || ''} />
          <p className="text-xs lg-text-sm truncate text-wrap text-center">
            {opposition_team_name}
          </p>
          <p className="text-slate-700 dark:text-slate-400">
            {gameCompleted && opposition_score ? opposition_score : '-'}
          </p>
        </div>
      </div>
      <div
        className={twMerge(
          'flex mt-6 flex-col w-full gap-0 items-center justify-center',
          isVoting && 'animate-pulse opacity-60 cursor-progress'
        )}
      >
        {/* Voting UI - Before kickoff and before voting */}
        {!hasUserVoted && !hasKickedOff && (
          <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400">
            <p>Who you got winning?</p>
            <button
              onClick={() => handleVote('home_team')}
              className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              {team_name}
            </button>
            <button
              onClick={() => handleVote('away_team')}
              className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              {opposition_team_name}
            </button>
          </div>
        )}
        {/* Show voting bars after user has voted or after kickoff */}
        {(hasUserVoted || hasKickedOff) && (
          <Fragment>
            <VotingOptionBar
              hasUserVoted={votedHomeTeam}
              voteCount={homeVotes.length}
              votePercentage={homePerc}
              title={`${team_name} Win`}
              onClick={() => handleVote('home_team')}
              isGreen={votedHomeTeam && gameCompleted && homeTeamWon}
              isRed={votedHomeTeam && gameCompleted && awayTeamWon}
              disable={isVoting}
            />
            <VotingOptionBar
              hasUserVoted={votedAwayTeam}
              voteCount={awayVotes.length}
              votePercentage={awayPerc}
              title={`${opposition_team_name} Win`}
              onClick={() => handleVote('away_team')}
              isGreen={votedAwayTeam && gameCompleted && awayTeamWon}
              isRed={votedAwayTeam && gameCompleted && homeTeamWon}
              disable={isVoting}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
}
