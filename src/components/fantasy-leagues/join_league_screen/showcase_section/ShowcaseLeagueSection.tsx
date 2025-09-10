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

  const { league, currentRound } = useFantasyLeagueGroup();

  const { authUser } = useAuth();

  const key = swrFetchKeys.getUserFantasyLeagueRoundTeam(
    currentRound?.fantasy_league_group_id ?? '',
    currentRound?.id ?? '',
    authUser?.kc_id
  );

  const { data: userTeam, isLoading } = useSWR(key, () => leagueService.getUserRoundTeam(currentRound?.id ?? '', authUser?.kc_id ?? ''))

  if (!league) return;

  if (isLoading) {
    return (
      <LoadingState />
    )
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
          <button>
            <ArrowRight className="" />
          </button>
        </div>
      </div>

      <LearnScrummyNoticeCard />

      {currentRound && <LeagueRoundSummary
        userTeam={userTeam}
        currentRound={currentRound}
      />
      }

      {currentRound && userTeam && <UserTeamOverview userTeam={userTeam} leagueRound={currentRound} />}
    </div>
  )
}