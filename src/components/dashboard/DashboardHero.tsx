import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { IFantasySeason } from '../../types/fantasy/fantasySeason';
import RoundedCard from '../shared/RoundedCard';
import { Fragment, ReactNode, useMemo, useState } from 'react';
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
import { IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { useDelay } from '../../hooks/useDelay';

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

  const { isDelaying } = useDelay(500);
  const { currentRound: currentGameweek, isLoading: loadingGroup } = useFantasyLeagueGroup();

  const { roundTeam, isLoading: loadingRoundTeam } = useUserRoundTeam(currentGameweek?.id, authUser?.kc_id);
  const isLoading = loadingGroup || loadingRoundTeam;

  if (isLoading || isDelaying) {
    return (
      <DashboardHeroLoadingSkeleton />
    );
  }

  if (!season) {
    return null;
  }

  return (
    <DashboardHeroFrame>
      <DashboardHeroHeader />
      <DashboardHeroScoreSection roundTeam={roundTeam} />
      <DashboardHeroCTASection roundTeam={roundTeam} />
    </DashboardHeroFrame>
  )

}

function DashboardHeroLoadingSkeleton() {
  return <div>
    <RoundedCard className="p-6 animate-pulse bg-gray-200 dark:bg-slate-800 border-none">
      <div className="h-64"></div>
    </RoundedCard>
  </div>
}

type DashboardFrameProps = {
  children?: ReactNode
}

/** Renders the dashboard frame */
function DashboardHeroFrame({ children }: DashboardFrameProps) {
  return (
    <div className="relative w-full overflow-hidden shadow-md">

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
        {children}
      </div>

      <div className='z-[20] max-h-32 overflow-clip sm:max-h-32  absolute bottom-0 left-0 px-0.5' >
        <img
          src='/images/dashboard/beast_screeming.png'
          className='h-32 sm:h-32 object-contain'
        />
      </div>

    </div>
  )
}

/** Renders the DashboardBoardHero.Header */
function DashboardHeroHeader() {

  const navigate = useNavigate();
  const { authUser } = useAuth();

  const handleClick = () => {
    navigate('/profile');
  }

  return (
    <Fragment>
      <div onClick={handleClick} className="flex cursor-pointer items-center gap-2">
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
    </Fragment>
  )
}

type ScoreProps = {
  roundTeam?: IFantasyLeagueTeam
}

function DashboardHeroScoreSection({ roundTeam }: ScoreProps) {

  const { scoringRound } = useFantasyLeagueGroup();

  const { userScore, averagePointsScored, highestPointsScored } = useRoundScoringSummary(scoringRound);
  const isFirstTime = roundTeam === undefined;

  if (isFirstTime) {
    return (
      <Fragment>
      </Fragment>
    )
  }

  return (
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

          {/* Round Indicator (inside card) - Shows Scoring Round Card */}
          <p className="text-sm font-semibold text-[#1196F5] text-center ">
            Round {scoringRound?.start_round || '—'}
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
  )
}

type CTASectionProps = {
  roundTeam?: IFantasyLeagueTeam,

}

function DashboardHeroCTASection({ roundTeam }: CTASectionProps) {

  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const { nextDeadlineRound, currentRound, league } = useFantasyLeagueGroup();
  const isFirstTime = roundTeam === undefined;

  const nextDeadline = useMemo(() => {
    const deadline = nextDeadlineRound?.join_deadline;
    return deadline ? new Date(deadline) : undefined;
  }, [nextDeadlineRound?.join_deadline]);

  const isGameweekOpen = currentRound && !isLeagueRoundLocked(currentRound);

  // TODO: Define Team URL
  const teamUrl = useMemo(() => {
    const leagueGroupId = league?.id;

    if (!leagueGroupId) return '/leagues';
    const url = `/league/${leagueGroupId}`;
    const params = new URLSearchParams();
    if (currentRound) {
      params.append('round_filter', currentRound.id);
    }
    params.append('tab', 'my-team');
    return `${url}?${params.toString()}`;
  }, [league?.id, currentRound]);

  const handlePickTeam = () => {
    navigate(teamUrl);
  }

  const handleOpenHelpModal = () => {
    setShowHelpModal(true);
  }

  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
  }

  const handleManageTeam = () => {
    navigate(teamUrl)
  }


  if (isFirstTime) {
    return (
      <Fragment>
        {nextDeadline && nextDeadlineRound && (
          <>
            <div className="w-[80%] max-w-sm border-t border-white/50"></div>
            <p className="text-sm text-white text-center">
              Next Deadline: Round {(nextDeadlineRound?.start_round || 0)}<br />
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
            onClick={handleOpenHelpModal}
            className="w-fit font-semibold text-xs underline text-white uppercase shadow-md transition-colors "
          >
            HOW TO PLAY
          </button>
        </div>

        <ScrummyGamePlayModal isOpen={showHelpModal} onClose={handleCloseHelpModal} />
      </Fragment>
    )
  }


  return (
    <Fragment>
      {nextDeadline && nextDeadlineRound && (
        <>
          <div className="w-[80%] max-w-sm border-t border-white/50"></div>
          <p className="text-sm text-white text-center">
            Next Deadline: Round {(nextDeadlineRound?.start_round || 0)}<br />
            <span className="font-bold">{formatCountdown(nextDeadline)}</span>
          </p>
        </>
      )}

      {/* Manage Team Button */}
      <button
        onClick={handleManageTeam}
        className="px-6 py-2.5 rounded-md bg-[#011E5C]/20 border border-white font-semibold text-sm text-white uppercase shadow-md transition-colors hover:bg-[#011E5C]/30"
      >
        PLAY NOW
      </button>
    </Fragment>
  )
}