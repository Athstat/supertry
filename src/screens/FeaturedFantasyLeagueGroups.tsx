import { Plus, Trophy } from "lucide-react";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { fantasyLeagueGroupsService } from "../services/fantasy/fantasyLeagueGroupsService";
import { FantasyLeagueOverviewCard } from "../components/fantasy-leagues/league_dashboard_ui/FantasyLeagueOverviewCard";
import RoundedCard from "../components/shared/RoundedCard";
import { useNavigate } from "react-router-dom";
import { FantasyLeagueGroup } from "../types/fantasyLeagueGroups";
import LeagueOverviewCard from "../components/dashboard/my-team/LeagueOverviewCard";

export default function FeaturedFantasyLeagueGroups() {

    const navigate = useNavigate();
    const key = swrFetchKeys.getAllPublicFantasyLeagues();
    const { data: fetchedLeagues, isLoading: loadingPublic } = useSWR(key, () => fantasyLeagueGroupsService.getAllPublicLeagues());

    const mineKey = swrFetchKeys.getMyLeagueGroups();
    const {data: mineLeagueGroups, isLoading: loadingMine} = useSWR(mineKey, () => fantasyLeagueGroupsService.getJoinedLeagues());

    const isLoading = loadingPublic || loadingMine;


    const officialLeagues = (fetchedLeagues ?? []).filter((league) => {
        return (league.type === 'official_league');
    });

    const otherLeagues = (mineLeagueGroups ?? [])
        .filter(l => !officialLeagues.includes(l));

    const featuredLeague = officialLeagues.length > 0 ? officialLeagues[0] : undefined;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4" >

                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <h2>Fantasy Leagues</h2>
                </div>

                <div className="flex flex-row items-center gap-2 no-scrollbar overflow-x-auto" >
                    <RoundedCard
                        className="border-none h-[150px] min-w-[90%] bg-slate-300/60 animate-pulse dark:bg-slate-800/60"
                    />

                    <RoundedCard
                        className="border-none h-[150px] min-w-[90%] bg-slate-300/60 animate-pulse dark:bg-slate-800/60"
                    />
                </div>
            </div>
        )
    }

    if (officialLeagues.length === 0) {
        return;
    }

    const handleGoToLeagueCreation = () => {
        navigate('/leagues?active_tab=my', {
            state: { showCreateLeagueModal: true }
        });
    }

    const handleClickLeague = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    const handleViewAllLeagues = () => {
        navigate(`/leagues`);
    }

    return (
        <div className="flex flex-col gap-4" >

            <div className="flex flex-row items-center justify-between gap-2" >
                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <h2>Fantasy Leagues</h2>
                </div>

                <div className="text-blue-500" >
                    <p onClick={handleViewAllLeagues} >View All</p>
                </div>
            </div>

            {featuredLeague && (
                <LeagueOverviewCard 
                    league={featuredLeague}
                />
            )}

            <div className="flex flex-row items-center gap-2 no-scrollbar overflow-x-auto" >
                {otherLeagues.map((leagueGroup) => {
                    return (
                        <FantasyLeagueOverviewCard
                            leagueGroup={leagueGroup}
                            className="max-w-[90%] min-w-[90%] min-h-[150px] max-h-[150px] lg:min-h-[160px] lg:max-h-[160px]"
                            onClick={handleClickLeague}
                        />
                    )
                })}

                <RoundedCard
                    className="min-h-[150px] text-slate-700 dark:text-slate-400 hover:text-black hover:dark:text-white p-4 max-h-[150px] lg:min-h-[160px] lg:max-h-[160px] min-w-[90%] bg-slate-50 hover:bg-white dark:bg-slate-800/60 hover:dark:bg-slate-800 flex flex-col items-center justify-center text-center gap-2"
                    onClick={handleGoToLeagueCreation}
                >
                    <p>
                        <Plus className="" />
                    </p>

                    <p className="text-xs" >
                        Join or Create Your own Fantasy League and Invite Friends!
                    </p>
                </RoundedCard>
            </div>
        </div>
    )
}
