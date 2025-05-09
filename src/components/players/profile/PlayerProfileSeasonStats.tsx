import { forwardRef} from "react"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { GroupedStatsGrid } from "../../shared/GroupedStatsGrid"
import { StatCard } from "../../shared/StatCard"
import { SportAction, getPlayerAggregatedStat } from "../../../types/sports_actions"
import { PlayCircleIcon, WatchIcon } from "lucide-react"

type Props = {
    player: RugbyPlayer,
    aggregatedStats: SportAction[]
}


export const PlayerProfileSeasonStats = forwardRef<HTMLDivElement, Props>(({aggregatedStats }, ref) => {

    const minutesPlayed = getPlayerAggregatedStat("MinutesPlayed", aggregatedStats);
    const starts = getPlayerAggregatedStat("Starts", aggregatedStats);

    return (
        <GroupedStatsGrid title="Season Performance" ref={ref}>
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