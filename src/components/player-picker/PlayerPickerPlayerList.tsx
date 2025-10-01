import { useMemo } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker";
import { IProAthlete } from "../../types/athletes";
import RoundedCard from "../shared/RoundedCard";
import SecondaryText from "../shared/SecondaryText";
import { athleteSearchPredicate } from "../../utils/athleteUtils";
import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";
import TeamJersey from "../player/TeamJersey";
import { twMerge } from "tailwind-merge";
import { useInView } from "react-intersection-observer";


export default function PlayerPickerPlayerList() {


    const { searchQuery, positionPool, availbleTeams, leagueRound, filterTeams } = usePlayerPicker();

    const key = leagueRound ? `/all-players` : null;
    const { data: fetchedAthletes, isLoading: loadingAthletes } = useSWR(key, () => seasonService.getSeasonAthletes(leagueRound?.season_id ?? ''));

    const athletes = useMemo(() => fetchedAthletes ?? [], [fetchedAthletes]);

    const filteredAthletes = useMemo(() => {

        const targetTeamIds = filterTeams ?
            filterTeams.map(t => t.athstat_id)
            : availbleTeams.map((t) => t.athstat_id);

        return athletes
            .sort((a, b) => {
                return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
            })
            .filter((a) => {
                return a.position_class === positionPool
            })
            .filter((a) => {
                if (searchQuery) {
                    return athleteSearchPredicate(a, searchQuery)
                }

                return true;
            })
            .filter((a) => {
                if (targetTeamIds.length > 0) {
                    return targetTeamIds.includes(a.team?.athstat_id ?? '');
                }

                return true;
            })

    }, [athletes, positionPool, searchQuery, availbleTeams, filterTeams]);

    const isLoading = loadingAthletes;

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2" >
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
            </div>
        )
    }

    return (
        <div className="" >
            <div className="flex font-semibold p-2 flex-row items-center justify-between" >

                <div className="flex flex-row  items-center gap-2 min-w-[200px]" >
                    <SecondaryText>Player</SecondaryText>
                </div>

                <div className="grid grid-cols-2 w-[150px] gap-4" >
                    <div>
                        <SecondaryText>
                            P.Ranking
                        </SecondaryText>
                    </div>

                    <div>
                        <SecondaryText>Price</SecondaryText>
                    </div>
                </div>
            </div>

            <div className="flex flex-col divide-y dark:divide-slate-700" >
                {filteredAthletes.map((a) => {
                    return (
                        <PlayerListItem
                            player={a}
                            key={a.tracking_id}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type PlayerListItemProps = {
    player: IProAthlete
}

function PlayerListItem({ player }: PlayerListItemProps) {
    
    const {inView, ref} = useInView({triggerOnce: true});
    
    return (
        <div ref={ref} >
            {inView && (<div className="flex flex-row p-2 items-center justify-between gap-2" >

                <div className="flex flex-row items-center gap-2 w-[200px]" >

                    {/* <Info className="w-4 h-4 text-slate-400" /> */}

                    {/* <PlayerMugshot
                    url={player.image_url}
                    className="w-10 h-10"
                /> */}

                    <TeamJersey
                        teamId={player.team_id}
                        className={twMerge(
                            "min-h-10 max-h-10 min-w-10 max-w-10",
                            "lg:min-h-10 lg:max-h-10 lg:min-w-10 lg:max-w-10"
                        )}
                        key={player.tracking_id}
                        hideFade
                    />

                    <div className="flex flex-col" >
                        <p className="text-sm" >{player.player_name}</p>
                        <SecondaryText className="text-[10px]" >{player?.team?.athstat_name ?? player.position_class}</SecondaryText>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-[150px]" >
                    <SecondaryText>{player.power_rank_rating ? Math.floor(player.power_rank_rating) : '-'}</SecondaryText>
                    <SecondaryText>{player.price}</SecondaryText>
                </div>
            </div>)}
        </div>
    )
}