import useSWR from "swr"
import { IProAthlete } from "../../../types/athletes"
import RoundedCard from "../../shared/RoundedCard"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { IProSeason } from "../../../types/season"
import { fantasySeasonsService } from "../../../services/fantasy/fantasySeasonsService"
import { Activity, useMemo } from "react"
import { PlayerPointsHistoryItem } from "../../../types/fantasyLeagueGroups"
import SecondaryText from "../../shared/SecondaryText"
import { format } from "date-fns"
import TeamLogo from "../../team/TeamLogo"
import { fixtureSummary, getOpponent } from "../../../utils/fixtureUtils"
import { twMerge } from "tailwind-merge"

type Props = {
    player: IProAthlete,
    season: IProSeason
}

/** Renders a players point history graph */
export default function PlayerPointsHistoryCard({ player, season }: Props) {

    const key = swrFetchKeys.getPlayerPointsHistory(season.id, player.tracking_id)
    const { data, isLoading } = useSWR(key, () => fantasySeasonsService.getPlayerPointsHistory(season.id, player.tracking_id));

    const history = useMemo(() => {
        return data ?? [];
    }, [data]);

    const hasHistory = history.length > 0;

    if (isLoading) {
        return (
            <RoundedCard
                className="max-h-[200px] min-h-[200px] dark:border-none animate-pulse"
            />
        )
    }

    return (
        <RoundedCard className="p-4 max-h-[200px] min-h-[200px] dark:border-none flex flex-col gap-5" >
            <div>
                <p className="font-bold text-sm" >Points History</p>
            </div>

            <Activity mode={hasHistory ? "hidden" : "visible"} >
                <div className="flex flex-col items-center justify-center h-[100px] text-center px-[10%]" >
                    <SecondaryText>{player.player_name}{(player.player_name || "").endsWith("s") ? "'" : "'s"} points history data is not yet available</SecondaryText>
                </div>
            </Activity>

            <Activity mode={hasHistory ? "visible" : "hidden"} >
                <div className="flex flex-row items-center  justify-between gap-3" >
                    {history.map((h) => {
                        return (
                            <PointsHistoryItem
                                item={h}
                                key={h.game_id}
                                player={player}
                            />
                        )
                    })}
                </div>

                <div className="flex flex-row gap-1 text-[10px]" >
                    <SecondaryText className="text-[10px]" >Legend</SecondaryText>

                    <div className="flex flex-row items-center gap-2" >
                        <div className="bg-green-500 px-2 rounded-md text-black font-semibold" >
                            <p>Win</p>
                        </div>

                        <div className="bg-red-500 dark:bg-red-600 rounded-md px-2 rounded-m font-semibold" >
                            <p>Loss</p>
                        </div>

                        <div className="bg-slate-400 dark:bg-slate-700 rounded-md px-2 rounded-m font-semibold" >
                            <p>Draw</p>
                        </div>
                    </div>
                </div>
            </Activity>
        </RoundedCard>
    )
}

type HistoryItemProps = {
    item: PlayerPointsHistoryItem,
    player: IProAthlete
}

function PointsHistoryItem({ item, player }: HistoryItemProps) {

    const { game } = item;
    const kickoff = game.kickoff_time ? new Date(game.kickoff_time) : undefined;

    const opp = getOpponent(game, player);

    const { team, opposition_team } = game;
    const { homeTeamWon, awayTeamWon, isDraw } = fixtureSummary(game);

    const isW = (opp?.athstat_id === team?.athstat_id && awayTeamWon) || (opp?.athstat_id === opposition_team?.athstat_id && homeTeamWon);
    const isL = !isW && !isDraw;

    return (
        <div className="flex rounded-xl cursor-pointer flex-col gap-2 items-center justify-center flex-1" >
            {kickoff && <SecondaryText className="text-xs" >{format(kickoff, "d MMM")}</SecondaryText>}
            <div>
                <TeamLogo
                    url={opp?.image_url}
                    className="w-10 h-10"
                />
            </div>

            <div className={twMerge(
                "w-fit px-4 bg-blue-500 py-0.5 rounded-md items-center justify-center text-center flex",
                isW && "bg-green-500 text-black font-semibold",
                isL && "bg-red-500 dark:bg-red-600 ",
                isDraw && "bg-slate-400 dark:bg-slate-700"
            )} >
                <p className="text-xs" >{Math.floor(item.total_score)}pts</p>
            </div>

        </div>
    )
}