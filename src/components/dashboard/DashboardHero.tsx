import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import RoundedCard from '../shared/RoundedCard';
import { useEffect, useMemo, useState } from 'react';
import { formatCountdown } from '../../utils/countdown';
import ScrummyGamePlayModal from '../branding/help/ScrummyGamePlayModal';
import TrophyIcon from '../shared/icons/TrophyIcon';
import useSWR from 'swr';
import { fantasySeasonsService } from '../../services/fantasy/fantasySeasonsService';
import FantasyLeagueGroupDataProvider from '../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import { useUserRoundTeam } from '../../hooks/fantasy/useUserRoundTeam';
import { useRoundScoringSummary } from '../../hooks/fantasy/useRoundScoringSummary';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';

type Props = {
  season?: IFantasySeason;
};

export default function DashboardHero({ season }: Props) {

  const key = season ? `fantasy-season/${season.id}/` : null;
  const { data: featuredLeagues } = useSWR(key, () => fantasySeasonsService.getFeaturedLeagueGroups(season?.id || ''));

  const featuredLeague = useMemo(() => {
    if (featuredLeagues && featuredLeagues.length > 0) {
      return featuredLeagues[0];
    }

    return undefined;
  }, [featuredLeagues]);

  return (
    <FantasyLeagueGroupDataProvider
      leagueId={featuredLeague?.id}
      loadingFallback={<DashboardHeroLoadingSkeleton />}
    >
      <Content season={season} />
    </FantasyLeagueGroupDataProvider>
  )
}

function Content({ season }: Props) {
  const { authUser } = useAuth();

  const [isDelaying, setIsDelaying] = useState(false);
  const { currentRound: currentGameweek, isLoading: loadingGroup, rounds, league } = useFantasyLeagueGroup();

  const previousGameweek = useMemo(() => {
    if (currentGameweek && rounds) {
      const prevRoundStart = (currentGameweek.start_round || 0) - 1;
      return rounds.find((r) => {
        return r.start_round === prevRoundStart
      })

    }

    return undefined;
  }, [currentGameweek, rounds]);

  const nextGameweek = useMemo(() => {
    if (currentGameweek && rounds) {
      const nextRoundStart = (currentGameweek.start_round || 0) + 1;
      return rounds.find((r) => {
        return r.start_round === nextRoundStart
      })

    }

    return undefined;
  }, [currentGameweek, rounds]);

  const scoringGameweek = useMemo(() => {
    if (currentGameweek && isLeagueRoundLocked(currentGameweek)) {
      return currentGameweek;
    }

    return previousGameweek
  }, [currentGameweek, previousGameweek]);


  const leagueGroupId = league?.id;
  const { roundTeam, isLoading: loadingRoundTeam } = useUserRoundTeam(currentGameweek?.id, authUser?.kc_id);

  const teamUrl = useMemo(() => {
    if (!leagueGroupId) return '/leagues';
    const url = `/league/${leagueGroupId}`;
    const params = new URLSearchParams();
    if (currentGameweek) {
      params.append('round_filter', currentGameweek.id);
    }
    params.append('tab', 'my-team');
    return `${url}?${params.toString()}`;
  }, [leagueGroupId, currentGameweek]);

  const nextDeadlineRound = useMemo(() => {
    if (currentGameweek && isLeagueRoundLocked(currentGameweek)) {
      return nextGameweek;
    }

    return currentGameweek;
  }, [currentGameweek, nextGameweek]);

  const nextDeadline = useMemo(() => {
    if (currentGameweek && isLeagueRoundLocked(currentGameweek)) {
      const deadline = nextGameweek?.join_deadline ? new Date(nextGameweek?.join_deadline) : undefined;
      return deadline;
    }

    const deadline = currentGameweek?.join_deadline ? new Date(currentGameweek?.join_deadline) : undefined;
    return deadline;
  }, [currentGameweek, nextGameweek?.join_deadline]);

  const isLoading = loadingGroup || loadingRoundTeam;

  useEffect(() => {
    setIsDelaying(true);

    const timeout = setTimeout(() => {
      setIsDelaying(false)
    }, 500);

    return () => {
      setIsDelaying(false);
      clearTimeout(timeout);
    }
  }, []);

  if (isLoading || isDelaying) {
    return (
      <DashboardHeroLoadingSkeleton />
    );
  }

  if (!season) {
    return null;
  }

  if (roundTeam && scoringGameweek) {
    return (
      <TeamExistsView
        season={season}
        teamUrl={teamUrl}
        currentGameweek={currentGameweek?.start_round || undefined}
        previousGameweek={previousGameweek?.start_round || undefined}
        nextDeadline={nextDeadline}
        scoringGameweek={scoringGameweek}
        nextDeadlineRound={nextDeadlineRound?.start_round || 1}
      />
    );
  }

  return (
    <FirstTimeUserView
      season={season}
      currentGameweek={currentGameweek?.start_round || undefined}
      nextDeadline={nextDeadline}
      username={authUser?.username}
      teamUrl={teamUrl}
      nextDeadlineRound={nextDeadlineRound?.start_round || 1}
    />
  );
}

type TeamExistsViewProps = {
  season: IFantasySeason;
  teamUrl: string;
  currentGameweek?: number;
  previousGameweek?: number;
  scoringGameweek: IFantasyLeagueRound;
  nextDeadline?: Date;
  nextDeadlineRound?: number
};

