import useSWR from "swr"
import { IProAthlete } from "../../../types/athletes"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { IProSeason } from "../../../types/season"
import { fantasySeasonsService } from "../../../services/fantasy/fantasySeasonsService"
import { Activity, Fragment, useMemo } from "react"
import { PlayerPointsHistoryItem } from "../../../types/fantasyLeagueGroups"
import SecondaryText from "../../ui/typography/SecondaryText"
import { format } from "date-fns"
import TeamLogo from "../../team/TeamLogo"
import { fixtureSummary, getOpponent } from "../../../utils/fixtureUtils"
import { twMerge } from "tailwind-merge"
import { IFixture } from "../../../types/games"
import { usePlayerData } from "../../../providers/PlayerDataProvider"
import RoundedCard from "../../ui/cards/RoundedCard"

type Props = {
    player: IProAthlete,
    season: IProSeason,
    className?: string,
    loadingClassName?: string
}

/** Renders a players point history graph */
export default function PlayerPointsHistoryCard({ player, season, className, loadingClassName }: Props) {

    const key = swrFetchKeys.getPlayerPointsHistory(season.id, player.tracking_id)
    const { data, isLoading } = useSWR(key, () => fantasySeasonsService.getPlayerPointsHistory(season.id, player.tracking_id));

    const { setSelectedFixture } = usePlayerData();

    const handleClickFixture = (fixture: IFixture) => {
        setSelectedFixture(fixture);
    }

    const history = useMemo(() => {
        return (data ?? []).sort((a, b) => {
            const aDate = a.game.kickoff_time ? new Date(a.game.kickoff_time) : new Date();
            const bDate = b.game.kickoff_time ? new Date(b.game.kickoff_time) : new Date();

            return aDate.valueOf() - bDate.valueOf();
        });
    }, [data]);

    const hasHistory = history.length > 0;

    if (isLoading) {
        return (
            <RoundedCard
                className={twMerge(
                    "max-h-[170px] min-h-[170px] dark:border-none animate-pulse",
                    loadingClassName
                )}
            />
        )
    }

    return (
        <Fragment>
            <RoundedCard className={twMerge(
                "p-4 max-h-[170px] min-h-[170px] dark:border-none flex flex-col gap-5",
                className
            )} >
                <div>
                    <p className="font-bold text-sm" >Points History</p>
                </div>

                <Activity mode={hasHistory ? "hidden" : "visible"} >
                    <div className="flex flex-col items-center justify-center h-[100px] text-center px-[10%]" >
                        <SecondaryText>{player.player_name}{(player.player_name || "").endsWith("s") ? "'" : "'s"} points history data is not yet available</SecondaryText>
                    </div>
                </Activity>

                <Activity mode={hasHistory ? "visible" : "hidden"} >
                    <div className="flex flex-row items-center justify-between gap-1 overflow-hidden" >
                        {history.map((h) => {
                            return (
                                <PointsHistoryItem
                                    item={h}
                                    key={h.game_id}
                                    player={player}
                                    onClick={handleClickFixture}
                                />
                            )
                        })}
                    </div>
                </Activity>
            </RoundedCard>

        </Fragment>
    )
}

type HistoryItemProps = {
    item: PlayerPointsHistoryItem,
    player: IProAthlete,
    onClick?: (fixture: IFixture) => void
}

function PointsHistoryItem({ item, player, onClick }: HistoryItemProps) {

    const { game } = item;
    const kickoff = game.kickoff_time ? new Date(game.kickoff_time) : undefined;

    const opp = getOpponent(game, player);

    const { team, opposition_team } = game;
    const { homeTeamWon, awayTeamWon, isDraw } = fixtureSummary(game);

    const isW = (opp?.athstat_id === team?.athstat_id && awayTeamWon) || (opp?.athstat_id === opposition_team?.athstat_id && homeTeamWon);
    const isL = !isW && !isDraw;

    const handleOnClick = () => {
        if (onClick) {
            onClick(game);
        }
    }

    return (
        <div onClick={handleOnClick} className="flex rounded-xl cursor-pointer flex-col gap-2 items-center justify-center flex-1" >
            {kickoff && <SecondaryText className="text-xs" >{format(kickoff, "d MMM")}</SecondaryText>}
            <div>
                <TeamLogo
                    url={opp?.image_url}
                    className="w-10 h-10"
                />
            </div>

            <div className={twMerge(
                "w-fit px-4 bg-blue-500 py-0.5 rounded-md items-center justify-center text-center flex",
                isW && "bg-green-500 text-white dark:text-black font-semibold",
                isL && "bg-red-600 text-white dark:bg-red-600 ",
                isDraw && "bg-slate-400 text-slate-50 dark:bg-slate-700"
            )} >
                <p className="text-xs" >{Math.floor(item.total_score)}pts</p>
            </div>

        </div>
    )
}