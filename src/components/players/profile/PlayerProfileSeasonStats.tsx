import { forwardRef, useCallback } from "react"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { GroupedStatsGrid } from "../../shared/GroupedStatsGrid"
import { useAsync } from "../../../hooks/useAsync"
import { athleteSportActionsService } from "../../../services/athleteSportsActions"
import { ErrorState } from "../../ui/ErrorState"
import { StatCard } from "../../shared/StatCard"
import { AthleteSportsActionAggregated } from "../../../types/sports_actions"
import { PlayCircleIcon, WatchIcon } from "lucide-react"

type Props = {
    player: RugbyPlayer
}

export const PlayerProfileSeasonStats = forwardRef<HTMLDivElement, Props>(({ player }, ref) => {

    const fetchData = useCallback(async () => {
        return athleteSportActionsService.getByAthlete(player.tracking_id ?? "");
    }, []);

    const { data: aggregatedStats, error } = useAsync<AthleteSportsActionAggregated[]>(fetchData);

    if (error || !aggregatedStats) return <ErrorState error="Something went wrong" message={"Failed to load season stats"} />

    const getStat = (key: string) => {
        const filteredList = aggregatedStats.filter(stat => {
            return stat.action.toLowerCase() === key.toLowerCase();
        });

        if (filteredList.length > 0) {
            return filteredList[0];
        }

        return undefined;

    }

    console.log(aggregatedStats.map(s => s.action));


    const minutesPlayed = getStat("MinutesPlayed");
    const starts = getStat("Starts");

    return (
        <GroupedStatsGrid title="Season Stats" ref={ref}>
            {minutesPlayed && <StatCard
                label="Minutes Played"
                value={minutesPlayed.action_count}
                icon={<WatchIcon className="text-blue-500" size={20} />}
            />}

            {starts && <StatCard
                label="Starts"
                value={starts.action_count}
                icon={<PlayCircleIcon className="text-blue-500" size={20} />}
            />}
        </GroupedStatsGrid>
    )
}
)