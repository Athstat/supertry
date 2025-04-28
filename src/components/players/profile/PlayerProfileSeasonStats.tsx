import { forwardRef, useCallback } from "react"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { GroupedStatsGrid } from "../../shared/GroupedStatsGrid"
import { useAsync } from "../../../hooks/useAsync"
import { athleteSportActionsService } from "../../../services/athleteSportsActions"
import { ErrorState } from "../../ui/ErrorState"

type Props = {
    player: RugbyPlayer
}

export const PlayerProfileSeasonStats = forwardRef<HTMLDivElement, Props>(({ player }, ref) => {

    const fetchData = useCallback(async () => {
        return athleteSportActionsService.getByAthlete(player.tracking_id ?? "");
    }, []);

    const {data, error} = useAsync<any>(fetchData);

    if (error) return <ErrorState error="Something went wrong" message={"Failed to load season stats"} />

    return (
        <GroupedStatsGrid title="Season Stats" ref={ref}>
            {error && <p>Error loading season stats</p>}
            {data && 
                <p>Data Loaded successfully</p>
            }
        </GroupedStatsGrid>
    )
}
)