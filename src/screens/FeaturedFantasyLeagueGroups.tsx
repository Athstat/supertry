import { Trophy } from "lucide-react";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../services/fantasy/fantasyLeagueGroupsService";
import RoundedCard from "../components/shared/RoundedCard";
import SmallLeagueOverviewCard from "../components/dashboard/my-team/LeagueOverviewCard";
import { hasLeagueGroupEnded } from "../utils/fantasy/leagueGroupsUtils";

export default function FeaturedFantasyLeagueGroups() {

    const key = swrFetchKeys.getAllPublicFantasyLeagues();
    const { data: fetchedLeagues, isLoading: loadingPublic } = useSWR(key, () => fantasyLeagueGroupsService.getAllPublicLeagues());

    const isLoading = loadingPublic;

    const officialLeagues = (fetchedLeagues ?? [])
        .filter((league) => {
            return (league.type === 'official_league');
        })
        .sort((a, b) => {

            const isAEnded = hasLeagueGroupEnded(a);
            const isBEnded = hasLeagueGroupEnded(b);

            const aBias = isAEnded ? 0 : 1;
            const bBias = isBEnded ? 0 : 1;

            return bBias - aBias;
        })
        .filter((l) => !hasLeagueGroupEnded(l));
    ;


    if (isLoading) {
        return (
            <div className="flex flex-col gap-4" >

                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <h2>Fantasy Leagues</h2>
                </div>

                <div className="flex flex-row items-center gap-2 no-scrollbar overflow-x-auto" >
                    <RoundedCard
                        className="border-none h-[150px] min-w-[100%] bg-slate-300/60 animate-pulse dark:bg-slate-800/60"
                    />
                </div>
            </div>
        )
    }

    if (officialLeagues.length <= 0) {
        console.log("No Official Leagues Available")
        return null;
    }

    return (
        <div className="flex flex-col gap-4" >
            {/* {firstOfficialLeague && (
                <SmallLeagueOverviewCard
                    league={firstOfficialLeague}
                />

            )} */}

            {officialLeagues.map((group, index) => {
                return (
                    <SmallLeagueOverviewCard 
                        league={group}
                        key={index}
                    />
                )
            })}
        </div>
    )
}
