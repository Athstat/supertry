import useSWR from "swr"
import { IProAthlete } from "../../../../types/athletes"
import { swrFetchKeys } from "../../../../utils/swrKeys"
import { IProSeason } from "../../../../types/season"
import { fantasySeasonsService } from "../../../../services/fantasy/fantasySeasonsService"
import { Activity, Fragment, useMemo } from "react"
import { PlayerPointsHistoryItem } from "../../../../types/fantasyLeagueGroups"
import SecondaryText from "../../../ui/typography/SecondaryText"
import { format } from "date-fns"
import TeamLogo from "../../../team/TeamLogo"
import { fixtureSummary, getOpponent } from "../../../../utils/fixtureUtils"
import { twMerge } from "tailwind-merge"
import { IFixture } from "../../../../types/games"
import { usePlayerData } from "../../../../providers/PlayerDataProvider"
import RoundedCard from "../../../ui/cards/RoundedCard"

type Props = {
    player: IProAthlete,
    season: IProSeason,
    className?: string,
    loadingClassName?: string,
    onSelectFixture?: (fixture: IFixture) => void
}

/** Renders a players point history graph */
export default function PlayerPointsHistoryList({ player, season, className, loadingClassName, onSelectFixture }: Props) {

    const key = swrFetchKeys.getPlayerPointsHistory(season.id, player.tracking_id, 3)
    const { data, isLoading } = useSWR(key, () => fantasySeasonsService.getPlayerPointsHistory(season.id, player.tracking_id, 3));

    const { setSelectedFixture } = usePlayerData();

    const handleClickFixture = (fixture: IFixture) => {
        
        if (onSelectFixture) {
            onSelectFixture(fixture);
            return;
        }

        setSelectedFixture(fixture);
    }

    const history = useMemo(() => {
        return (data ?? []).sort((a, b) => {
            const aDate = a.game.kickoff_time ? new Date(a.game.kickoff_time) : new Date();
            const bDate = b.game.kickoff_time ? new Date(b.game.kickoff_time) : new Date();

            return bDate.valueOf() - aDate.valueOf();
        });
    }, [data]);

    const hasHistory = history.length > 0;

    if (isLoading) {
        return (
            <RoundedCard
                className={twMerge(
                    "max-h-[160px] min-h-[160px] dark:border-none animate-pulse",
                    loadingClassName
                )}
            />
        )
    }

    return (
        <Fragment>
            <RoundedCard className={twMerge(
                "p-3 max-h-[160px] min-h-[160px] dark:border-none flex flex-col gap-5",
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
                    <div className="flex flex-col gap-1 overflow-hidden" >
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
        <div onClick={handleOnClick} className="flex rounded-xl cursor-pointer flex-row justify-between gap-2 items-center  flex-1" >
            <div className="flex flex-row items-center gap-1" >
                {kickoff && <SecondaryText className="text-xs" >{format(kickoff, "d MMM")}</SecondaryText>}
                <div>
                    <TeamLogo
                        url={opp?.image_url}
                        className="w-7 h-7"
                    />
                </div>
            </div>

            <div className={twMerge(
                "w-10 h-6 bg-blue-500 rounded-md items-center justify-center text-center flex",
                isW && "bg-green-500 text-white dark:text-black font-semibold",
                isL && "bg-red-600 text-white dark:bg-red-600 ",
                isDraw && "bg-slate-400 text-slate-50 dark:bg-slate-700"
            )} >
                <p className="text-[10px]" >{Math.floor(item.total_score)}pts</p>
            </div>

        </div>
    )
}