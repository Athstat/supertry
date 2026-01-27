import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import BlueGradientCard from '../ui/cards/BlueGradientCard';
import RoundedCard from '../ui/cards/RoundedCard';
import { IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { isSeasonRoundLocked } from '../../utils/leaguesUtils';
import { useRoundScoringSummaryV2 } from '../../hooks/fantasy/useRoundScoringSummary';
import { LeagueRoundCountdown2 } from '../fantasy_league/LeagueCountdown';
import { smartRoundUp } from '../../utils/intUtils';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useUserRoundTeam } from '../../hooks/fantasy/useUserRoundTeam';
import { ISeasonRound } from '../../types/fantasy/fantasySeason';
import TextHeading from '../ui/typography/TextHeading';
import { Dot } from 'lucide-react';
import TeamHistoryProvider from '../../providers/fantasy_teams/TeamHistoryProvider';
import FantasyTeamProvider from '../../providers/fantasy_teams/FantasyTeamProvider';
import { FantasyTeamFormation3D } from '../my_fantasy_team/FantasyTeamFormation3D';
import SecondaryButton from '../ui/buttons/SecondaryButton';

type Props = {
  leagueGroup: FantasyLeagueGroup;
};

/** Renders the showcase league section */
export default function ManageTeamCTA({ leagueGroup }: Props) {
  return (
    <Content leagueGroup={leagueGroup} />
  );
}

function Content({ leagueGroup: league }: Props) {

  const { authUser } = useAuth();
  const { currentRound, previousRound } = useFantasySeasons();

  const { roundTeam: userTeam, isLoading } = useUserRoundTeam(authUser?.kc_id, currentRound?.round_number);

  const scoreRound = useMemo(() => {
    if (currentRound && isSeasonRoundLocked(currentRound)) {
      return currentRound;
    }

    if (previousRound && currentRound && !isSeasonRoundLocked(currentRound)) {
      return previousRound;
    }

    return undefined;
  }, [currentRound, previousRound])

  if (!league) return;

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (

    <BlueGradientCard className='flex flex-col items-center justify-center px-0 gap-4 pt-8 pb-0 rounded-none bg-gradient-to-tr from-[#1196F5] to-[#011E5C]' >

      {scoreRound && <div className='w-full px-4' >
        <RoundScoringSummary
          league={league}
          userTeam={userTeam}
          leagueRound={scoreRound}
          userId={authUser?.kc_id || ""}
        />
      </div>}

      {currentRound && (
        <LeagueRoundCountdown2
          leagueRound={currentRound}
          title={`${currentRound.round_title} Starts in`}
          leagueTitleClassName='font-normal text-sm'
        />
      )}


      {userTeam && currentRound && <div className='rounded-t-[20px] bg-white relative w-full max-h-[250px] overflow-clip' >
        <TeamHistoryProvider
          user={authUser}
        >
          <FantasyTeamProvider readOnly team={userTeam} >
            <FantasyTeamFormation3D className='mt-0 -top-12' onPlayerClick={() => { }} />
          </FantasyTeamProvider>
        </TeamHistoryProvider>



        <div className='absolute top-0 p-4 left-0 w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-transparent to-[#011E5C]' >
          <div></div>

          <CTAButtons
            leagueRound={currentRound}
            userRoundTeam={userTeam}
            previousRound={previousRound}
          />

        </div>
      </div>}

    </BlueGradientCard>
  );
}


function LoadingSkeleton() {

  return (
    <div className='flex flex-col gap-6' >

      <div className='flex flex-col gap-2' >
        <RoundedCard className='w-full h-[160px] border-none rounded-xl animate-pulse' />
      </div>
    </div>
  );

}

type RoundScoringProps = {
  leagueRound: ISeasonRound,
  userTeam?: IFantasyLeagueTeam
  userId: string,
  league?: FantasyLeagueGroup
}

function RoundScoringSummary({ leagueRound, userTeam, league }: RoundScoringProps) {

  const { userScore, isLoading } = useRoundScoringSummaryV2(leagueRound);
  const hasTeam = Boolean(userTeam);

  if (isLoading || !hasTeam) {
    return (
      <div className='flex flex-row items-center animate-pulse justify-center w-full gap-2' >
        <RoundedCard className='h-[40px] w-[100px] bg-white/20 border-none dark:bg-white/20' />
        <RoundedCard className='h-[40px] w-[100px] bg-white/20 border-none dark:bg-white/20' />
        <RoundedCard className='h-[40px] w-[100px] bg-white/20 border-none dark:bg-white/20' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2 w-full' >

      <div className='border-t border-b p-4 w-full flex flex-row items-center justify-center' >
        <TextHeading className='text-lg' >{league?.title}</TextHeading>
        <Dot />
        <TextHeading className='text-lg' >Round {leagueRound.round_number}</TextHeading>
        <Dot />
        <TextHeading className='text-lg' >Round {smartRoundUp(userScore || 0)}</TextHeading>
      </div>

    </div>
  )
}

type CTAButtonProps = {
  leagueRound: ISeasonRound,
  userRoundTeam?: IFantasyLeagueTeam,
  previousRound?: ISeasonRound
}

function CTAButtons({ leagueRound, userRoundTeam }: CTAButtonProps) {

  const navigate = useNavigate();

  const isCurrentLocked = isSeasonRoundLocked(leagueRound);
  const isUserHasTeam = Boolean(userRoundTeam);

  const showManageTeam = !isCurrentLocked && isUserHasTeam;
  const showViewTeam = isCurrentLocked && isUserHasTeam;
  const showCreateTeam = !isCurrentLocked && !isUserHasTeam;
  const showSorryMessage = isCurrentLocked && !isUserHasTeam;

  const handleManageTeam = () => {
    navigate(`/my-team`);
  }

  return (
    <div className='flex flex-col gap-2' >

      {showManageTeam && <SecondaryButton
        onClick={handleManageTeam}
      >
        Manage My Team
      </SecondaryButton>}

      {showViewTeam && <SecondaryButton
        onClick={handleManageTeam}
      >
        View My Team
      </SecondaryButton>}

      {showCreateTeam && (
        <SecondaryButton onClick={handleManageTeam} >
          Create My Team
        </SecondaryButton>
      )}

      {showSorryMessage && (
        <SecondaryButton className='text-xs lg:text-sm font-normal text-start' >
          <p>Whoops! You missed the team deadline for <strong>{leagueRound.round_title}</strong>. You will have to wait for the next round to create your team</p>
        </SecondaryButton>
      )}

    </div>
  )
}