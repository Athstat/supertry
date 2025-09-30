import { useMemo } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker";
import { IProAthlete } from "../../types/athletes";
import PlayerMugshot from "../shared/PlayerMugshot";
import RoundedCard from "../shared/RoundedCard";
import SecondaryText from "../shared/SecondaryText";
import { athleteSearchPredicate } from "../../utils/athleteUtils";
import useSWR from "swr";
import { seasonService } from "../../services/seasonsService";
import { Info } from "lucide-react";


export default function PlayerPickerPlayerList() {


    const { searchQuery, positionPool, availbleTeams, leagueRound } = usePlayerPicker();

    const key = leagueRound ? `/all-players` : null;
    const { data: fetchedAthletes, isLoading: loadingAthletes } = useSWR(key, () => seasonService.getSeasonAthletes(leagueRound?.season_id ?? ''));

    const athletes = useMemo(() => fetchedAthletes ?? [], [fetchedAthletes]);

    const filteredAthletes = useMemo(() => {

        const targetTeamIds = availbleTeams.map((t) => t.athstat_id);

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

    }, [athletes, positionPool, searchQuery, availbleTeams]);

    const isLoading = loadingAthletes;

    if (isLoading) {
        return (
            <div className="flex mt-5 flex-col gap-2" >
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
        <div className="bg-slate-50 rounded-xl border border-slate-50 p-2 mt-5" >
            <div className="flex font-semibold p-2 flex-row items-center justify-between" >
                <div>
                    <SecondaryText>Player</SecondaryText>
                </div>

                <div className="flex flex-row items-center gap-2 justify-between " >
                    <div>
                        <SecondaryText>
                            PR
                        </SecondaryText>
                    </div>

                    <div>
                        <SecondaryText>Price</SecondaryText>
                    </div>
                </div>
            </div>

            <div className="flex flex-col divide-y" >
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
    return (
        <div className="flex flex-row p-2 items-center gap-2" >

            <div className="border-r flex flex-row items-center gap-2 w-[200px]" >
                
                <Info className="w-4 h-4 text-slate-400" />
                
                <PlayerMugshot
                    url={player.image_url}
                    className="w-10 h-10"
                />

                <div className="flex flex-col" >
                    <p className="text-xs" >{player.player_name}</p>
                    <SecondaryText className="text-[10px]" >{player?.team?.athstat_name ?? player.position_class}</SecondaryText>
                </div>
            </div>

            <div className="flex flex-row items-center gap-2" >
                <p>{player.power_rank_rating}</p>
                <p>{player.price}</p>
            </div>
        </div>
    )
}