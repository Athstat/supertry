import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { useNavigate } from 'react-router-dom';
import BlueGradientCard from '../ui/cards/BlueGradientCard';
import RoundedCard from '../ui/cards/RoundedCard';
import { IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { isSeasonRoundLocked } from '../../utils/leaguesUtils';
import { useRoundScoringSummaryV2 } from '../../hooks/fantasy/useRoundScoringSummary';
import { LeagueRoundCountdown3 } from '../fantasy_league/LeagueCountdown';
import { TranslucentButton } from '../ui/buttons/PrimaryButton';
import { smartRoundUp } from '../../utils/intUtils';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useUserRoundTeam } from '../../hooks/fantasy/useUserRoundTeam';
import { ISeasonRound } from '../../types/fantasy/fantasySeason';
import { useAuth } from '../../contexts/auth/AuthContext';
import Dot from '../ui/icons/Dot';
import FantasyTeamProvider from '../../providers/fantasy_teams/FantasyTeamProvider';
import TeamHistoryProvider from '../../providers/fantasy_teams/TeamHistoryProvider';
import { FantasyTeamFormation3D } from '../my_fantasy_team/FantasyTeamFormation3D';

type Props = {
  leagueGroup: FantasyLeagueGroup;
};

/** Renders the showcase league section */
export default function MyFantasyTeamPreview({ leagueGroup }: Props) {

  const { authUser } = useAuth();
  const { currentRound, previousRound, scoringRound, nextDeadlineRound } = useFantasySeasons();

  const { roundTeam: userTeam, isLoading: loadingUserTeam } = useUserRoundTeam(authUser?.kc_id, currentRound?.round_number, true);
  const { userScore, isLoading: loadingScore } = useRoundScoringSummaryV2(scoringRound);

  const isLoading = loadingScore || loadingUserTeam;
  const showUserScore = (Boolean(userScore) && Boolean(scoringRound));

  if (!leagueGroup) return;

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="flex flex-col gap-4 relative" key={currentRound?.id} >

      <BlueGradientCard className='flex flex-col gap-4 p-0 pt-6 rounded-none bg-gradient-to-r from-[#0B68BA] to-[#011E5C]' >


        <div className='border-t border-b mx-4 flex flex-col items-center justify-center py-4' >

          {scoringRound && <div className='flex flex-row items-center gap-2 font-semibold' >
            <p>{leagueGroup.title}</p>
            <Dot className='dark:bg-white' />
            <p>{scoringRound?.round_title}</p>

            {showUserScore && <>
              <Dot className='dark:bg-white' />
              <p>{smartRoundUp(userScore)} Points</p>
            </>}
          </div>}

          {currentRound && <div className='flex flex-row items-center gap-2 font-semibold' >
            <p>{leagueGroup.title}</p>
            <Dot className='dark:bg-white' />
            <p>{currentRound?.round_title}</p>
          </div>}

        </div>

        {nextDeadlineRound && (
          <LeagueRoundCountdown3
            leagueRound={nextDeadlineRound}
            title={`${nextDeadlineRound.round_title} Starts in`}
            leagueTitleClassName='font-normal text-sm'
            className='flex flex-row items-center justify-center'
          />
        )}

        {userTeam && currentRound && (
          <div className='max-h-[160px] overflow-clip relative' key={currentRound?.id} >
            <TeamHistoryProvider
              initRoundNumber={currentRound?.round_number}
              user={authUser}
            >
              <FantasyTeamProvider
                team={userTeam}
                readOnly
              >
                <FantasyTeamFormation3D className='mt-0 -top-8 flex flex-col items-center justify-center' onPlayerClick={() => { }} />
              </FantasyTeamProvider>
            </TeamHistoryProvider>
          </div>
        )}

        <div className='absolute bottom-0 left-0 w-full h-[160px] flex flex-col items-center justify-end pb-4 bg-gradient-to-b to-[#011E5C] from-transparent' >
          {currentRound && <CTAButtons
            leagueRound={currentRound}
            userRoundTeam={userTeam}
            previousRound={previousRound}
          />}
        </div>

      </BlueGradientCard>
    </div>
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

      <TranslucentButton className='bg-gradient-to-tr w-fit border-white rounded-md px-2 py-3 from-[#051635] to-[#143B62]' onClick={handleManageTeam} >
        {showManageTeam && <p>Manage My Team</p>}
        {showViewTeam && <p>View My Team</p>}
        {showCreateTeam && <p>Create My Team</p>}
      </TranslucentButton>

      {showSorryMessage && (
        <TranslucentButton className='text-xs lg:text-sm w0fit font-normal text-start' >
          <p>Whoops! You missed the team deadline for <strong>{leagueRound.round_title}</strong>. You will have to wait for the next round to create your team</p>
        </TranslucentButton>
      )}

    </div>
  )
}