import { useFantasyLeagueGroup } from '../../../../hooks/leagues/useFantasyLeagueGroup';
import { FantasyLeagueGroup } from '../../../../types/fantasyLeagueGroups';
import FantasyLeagueGroupDataProvider from '../../../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import LearnScrummyNoticeCard from '../../../branding/help/LearnScrummyNoticeCard';
import useSWR from 'swr';
import { useAuth } from '../../../../contexts/AuthContext';
import { leagueService } from '../../../../services/leagueService';
import { swrFetchKeys } from '../../../../utils/swrKeys';
import { LeagueRoundSummary } from '../../../fantasy-league/overview/LeagueOverviewTab';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import RoundedCard from '../../../shared/RoundedCard';

type Props = {
  leagueGroup: FantasyLeagueGroup;
};

/** Renders the showcase league section */
export default function ShowcaseLeagueSection({ leagueGroup }: Props) {
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
  const navigate = useNavigate();
  const { league, currentRound } = useFantasyLeagueGroup();

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

  if (!league) return;

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const handlePickTeam = () => {
    navigate(`/league/${league.id}?journey=team-creation`);
  };

  const handleViewStandings = () => {
    navigate(`/league/${league.id}?journey=standings`);
  };

  const handleViewTeam = () => {
    const teamId = (userTeam?.team_id ?? userTeam?.team?.id) as string | number | undefined;
    const roundId = currentRound?.id;
    if (teamId && roundId) {
      navigate(`/league/${league.id}?journey=my-team&roundId=${roundId}&teamId=${teamId}`);
    } else {
      navigate(`/league/${league.id}?journey=my-team`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2 justify-between">
        <div>

{/* 
          <div className="flex flex-row items-center gap-1">
            <Globe className="w-4 h-4" />
            <p className="">{league.title}</p>
          </div> */}

          {/* <p className="font-bold text-md">{currentRound?.title}</p> */}
        </div>

        {/* <div>
          <button
            onClick={goToLeague}
            className="hover:bg-slate-200 hover:dark:bg-slate-800 w-10 h-10 flex flex-col items-center justify-center rounded-xl"
          >
            <ArrowRight className="" />
          </button>
        </div> */}
      </div>

      <LearnScrummyNoticeCard />

      {currentRound && (
        <LeagueRoundSummary
          userTeam={userTeam}
          currentRound={currentRound}
          onPickTeam={handlePickTeam}
          onViewStandings={handleViewStandings}
          onViewTeam={handleViewTeam}
        />
      )}

    </div>
  );
}


function LoadingSkeleton() {

  return (
    <div className='flex flex-col gap-6' >
      <div className='flex flex-row items-center justify-between' >
        <div className='flex flex-col gap-1' >
          <RoundedCard className='w-[100px] h-[25px] rounded-xl border-none' />
          <RoundedCard className='w-[60px] h-[20px] rounded-xl border-none' />
        </div>

        <div>
          <RoundedCard className='w-[40px] h-[30px] border-none rounded-xl animate-pulse' />
        </div>
      </div>

      <div className='flex flex-col gap-2' >
        <RoundedCard className='w-full h-[100px] border-none rounded-xl animate-pulse' />
      </div>
    </div>
  );

}