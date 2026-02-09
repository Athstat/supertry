import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys"
import { seasonService } from "../../services/seasonsService";
import { useSeason } from "../../hooks/seasons/useSeason";
import { useMemo } from "react";
import { SeasonStandingsItem } from "../../types/season";
import TeamLogo from "../team/TeamLogo";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../ui/typography/SecondaryText";
import RoundedCard from "../ui/cards/RoundedCard";
import { trimTeamName } from "../../utils/stringUtils";
import { useTooltip } from "../../hooks/ui/useTooltip";

type Props = {
    seasonId?: string,
    highlightTeamIds?: string[],
    filterTeamIds?: string[],
    showSeasonName?: boolean
}

export default function SeasonStandingsTable({ seasonId, highlightTeamIds = [], filterTeamIds = [], showSeasonName }: Props) {

    const { season, isLoading: loadingSeason } = useSeason(seasonId);
    const { openTooltipModal } = useTooltip();

    const key = seasonId ? swrFetchKeys.getSeasonStandings(seasonId) : null;
    const { data, isLoading: loadingStandings } = useSWR(key, () => seasonService.getSeasonStandings(seasonId ?? ""));

    const isLoading = loadingSeason || loadingStandings;

    const standings = useMemo(() => {
        const arr = (data ?? []);

        if (filterTeamIds.length > 0) {
            return arr.filter((s) => filterTeamIds.includes(s.team_id));
        }

        return arr;
    }, [data, filterTeamIds]);

    const handleClickColumn = (title?: string, description?: string) => {
        openTooltipModal(title, description);
    }

    if (isLoading) {
        return (
            <RoundedCard className="w-full h-[300px] rounded-xl border-none animate-pulse" />
        )
    }

    return (
        <div className="flex flex-col gap-2">

            {showSeasonName && <div>
                <p className="text-sm font-semibold" >{season?.name}</p>
            </div>}

            <RoundedCard
                className=" dark:border-none flex flex-col gap-2"
            >

                <table>
                    <thead className="" >
                        <tr className="text-slate-700 cursor-pointer border-b dark:border-slate-700 dark:text-slate-300 font-normal" >
                            <th
                                className="font-semibold text-sm px-4 py-2 max-w-[2px]"
                                onClick={() => handleClickColumn("Position", "The teams position on the league standings")}
                            >
                                Pos
                            </th>
                            <th
                                className="font-semibold text-sm px-4 py-2"
                            >
                                Team
                            </th>
                            <th
                                className="font-semibold text-sm px-4 py-2"
                                onClick={() => handleClickColumn("Matches Played", "The number of matches played by a team")}
                            >
                                MP
                            </th>
                            <th
                                className="font-semibold text-sm px-4 py-2"
                                onClick={() => handleClickColumn("Wins", "The number of matches won by a team")}
                            >
                                W
                            </th>
                            <th
                                className="font-semibold text-sm px-4 py-2"
                                onClick={() => handleClickColumn("Draws", "The number of matches drawn by a team")}
                            >
                                D
                            </th>
                            <th
                                className="font-semibold text-sm px-4 py-2"
                                onClick={() => handleClickColumn("Losses", "The number of matches lost by a team")}
                            >
                                L
                            </th>
                            <th
                                className="font-semibold text-sm px-4 py-2"
                                onClick={() => handleClickColumn("Points", "The number of points earned by a team")}
                            >
                                Pts
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y dark:divide-slate-700" >
                        {standings.map((s) => {
                            return (
                                <StandingsTableRow
                                    item={s}
                                    key={s.team_id}
                                    highlight={highlightTeamIds.includes(s.team_id)}
                                />
                            )
                        })}
                    </tbody>
                </table>
            </RoundedCard>
        </div>
    )
}

type RowProps = {
    item: SeasonStandingsItem,
    highlight?: boolean
}

function StandingsTableRow({ item, highlight }: RowProps) {



    return (
        <tr className={twMerge(
            highlight && "bg-slate-100 dark:bg-slate-700/50"
        )} >

            <td className="px-4 py-2 max-w-[2px]" >
                <SecondaryText>{item.rank}</SecondaryText>
            </td>

            <td className="flex flex-row items-center gap-2 px-4 py-2" >
                <TeamLogo className="w-6 h-6" url={item.team.image_url} />
                <p className="text-sm" >{trimTeamName(item.team.athstat_name)}</p>
            </td>
            <td className="px-4 py-2 text-sm" >{item.total_games_played}</td>
            <td className="px-4 py-2 text-sm" >{item.wins}</td>
            <td className="px-4 py-2 text-sm" >{item.draws}</td>
            <td className="px-4 py-2 text-sm" >{item.losses}</td>
            <td className="px-4 py-2 text-sm" >{item.traditional_points}</td>
        </tr>
    )
}
