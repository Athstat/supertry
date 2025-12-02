import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys"
import RoundedCard from "../shared/RoundedCard"
import { seasonService } from "../../services/seasonsService";
import { useSeason } from "../../hooks/seasons/useSeason";
import { useMemo } from "react";
import { SeasonStandingsItem } from "../../types/season";
import TeamLogo from "../team/TeamLogo";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../shared/SecondaryText";

type Props = {
    seasonId?: string,
    highlightTeamIds?: string[],
    filterTeamIds?: string[],
    showSeasonName?: boolean
}

export default function SeasonStandingsTable({ seasonId, highlightTeamIds = [], filterTeamIds = [], showSeasonName }: Props) {

    const { season, isLoading: loadingSeason } = useSeason(seasonId);

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
                        <tr className="text-slate-700 border-b dark:border-slate-700 dark:text-slate-300 font-normal" >
                            <th className="font-semibold text-sm px-4 py-2 max-w-[2px]" >Pos</th>
                            <th className="font-semibold text-sm px-4 py-2" >Team</th>
                            <th className="font-semibold text-sm px-4 py-2" >P</th>
                            <th className="font-semibold text-sm px-4 py-2" >W</th>
                            <th className="font-semibold text-sm px-4 py-2" >D</th>
                            <th className="font-semibold text-sm px-4 py-2" >L</th>
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
                <p className="text-sm" >{item.team.athstat_name}</p>
            </td>
            <td className="px-4 py-2 text-sm" >{item.total_games_played}</td>
            <td className="px-4 py-2 text-sm" >{item.wins}</td>
            <td className="px-4 py-2 text-sm" >{item.draws}</td>
            <td className="px-4 py-2 text-sm" >{item.losses}</td>
        </tr>
    )
}
