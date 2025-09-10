import { ArrowRight, Globe } from "lucide-react"
import { useFantasyLeagueGroup } from "../../../../hooks/leagues/useFantasyLeagueGroup"
import { FantasyLeagueGroup } from "../../../../types/fantasyLeagueGroups"
import FantasyLeagueGroupDataProvider from "../../../fantasy-league/providers/FantasyLeagueGroupDataProvider"
import SecondaryText from "../../../shared/SecondaryText"
import LearnScrummyNoticeCard from "../../../branding/help/LearnScrummyNoticeCard"
import UserTeamOverview from "../../../fantasy-league/overview/UserTeamOverview"
import useSWR from "swr"
import { useAuth } from "../../../../contexts/AuthContext"
import { leagueService } from "../../../../services/leagueService"
import { swrFetchKeys } from "../../../../utils/swrKeys"
import { LoadingState } from "../../../ui/LoadingState"
import { LeagueRoundSummary } from "../../../fantasy-league/overview/LeagueOverviewTab"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"

type Props = {
  leagueGroup: FantasyLeagueGroup
}

/** Renders the showcase league section */
export default function ShowcaseLeagueSection({ leagueGroup }: Props) {

  return (
    <FantasyLeagueGroupDataProvider leagueId={leagueGroup.id} >
      <Content />
    </FantasyLeagueGroupDataProvider>
  )
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
  }, [currentRound, currentRound, authUser]);

  const { data: userTeam, isLoading } = useSWR(key, () => leagueService.getUserRoundTeam(currentRound?.id ?? '', authUser?.kc_id ?? ''))

  if (!league) return;

  if (isLoading) {
    return (
      <LoadingState />
    )
  }

  const goToLeague = () => {
    navigate(`/league/${league.id}`);
  }

  const handlePickTeam = () => {
    navigate(`/league/${league.id}?journey=team-creation`);
  }

  const handleViewStandings = () => {
    navigate(`/league/${league.id}?journey=standings`)
  };

  const handleViewTeam = () => {
    navigate(`/league/${league.id}?journey=my-team`);
  }

  return (
    <div className="flex flex-col gap-4" >
      <div className="flex flex-row items-center gap-2 justify-between" >

        <div>
          <div className="flex flex-row items-center gap-1" >
            <Globe className='' />
            <p className="font-semibold text-lg" >{league.title}</p>
          </div>
          <SecondaryText>{currentRound?.title}</SecondaryText>
        </div>

        <div>
          <button onClick={goToLeague} className="hover:bg-slate-200 hover:dark:bg-slate-800 w-10 h-10 flex flex-col items-center justify-center rounded-xl" >
            <ArrowRight className="" />
          </button>
        </div>
      </div>

      <LearnScrummyNoticeCard />

      { currentRound && <LeagueRoundSummary
        userTeam={userTeam}
        currentRound={currentRound}
        onPickTeam={handlePickTeam}
        onViewStandings={handleViewStandings}
        onViewTeam={handleViewTeam}
      /> }

      {currentRound && userTeam && <UserTeamOverview userTeam={userTeam} leagueRound={currentRound} />}
    </div>
  )
}