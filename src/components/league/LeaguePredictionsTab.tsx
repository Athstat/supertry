import React, { useState } from 'react';
import { CircleCheck, Info, Sparkles, Calendar } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useAuthUser } from '../../hooks/useAuthUser';
import { BowArrow } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { Percent } from 'lucide-react';
import { useFantasyLeague } from './useFantasyLeague';
import { leaguePredictionsService } from '../../services/leaguePredictionsService';
import LeaguePredictionsLeaderboard from './LeaguePredictionsLeaderboard';
import { format } from 'date-fns';
import TeamLogo from '../team/TeamLogo';
import { twMerge } from 'tailwind-merge';

// Mock fixtures data for the league predictions
const mockFixtures = [
  {
    game_id: '1',
    team_id: 'team1',
    team_name: 'Arsenal',
    team_image_url: 'https://resources.premierleague.com/premierleague/badges/t3.svg',
    opposition_team_id: 'team2',
    opposition_team_name: 'Chelsea',
    opposition_team_image_url: 'https://resources.premierleague.com/premierleague/badges/t8.svg',
    competition_name: 'Premier League',
    kickoff_time: new Date(Date.now() + 86400000),
    venue: 'Emirates Stadium',
    round: 10,
    game_status: 'scheduled',
    team_score: undefined,
    opposition_score: undefined,
  },
  {
    game_id: '2',
    team_id: 'team3',
    team_name: 'Liverpool',
    team_image_url: 'https://resources.premierleague.com/premierleague/badges/t14.svg',
    opposition_team_id: 'team4',
    opposition_team_name: 'Man City',
    opposition_team_image_url: 'https://resources.premierleague.com/premierleague/badges/t43.svg',
    competition_name: 'Premier League',
    kickoff_time: new Date(Date.now() + 172800000),
    venue: 'Anfield',
    round: 10,
    game_status: 'scheduled',
    team_score: undefined,
    opposition_score: undefined,
  },
  {
    game_id: '3',
    team_id: 'team5',
    team_name: 'Man United',
    team_image_url: 'https://resources.premierleague.com/premierleague/badges/t1.svg',
    opposition_team_id: 'team6',
    opposition_team_name: 'Tottenham',
    opposition_team_image_url: 'https://resources.premierleague.com/premierleague/badges/t6.svg',
    competition_name: 'Premier League',
    kickoff_time: new Date(Date.now() - 86400000),
    venue: 'Old Trafford',
    round: 9,
    game_status: 'completed',
    team_score: 2,
    opposition_score: 1,
  },
];

