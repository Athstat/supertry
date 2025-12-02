import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardTeamCheck } from '../../hooks/dashboard/useDashboardTeamCheck';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import RoundedCard from '../shared/RoundedCard';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { useMemo } from 'react';
import { abbreviateSeasonName } from '../players/compare/PlayerCompareSeasonPicker';
import { formatCountdown } from '../../utils/countdown';

type Props = {
  season?: IFantasySeason;
};

export default function DashboardHero({ season }: Props) {
  const { authUser } = useAuth();
  const {
    hasTeam,
    isLoading,
    leagueGroupId,
    currentRoundId,
    currentGameweek,
    nextDeadline,
    userStats,
  } = useDashboardTeamCheck(season);
  const navigate = useNavigate();

  const teamUrl = useMemo(() => {
    if (!leagueGroupId) return '/leagues';
    const url = `/league/${leagueGroupId}`;
    const params = new URLSearchParams();
    if (currentRoundId) {
      params.append('round_filter', currentRoundId);
    }
    params.append('tab', 'my-team');
    return `${url}?${params.toString()}`;
  }, [leagueGroupId, currentRoundId]);

  if (isLoading) {
    return (
      <RoundedCard className="p-6 animate-pulse bg-gray-200 dark:bg-gray-800">
        <div className="h-48"></div>
      </RoundedCard>
    );
  }

  if (!season) {
    return null;
  }

  if (hasTeam && userStats) {
    return (
      <TeamExistsView
        season={season}
        userStats={userStats}
        teamUrl={teamUrl}
        currentGameweek={currentGameweek}
        nextDeadline={nextDeadline}
      />
    );
  }

  return (
    <FirstTimeUserView
      season={season}
      currentGameweek={currentGameweek}
      nextDeadline={nextDeadline}
      username={authUser?.username}
      teamUrl={teamUrl}
    />
  );
}

type TeamExistsViewProps = {
  season: IFantasySeason;
  userStats: {
    rank: number;
    totalPoints: number;
    localRankPercentile: number;
  };
  teamUrl: string;
  currentGameweek?: number;
  nextDeadline?: Date;
};

function TeamExistsView({
  season,
  userStats,
  teamUrl,
  currentGameweek,
  nextDeadline,
}: TeamExistsViewProps) {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  return (
    <RoundedCard className="p-6 flex flex-col gap-4">
      {/* Username */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        <p className="font-medium">{authUser?.username || 'User'}</p>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-center">
        {abbreviateSeasonName(season.name)} Challenge
      </h1>

      {/* Stats Circles */}
      <div className="flex justify-around items-center py-4">
        {/* Local Rank */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="font-bold text-lg">{userStats.localRankPercentile}%</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">local rank</p>
        </div>

        {/* Points */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <div className="text-center">
              <p className="font-bold text-xl">{userStats.totalPoints}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">points</p>
          <p className="text-md font-bold text-gray-600 dark:text-gray-500">
            Gameweek {currentGameweek || '—'}
          </p>
        </div>

        {/* Global Rank */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <span className="font-bold text-lg">#{userStats.rank}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">global rank</p>
        </div>
      </div>

      {/* Gameweek Countdown */}
      {/* {currentGameweek && nextDeadline && (
        <div className="text-center">
          <p className="text-sm">
            <span className="font-semibold">Gameweek {currentGameweek + 1}</span> opens in{' '}
            <span className="font-semibold">{formatCountdown(nextDeadline)}</span>
          </p>
        </div>
      )} */}

      <div className="flex justify-center">
        {/* Manage Team Button */}
        <PrimaryButton className="w-fit flex-shrink-0" onClick={() => navigate(teamUrl)}>
          Manage my team
        </PrimaryButton>
      </div>
    </RoundedCard>
  );
}

type FirstTimeUserViewProps = {
  season: IFantasySeason;
  currentGameweek?: number;
  nextDeadline?: Date;
  username?: string;
  teamUrl: string;
};

function FirstTimeUserView({
  season,
  currentGameweek,
  nextDeadline,
  username,
  teamUrl,
}: FirstTimeUserViewProps) {
  const navigate = useNavigate();

  // Check if the gameweek is still open (before deadline)
  // Convert nextDeadline to Date object if it's a string
  const isGameweekOpen = nextDeadline ? new Date() < new Date(nextDeadline) : true;

  // Debug logging
  console.log('FirstTimeUserView - nextDeadline:', nextDeadline);
  console.log('FirstTimeUserView - isGameweekOpen:', isGameweekOpen);

  return (
    <RoundedCard className="p-6 flex flex-col gap-4">
      {/* Welcome Message */}
      <div className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
        <p className="text-lg">
          Welcome, <span className="font-medium">{username || 'User'}</span>
        </p>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-center">
        Play SCRUMMY fantasy: {season.name} Challenge
      </h1>

      {/* Gameweek Countdown */}
      {currentGameweek && nextDeadline && (
        <div className="text-center py-4">
          <p className="text-lg">
            <span className="font-semibold">Gameweek {currentGameweek}</span> ends in
          </p>
          <p className="text-2xl font-bold mt-2">{formatCountdown(nextDeadline)}</p>
        </div>
      )}

      {/* Call to Action */}
      <p className="text-center text-gray-700 dark:text-gray-300">
        Pick your elite team now and start competing!
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/#')}
          className="flex-1 px-4 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
        >
          How to play?
        </button>
        <PrimaryButton
          className={`flex-1 w-fit flex-shrink-0 ${!isGameweekOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => isGameweekOpen && navigate(teamUrl)}
          disabled={!isGameweekOpen}
        >
          Pick a team
        </PrimaryButton>
      </div>
    </RoundedCard>
  );
}
