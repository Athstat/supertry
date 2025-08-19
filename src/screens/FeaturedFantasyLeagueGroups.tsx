import { Trophy } from "lucide-react";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../services/fantasy/fantasyLeagueGroupsService";
import { FantasyLeagueGroupCard } from "../components/fantasy-leagues/league_card_small/FantasyLeagueGroupCard";

export default function FeaturedFantasyLeagueGroups() {

    const key = swrFetchKeys.getAllPublicFantasyLeagues();
    const {data: fetchedLeagues, isLoading, error} = useSWR(key, () => fantasyLeagueGroupsService.getAllPublicLeagues());

    const officialLeagues = (fetchedLeagues ?? []).filter((league) => {
        return league.type === 'official_league';
    });

    

    if (officialLeagues.length === 0) {
        return;
    }

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2" >
                <Trophy className="w-4 h-4 text-blue-400" />
                <h2>Fantasy Leagues</h2>
            </div>

            <div className="flex flex-row items-center gap-2 overflow-x-auto" >
                {officialLeagues.map((leagueGroup) => {
                    return (
                        <FantasyLeagueGroupCard 
                            leagueGroup={leagueGroup}
                        />
                    )
                })}
            </div>
        </div>
    )
}