export default function LeaguePredictionsTab() {
  const user = useAuthUser();
  const { league } = useFantasyLeague();

  const uid = (user as any)?.kc_id ?? (user as any)?.id;
  const { data: userRank, isLoading: loadingUserRank } = useFetch(
    `league-predictions-ranking-${league?.id}`,
    [user?.kc_id, league?.id],
    () => leaguePredictionsService.getLeagueUserPredictionsRanking(user.id, league?.id)
  );

  // Group fixtures by day
  const fixturesByDay = {};

  mockFixtures.forEach(fixture => {
    if (fixture.kickoff_time) {
      const dayKey = format(new Date(fixture.kickoff_time), 'yyyy-MM-dd');
      if (!fixturesByDay[dayKey]) {
        fixturesByDay[dayKey] = [];
      }
      fixturesByDay[dayKey].push(fixture);
    }
  });

  // Get sorted day keys
  const sortedDays = Object.keys(fixturesByDay).sort();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2 mb-5">
        <Sparkles />
        <h1 className="text-xl font-bold">League Predictions</h1>
      </div>

      <h1 className="text-lg font-medium">Predictions Summary</h1>

      {loadingUserRank && (
        <div className="w-full h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"></div>
      )}

      {!loadingUserRank && userRank && <UserPredictionsRankCard userRank={userRank} />}

      <div className="bg-yellow-100 dark:bg-yellow-800/40 border text-yellow-700 dark:text-yellow-700 text-sm flex flex-row items-center gap-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
        <div className="w-fit">
          <Info className="" />
        </div>
        Your league predictions summary is based on completed fixtures and doesn't include pending
        or upcoming fixtures.
      </div>

      <h1 className="text-lg font-medium mt-5">Match Predictions</h1>

      <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:border-dark-600">
          <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
            <Calendar size={24} className="text-primary-500" />
            Upcoming Fixtures
          </h2>
        </div>

        <div className="">
          {sortedDays.map(dayKey => (
            <div key={dayKey}>
              {/* Day header */}
              <div className="px-4 py-2 bg-gray-100 dark:bg-dark-800/40 border border-slate-100 dark:border-slate-800 font-medium text-gray-800 dark:text-gray-200">
                {format(new Date(dayKey), 'EEEE, MMMM d, yyyy')}
              </div>

              {/* Fixtures for this day */}
              <div className="divide-y divide-gray-200 dark:divide-slate-800/50 px-3">
                {fixturesByDay[dayKey].map(fixture => (
                  <LeaguePredictionFixtureCard key={fixture.game_id} fixture={fixture} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-lg font-medium mt-5">League Predictions Leaderboard</h1>
      {league && <LeaguePredictionsLeaderboard leagueId={league.id} />}
    </div>
  );
}

function UserPredictionsRankCard({ userRank }) {
  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-800/50 gap-2 rounded-xl border border-slate-100 dark:border-slate-700">
      <div className="flex flex-row items-center gap-2">
        <p className="text-2xl font-semibold">{userRank.first_name}</p>
      </div>

      <div className="flex flex-col text-slate-700 dark:text-slate-300">
        <div className="flex flex-row items-center gap-2 w-fit">
          <BowArrow className="w-4 h-4 text-amber-500" />
          <p>
            <strong>{userRank.predictions_made}</strong> Total Predictions
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 w-fit">
          <CircleCheck className="w-4 h-4 text-amber-500" />
          <p>
            <strong>{userRank.correct_predictions}</strong> Correct Predictions
          </p>
        </div>

        <div className="flex flex-row items-center gap-2 w-fit">
          <XCircle className="w-4 h-4 text-amber-500" />
          <p>
            <strong>{userRank.wrong_predictions}</strong> Wrong Predictions
          </p>
        </div>

        {userRank.predictions_perc && (
          <div className="flex flex-row items-center gap-2 w-fit">
            <Percent className="w-4 h-4 text-amber-500" />
            <p>
              <strong>{Math.floor(userRank.predictions_perc * 100)}%</strong> Accuracy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaguePredictionFixtureCard({ fixture }) {
  const {
    team_score,
    opposition_score,
    team_name,
    opposition_team_name,
    kickoff_time,
    game_status,
  } = fixture;
  const hasScores = team_score !== undefined && opposition_score !== undefined;
  const gameCompleted = game_status === 'completed';
  const hasKickedOff =
    game_status === 'completed' ||
    game_status === 'in_progress' ||
    (kickoff_time && new Date(kickoff_time) < new Date());

  const homeTeamWon = hasScores && team_score > opposition_score;
  const awayTeamWon = hasScores && team_score < opposition_score;

  // User prediction state
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  // Mock vote data
  const [homeVotes, setHomeVotes] = useState([]);
  const [awayVotes, setAwayVotes] = useState([]);

  // Calculate voting percentages
  const totalVotes = homeVotes.length + awayVotes.length;
  const homePerc = totalVotes === 0 ? 0 : homeVotes.length / totalVotes;
  const awayPerc = totalVotes === 0 ? 0 : awayVotes.length / totalVotes;

  const votedHomeTeam = userVote === team_name;
  const votedAwayTeam = userVote === opposition_team_name;
  const hasUserVoted = votedHomeTeam || votedAwayTeam;

  const handleVote = team => {
    if (hasKickedOff) return;

    setIsVoting(true);

    // Mock API call timing
    setTimeout(() => {
      setUserVote(team);

      if (team === team_name) {
        setHomeVotes([...homeVotes, 'user']);
      } else {
        setAwayVotes([...awayVotes, 'user']);
      }

      setIsVoting(false);
    }, 500);
  };

  return (
    <div className="dark:bg-slate-800/40 cursor-pointer bg-white rounded-xl border dark:border-slate-800/60 p-4 my-2">
      <div className="flex flex-row">
        {/* Home Team */}
        <div className="flex-1 flex gap-2 flex-col items-center justify-start">
          <TeamLogo className="lg:w-14 lg:h-14" url={fixture.team_image_url} />
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
          <TeamLogo className="lg:w-14 lg:h-14" url={fixture.opposition_team_image_url || ''} />
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
              onClick={() => handleVote(team_name)}
              className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              {team_name}
            </button>

            <button
              onClick={() => handleVote(opposition_team_name)}
              className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              {opposition_team_name}
            </button>
          </div>
        )}

        {/* After kickoff UI */}
        {hasKickedOff && (
          <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-200">
            <p>{hasScores ? 'Results' : 'Predictions'}</p>

            <button
              className={twMerge(
                'border dark:border-slate-700 w-full px-4 rounded-xl py-2 flex items-center justify-between',
                hasScores
                  ? homeTeamWon
                    ? 'bg-green-200 dark:bg-green-900/40 dark:border-green-900'
                    : awayTeamWon
                      ? 'bg-red-200 dark:bg-red-900/40 dark:border-red-900/60'
                      : 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-slate-200 dark:bg-slate-800'
              )}
            >
              <span className="flex-1 text-left">
                {team_name} Win - {homeVotes.length} Votes
              </span>
              <span className="flex items-center gap-1">
                {votedHomeTeam && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Your Pick
                  </span>
                )}
                {hasScores && homeTeamWon && '✓'}
              </span>
            </button>

            <button
              className={twMerge(
                'border dark:border-slate-700 w-full px-4 rounded-xl py-2 flex items-center justify-between',
                hasScores
                  ? awayTeamWon
                    ? 'bg-green-200 dark:bg-green-900/40 dark:border-green-900'
                    : homeTeamWon
                      ? 'bg-red-200 dark:bg-red-900/40 dark:border-red-900/60'
                      : 'bg-slate-200 dark:bg-slate-800'
                  : 'bg-slate-200 dark:bg-slate-800'
              )}
            >
              <span className="flex-1 text-left">
                {opposition_team_name} Win - {awayVotes.length} Votes
              </span>
              <span className="flex items-center gap-1">
                {votedAwayTeam && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Your Pick
                  </span>
                )}
                {hasScores && awayTeamWon && '✓'}
              </span>
            </button>

            {hasScores && (
              <p className="text-xs mt-1">
                {homeTeamWon
                  ? `${team_name} won ${team_score}-${opposition_score}`
                  : awayTeamWon
                    ? `${opposition_team_name} won ${opposition_score}-${team_score}`
                    : `Match drawn ${team_score}-${opposition_score}`}
              </p>
            )}
          </div>
        )}

        {/* When user has voted but match hasn't started */}
        {hasUserVoted && !hasKickedOff && (
          <div className="flex flex-col w-full gap-2 items-center text-sm justify-center">
            <p className="text-slate-700 dark:text-slate-400">Your prediction</p>

            <button
              onClick={() => handleVote(team_name)}
              className={twMerge(
                'border w-full px-4 rounded-xl py-2 flex items-center justify-between',
                votedHomeTeam
                  ? 'bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800/60'
                  : 'bg-slate-200 dark:bg-slate-800 dark:border-slate-700'
              )}
            >
              <span>{team_name} Win</span>
              {votedHomeTeam && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  Your Pick
                </span>
              )}
            </button>

            <button
              onClick={() => handleVote(opposition_team_name)}
              className={twMerge(
                'border w-full px-4 rounded-xl py-2 flex items-center justify-between',
                votedAwayTeam
                  ? 'bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800/60'
                  : 'bg-slate-200 dark:bg-slate-800 dark:border-slate-700'
              )}
            >
              <span>{opposition_team_name} Win</span>
              {votedAwayTeam && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  Your Pick
                </span>
              )}
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You can change your prediction until kickoff
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
