import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import BlueGradientCard from '../ui/cards/BlueGradientCard';
import RoundedCard from '../ui/cards/RoundedCard';
import { useRoundScoringSummaryV2 } from '../../hooks/fantasy/useRoundScoringSummary';
import { LeagueRoundCountdown3 } from '../fantasy_league/LeagueCountdown';
import { smartRoundUp } from '../../utils/intUtils';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useUserRoundTeam } from '../../hooks/fantasy/useUserRoundTeam';
import { useAuth } from '../../contexts/auth/AuthContext';
import Dot from '../ui/icons/Dot';
import FantasyTeamProvider from '../../providers/fantasy_teams/FantasyTeamProvider';
import TeamHistoryProvider from '../../providers/fantasy_teams/TeamHistoryProvider';
import { FantasyTeamFormation3D } from '../my_fantasy_team/FantasyTeamFormation3D';
import { ManageTeamButton } from './ManageTeamButton';

type Props = {
  leagueGroup: FantasyLeagueGroup;
};

/** Renders the showcase league section */
export default function MyFantasyTeamPreview({ leagueGroup }: Props) {

  const { authUser } = useAuth();
  const { currentRound, scoringRound, nextDeadlineRound, nextRound } = useFantasySeasons();

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

          {!scoringRound && currentRound && <div className='flex flex-row items-center gap-2 font-semibold' >
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

        <div className='max-h-[160px] min-h-[120px] overflow-clip relative' key={currentRound?.id} >
          {userTeam && currentRound && (

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
          )}
        </div>

        <div className='absolute bottom-0 left-0 w-full h-[160px] flex flex-col items-center justify-end pb-4 bg-gradient-to-b to-[#011E5C] from-transparent' >
          {currentRound && <ManageTeamButton
            leagueRound={currentRound}
            userRoundTeam={userTeam}
            nextRound={nextRound}
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

