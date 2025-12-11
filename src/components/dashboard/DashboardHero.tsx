import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardTeamCheck } from '../../hooks/dashboard/useDashboardTeamCheck';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import RoundedCard from '../shared/RoundedCard';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { useMemo, useState } from 'react';
import { abbreviateSeasonName } from '../players/compare/PlayerCompareSeasonPicker';
import { formatCountdown } from '../../utils/countdown';
import ScrummyGamePlayModal from '../branding/help/ScrummyGamePlayModal';
import { Globe, Trophy, Users, ArrowUp } from 'lucide-react';

type Props = {
  season?: IFantasySeason;
};

export default function DashboardHero({ season }: Props) {
  const { authUser } = useAuth();
  const { hasTeam, isLoading, leagueGroupId, currentRoundId, currentGameweek, nextDeadline, userStats } =
    useDashboardTeamCheck(season);
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

function TeamExistsView({ season, userStats, teamUrl, currentGameweek, nextDeadline }: TeamExistsViewProps) {
  const navigate = useNavigate();
  const { authUser } = useAuth();

  return (
    <div className="relative w-full overflow-hidden shadow-md">
      {/* Blue Gradient Background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: 'linear-gradient(47deg, #1196F5 0%, #011E5C 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 py-6 px-2">
        {/* Username Header */}
        <div className="flex items-center gap-2">
          <div className="text-2xl">👤</div>
          <p className="text-white font-normal text-base">{authUser?.username || 'User'}</p>
        </div>

        {/* Title */}
        <h1
          className="text-center font-normal text-base leading-6 text-white"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          PLAY URC FANTASY
          <br />
          {abbreviateSeasonName(season.name).toUpperCase()} CHALLENGE
        </h1>

        {/* Stats Card with Internal Border and Round */}
        <div
          className="w-full max-w-sm bg-[#011E5C]/80 rounded-lg pt-4 pb-2 flex flex-col gap-3"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          {/* Top: Stats Row */}
          <div className="flex items-end gap-4">
            {/* Global Rank */}
            <div className="flex-1 flex flex-col items-center gap-1.5" style={{ marginBottom: -10 }}>
              <Globe className="w-6 h-6 text-white" />
              <p className="text-lg font-medium text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                #{userStats.rank}<span className="text-xs text-white">/1653</span>
              </p>
            </div>

            {/* Points (Center - Larger & Elevated) */}
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <Trophy className="w-6 h-6 text-white" />
              <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'Oswald, sans-serif', marginBottom: -5 }}>
                {userStats.totalPoints}
              </p>
              <p className="text-xs text-white" style={{ marginBottom: -5 }}>points</p>
            </div>

            {/* League Rank */}
            <div className="flex-1 flex flex-col items-center gap-1.5" style={{ marginBottom: -10 }}>
              <Users className="w-6 h-6 text-white" />
              <p className="text-lg font-medium text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                #{userStats.localRankPercentile}<span className="text-xs text-white">/16</span>
              </p>
            </div>
          </div>

          {/* Labels Row with Inline Border */}
          <div className="flex items-center">
            {/* Left Label - matches left stat column width */}
            <div className="flex-1 flex justify-center">
              <p className="text-xs text-[#E2E8F0]">global rank</p>
            </div>

            {/* Center: Border Line - matches center stat column width */}
            <div className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-[130%] border-t border-[#1196F5]"></div>
            </div>

            {/* Right Label - matches right stat column width */}
            <div className="flex-1 flex justify-center">
              <p className="text-xs text-white">league rank</p>
            </div>
          </div>

          {/* Round Indicator (inside card) */}
          <p className="text-sm font-semibold text-[#1196F5] text-center -mt-4">
            Round {currentGameweek || '—'}
          </p>
        </div>

        {/* Deadline */}
        {nextDeadline && (
          <>
            <div className="w-full max-w-sm border-t border-white/50"></div>
            <p className="text-sm text-white text-center">
              Round {(currentGameweek || 0) + 1} Deadline:{' '}
              <span className="font-bold">{formatCountdown(nextDeadline)}</span>
            </p>
          </>
        )}

        {/* Manage Team Button */}
        <button
          onClick={() => navigate(teamUrl)}
          className="px-6 py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30"
        >
          PLAY
        </button>
      </div>
    </div>
  );
}

type FirstTimeUserViewProps = {
  season: IFantasySeason;
  currentGameweek?: number;
  nextDeadline?: Date;
  username?: string;
  teamUrl: string;
};

function FirstTimeUserView({ season, currentGameweek, nextDeadline, username, teamUrl }: FirstTimeUserViewProps) {
  const navigate = useNavigate();
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  // Check if the gameweek is still open (before deadline)
  const isGameweekOpen = nextDeadline ? new Date() < new Date(nextDeadline) : true;

  return (
    <>
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
              <span className="font-semibold">Round {currentGameweek}</span> ends in
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
            onClick={() => setIsHowToPlayModalOpen(true)}
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

      <ScrummyGamePlayModal isOpen={isHowToPlayModalOpen} onClose={() => setIsHowToPlayModalOpen(false)} />
    </>
  );
}
