import useSWR from "swr";
import { useAuth } from "../../contexts/AuthContext";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup"
import { swrFetchKeys } from "../../utils/swrKeys";
import BlueGradientCard from "../shared/BlueGradientCard";
import { leagueService } from "../../services/leagueService";
import RoundedCard from "../shared/RoundedCard";


export default function LeagueOverviewTab() {
  return (
    <div className="flex flex-col gap-4" >

        <div>
            <div>
                <h2 className="font-bold text-lg" >Overview</h2>
            </div>
        </div>

        <LeagueRoundSummary />
    </div>
  )
}

function LeagueRoundSummary() {
    
    const {currentRound} = useFantasyLeagueGroup();
    const {authUser} = useAuth();

    const key = swrFetchKeys.getUserFantasyLeagueRoundTeam(
        currentRound?.fantasy_league_group_id ?? '',
        currentRound?.id ?? '',
        authUser?.kc_id
    );

    const {data: userTeam, isLoading} = useSWR(key, () => leagueService.getUserRoundTeam(currentRound?.id ?? '', authUser?.kc_id ?? ''))

    if (isLoading) {
        return (
            <RoundedCard className="p-4 h-[150px] border-none animate-pulse" >

            </RoundedCard>
        )
    }

    if (!currentRound) return;
    
    return (
        <div>
            <BlueGradientCard className="p-4" >
                <div className="flex flex-row items-center" >
                    <h3 className="font-bold text-xl" >{currentRound.title}</h3>
                </div>

                {!userTeam && (
                    <p>You haven't picked your team for {currentRound.title} yet!</p>
                )}
            </BlueGradientCard>
        </div>
    )
}