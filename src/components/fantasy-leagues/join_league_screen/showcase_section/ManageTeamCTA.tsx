import { useFantasyLeagueGroup } from '../../../../hooks/leagues/useFantasyLeagueGroup';
import { FantasyLeagueGroup } from '../../../../types/fantasyLeagueGroups';
import FantasyLeagueGroupDataProvider from '../../../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import LearnScrummyNoticeCard from '../../../branding/help/LearnScrummyNoticeCard';
import useSWR from 'swr';
import { useAuth } from '../../../../contexts/AuthContext';
import { leagueService } from '../../../../services/leagueService';
import { swrFetchKeys } from '../../../../utils/swrKeys';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import RoundedCard from '../../../shared/RoundedCard';
import BlueGradientCard from '../../../shared/BlueGradientCard';
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from '../../../../types/fantasyLeague';
import { isLeagueRoundLocked } from '../../../../utils/leaguesUtils';
import { useRoundScoringSummary } from '../../../../hooks/fantasy/useRoundScoringSummary';
import { LeagueRoundCountdown2 } from '../../../fantasy-league/LeagueCountdown';
import { TranslucentButton } from '../../../shared/buttons/PrimaryButton';

type Props = {
  leagueGroup: FantasyLeagueGroup;
};

/** Renders the showcase league section */
export default function ManageTeamCTA({ leagueGroup }: Props) {
  return (
    <FantasyLeagueGroupDataProvider
      loadingFallback={<LoadingSkeleton />}
      leagueId={leagueGroup.id}
    >
      <Content />
    </FantasyLeagueGroupDataProvider>
  );
}

function Content() {
  const { league, currentRound, previousRound } = useFantasyLeagueGroup();

  const { authUser } = useAuth();

  const key = useMemo(() => {
    return swrFetchKeys.getUserFantasyLeagueRoundTeam(
      currentRound?.fantasy_league_group_id ?? '',
      currentRound?.id ?? '',
      authUser?.kc_id
    );
  }, [currentRound, authUser]);

  const { data: userTeam, isLoading } = useSWR(key, () =>
    leagueService.getUserRoundTeam(currentRound?.id ?? '', authUser?.kc_id ?? '')
  );

  const scoreRound = useMemo(() => {
    if (currentRound && isLeagueRoundLocked(currentRound)) {
      return currentRound;
    }

    if (previousRound && currentRound && !isLeagueRoundLocked(currentRound)) {
      return previousRound;
    }

    return undefined;
  }, [currentRound, previousRound])

  if (!league) return;

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="flex flex-col gap-4">
      <LearnScrummyNoticeCard />

      <BlueGradientCard className='flex flex-col gap-4 p-4' >
        <div>
          <p className='font-semibold ' >{league.title}</p>
        </div>

        {scoreRound && <RoundScoringSummary userTeam={userTeam} leagueRound={scoreRound} userId={authUser?.kc_id || ""} />}

        {currentRound && (
          <LeagueRoundCountdown2
            leagueRound={currentRound}
            title={`${currentRound.title} Starts in`}
            leagueTitleClassName='font-normal text-sm'
          />
        )}

        {currentRound && <CTAButtons
          leagueRound={currentRound}
          userRoundTeam={userTeam}
          previousRound={previousRound}
        />}

      </BlueGradientCard>
    </div>
  );
}


function LoadingSkeleton() {

  return (
    <div className='flex flex-col gap-6' >

      <div className='flex flex-col gap-2' >
        <RoundedCard className='w-full h-[150px] border-none rounded-xl animate-pulse' />
      </div>
    </div>
  );

}

type RoundScoringProps = {
  leagueRound: IFantasyLeagueRound,
  userTeam?: FantasyLeagueTeamWithAthletes
  userId: string
}

function RoundScoringSummary({ leagueRound, userTeam }: RoundScoringProps) {

  const { highestPointsScored, averagePointsScored, userScore, isLoading } = useRoundScoringSummary(leagueRound);
  const hasTeam = Boolean(userTeam);

  if (isLoading || !hasTeam) {
    return null;
  }

  return (
    <div className='flex flex-col gap-2' >
      <div className='flex flex-col items-center justify-center w-full' >
        <p className='text-sm' >{leagueRound.title} Score</p>
      </div>

      <div className='grid grid-cols-3 px-[10%]' >

        <div className='flex flex-col items-center justify-center' >
          <p className='font-bold text-xl' >{Math.floor(averagePointsScored || 0)}</p>
          <p className='text-xs' >Average</p>
        </div>

        <div className='flex flex-col items-center justify-center' >
          <p className='font-bold text-2xl' >{Math.floor(userScore || 0)}</p>
          <p className='text-xs' >Your Score</p>
        </div>

        <div className='flex flex-col items-center justify-center' >
          <p className='font-bold text-xl' >{Math.floor(highestPointsScored || 0)}</p>
          <p className='text-xs' >Highest</p>
        </div>
      </div>
    </div>
  )
}

type CTAButtonProps = {
  leagueRound: IFantasyLeagueRound,
  userRoundTeam?: FantasyLeagueTeamWithAthletes,
  previousRound?: IFantasyLeagueRound
}

function CTAButtons({ leagueRound, userRoundTeam }: CTAButtonProps) {

  const navigate = useNavigate();

  const isCurrentLocked = isLeagueRoundLocked(leagueRound);
  const isUserHasTeam = Boolean(userRoundTeam);

  const showManageTeam = !isCurrentLocked && isUserHasTeam;
  const showViewTeam = isCurrentLocked && isUserHasTeam;
  const showCreateTeam = !isCurrentLocked && !isUserHasTeam;
  const showSorryMessage = isCurrentLocked && !isUserHasTeam;

  const handleManageTeam = () => {
    navigate(`/league/${leagueRound.fantasy_league_group_id}`);
  }

  return (
    <div className='flex flex-col gap-2' >

      {showManageTeam && <TranslucentButton
        onClick={handleManageTeam}
      >
        Manage My Team
      </TranslucentButton>}

      {showViewTeam && <TranslucentButton
        onClick={handleManageTeam}
      >
        View Your Team
      </TranslucentButton>}

      {showCreateTeam && (
        <TranslucentButton onClick={handleManageTeam} >
          Create Your Team
        </TranslucentButton>
      )}

      {showSorryMessage && (
        <TranslucentButton className='text-xs lg:text-sm font-normal text-start' >
          <p>Whoops! You missed the team deadline for <strong>{leagueRound.title}</strong>. You will have to wait for the next round to create your team</p>
        </TranslucentButton>
      )}

    </div>
  )
}