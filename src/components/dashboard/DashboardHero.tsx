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
import { Globe, Users, ArrowUp } from 'lucide-react';
import TrophyIcon from '../shared/icons/TrophyIcon';

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
    globalRank: number;
    leagueRank: number;
    totalPoints: number;
    localRankPercentile: number;
    totalUsers: number;
    roundTotalUsers: number;
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
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/dashboard/hero-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Blue Gradient Overlay */}
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
          <img src="/images/profile-icon.svg" alt="Profile" className="w-6 h-6" />
          <p className="text-white font-normal text-xs">{authUser?.username || 'User'}</p>
        </div>

        {/* Title */}
        <h1
          className="text-center font-normal text-md leading-6 text-white"
          style={{ fontFamily: "'Race Sport', sans-serif" }}
        >
          PLAY URC FANTASY
          <br />
          {/* {abbreviateSeasonName(season.name).toUpperCase()} CHALLENGE */}
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
              {/* <Globe className="w-6 h-6 text-white" /> */}
              <p className="text-lg font-medium text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                #{userStats.globalRank}<span className="text-xs text-white">/{userStats.totalUsers}</span>
              </p>
            </div>

            {/* Points (Center - Larger & Elevated) */}
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <TrophyIcon className="w-6 h-6 text-[#1196F5]" />
              <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'Oswald, sans-serif', marginBottom: -5 }}>
                {userStats.totalPoints}
              </p>
              <p className="text-xs text-white" style={{ marginBottom: -10 }}>points</p>
            </div>

            {/* League Rank */}
            <div className="flex-1 flex flex-col items-center gap-1.5" style={{ marginBottom: -10 }}>
              {/* <Users className="w-6 h-6 text-white" /> */}
              <p className="text-lg font-medium text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                #{userStats.leagueRank}<span className="text-xs text-white">/{userStats.roundTotalUsers}</span>
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
              <p className="text-xs text-white">local rank</p>
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
            <div className="w-[80%] max-w-sm border-t border-white/50"></div>
            <p className="text-sm text-white text-center">
              Round {(currentGameweek || 0) + 1} Deadline:<br />
              <span className="font-bold">{formatCountdown(nextDeadline)}</span>
            </p>
          </>
        )}

        {/* Manage Team Button */}
        <button
          onClick={() => navigate(teamUrl)}
          className="px-6 py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30"
        >
          PLAY NOW
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
      <div className="relative w-full overflow-hidden shadow-md">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/dashboard/hero-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Blue Gradient Overlay */}
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
            <img src="/images/profile-icon.svg" alt="Profile" className="w-6 h-6" />
            <p className="text-white font-normal text-xs">{username || 'User'}</p>
          </div>

          {/* Title */}
          <h1
            className="text-center font-normal text-md leading-6 text-white"
            style={{ fontFamily: "'Race Sport', sans-serif" }}
          >
            PLAY URC FANTASY
            <br />
            {/* {abbreviateSeasonName(season.name).toUpperCase()} CHALLENGE */}
          </h1>

          {/* Deadline */}
          {nextDeadline && (
            <>
              <div className="w-[80%] max-w-sm border-t border-white/50"></div>
              <p className="text-sm text-white text-center">
                Round {(currentGameweek || 0) + 1} Deadline:<br />
                <span className="font-bold">{formatCountdown(nextDeadline)}</span>
              </p>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-sm justify-center px-2">
            <button
              onClick={() => setIsHowToPlayModalOpen(true)}
              className="px-6 py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30"
            >
              HOW TO PLAY
            </button>
            <button
              onClick={() => isGameweekOpen && navigate(teamUrl)}
              disabled={!isGameweekOpen}
              className={`px-6 py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30 ${!isGameweekOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              PLAY NOW
            </button>
          </div>
        </div>
      </div>

      <ScrummyGamePlayModal isOpen={isHowToPlayModalOpen} onClose={() => setIsHowToPlayModalOpen(false)} />
    </>
  );
}