function TeamExistsView({ teamUrl, previousGameweek, nextDeadline, scoringGameweek, nextDeadlineRound }: TeamExistsViewProps) {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const { userScore, averagePointsScored, highestPointsScored } = useRoundScoringSummary(scoringGameweek);

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
          className="w-full bg-[#011E5C]/80 rounded-lg pt-4 pb-2 flex flex-row items-center gap-4 justify-center"
          style={{ backdropFilter: 'blur(4px)' }}
        >

          {/* Global Average */}
          <div className='flex flex-col items-center justify-center gap-1' >
            <p className="text-lg font-medium text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {Math.floor(averagePointsScored || 0)}
            </p>

            <div className="flex-1 flex justify-center">
              <p className="text-xs text-[#E2E8F0]">global average</p>
            </div>
          </div>

          {/* User Score */}
          <div className='flex flex-col items-center justify-center gap-1' >
            <p className="text-2xl font-semibold text-white" style={{ fontFamily: 'Oswald, sans-serif', marginBottom: -5 }}>
              {Math.floor(userScore || 0)}
            </p>
            <p className="text-xs text-white" style={{ marginBottom: -10 }}>points</p>

            <div className='flex flex-col items-center justify-center gap-1' >
              <TrophyIcon className="w-8 h-8 mt-3 text-[#1196F5]" />
              <div className="w-[130px] border-t border-[#1196F5]"></div>

              {/* Round Indicator (inside card) - Shows PREVIOUS round stats */}
              <p className="text-sm font-semibold text-[#1196F5] text-center ">
                Round {previousGameweek || '—'}
              </p>
            </div>
          </div>

          {/* Highest Points Scored */}
          <div className='flex flex-col items-center justify-center gap-1' >
            <p className="text-lg font-medium text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
              {Math.floor(highestPointsScored || 0)}
            </p>

            <div className="flex-1 flex justify-center">
              <p className="text-xs text-white">highest points</p>
            </div>
          </div>

        </div>

        {/* Deadline - Shows NEXT round deadline */}
        {nextDeadline && nextDeadlineRound && (
          <>
            <div className="w-[80%] max-w-sm border-t border-white/50"></div>
            <p className="text-sm text-white text-center">
              Next Deadline: Round {(nextDeadlineRound || 0)}<br />
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

      <div className='z-[20] absolute max-h-32 bottom-0 right-0 px-2' >
        <img
          src='/images/dashboard/all_blacks_player_haka.png'
          className='h-32 object-contain'
        />
      </div>

      <div className='z-[20] max-h-32  absolute bottom-0 left-0 px-2' >
        <img
          src='/images/dashboard/beast_screeming.png'
          className='h-32 object-contain'
        />
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
  nextDeadlineRound?: number
};

function FirstTimeUserView({ nextDeadline, username, nextDeadlineRound }: FirstTimeUserViewProps) {

  const navigate = useNavigate();
  const { league, currentRound } = useFantasyLeagueGroup();
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  // Check if the gameweek is still open (before deadline)
  const isGameweekOpen =  currentRound && !isLeagueRoundLocked(currentRound);

  const handlePickTeam = () => {

    if (!league || !isGameweekOpen) {
      navigate('/leagues');
      return
    }

    navigate(`/league/${league?.id}`);
  }

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
          {nextDeadline && nextDeadlineRound && (
            <>
              <div className="w-[80%] max-w-sm border-t border-white/50"></div>
              <p className="text-sm text-white text-center">
                Next Deadline: Round {(nextDeadlineRound || 0)}<br />
                <span className="font-bold">{formatCountdown(nextDeadline)}</span>
              </p>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm justify-center px-2">

            <p className='text-white max-w-48 text-xs text-center' >Pick your elite team now and start competing!</p>

            {isGameweekOpen && <button
              onClick={handlePickTeam}
              disabled={!isGameweekOpen}
              className={`px-6 w-fit py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30 ${!isGameweekOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              PICK A TEAM
            </button>}

            {!isGameweekOpen && <button
              onClick={handlePickTeam}
              className={`px-6 w-fit py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30`}
            >
              Play Now
            </button>}

            <button
              onClick={() => setIsHowToPlayModalOpen(true)}
              className="w-fit font-semibold text-xs underline text-white uppercase shadow-md transition-colors "
            >
              HOW TO PLAY
            </button>
          </div>
        </div>

        <div className='z-[20] absolute max-h-32 bottom-0 right-0 px-2' >
          <img
            src='/images/dashboard/all_blacks_player_haka.png'
            className='h-32 object-contain'
          />
        </div>

        <div className='z-[20] max-h-32  absolute bottom-0 left-0 px-2' >
          <img
            src='/images/dashboard/beast_screeming.png'
            className='h-32 object-contain'
          />
        </div>
      </div>

      <ScrummyGamePlayModal isOpen={isHowToPlayModalOpen} onClose={() => setIsHowToPlayModalOpen(false)} />
    </>
  );
}


function DashboardHeroLoadingSkeleton() {
  return <div>
    <RoundedCard className="p-6 animate-pulse bg-gray-200 dark:bg-slate-800 border-none">
      <div className="h-64"></div>
    </RoundedCard>
  </div>
}