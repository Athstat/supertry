import useSWR from "swr"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { powerRankingsService } from "../../../services/powerRankingsService"
import { LoadingState } from "../../ui/LoadingState"

type Props = {
    player: RugbyPlayer
}

export default function PlayerMatchsPRList({ player }: Props) {

    const {data, isLoading, error} = useSWR(`player-matches-pr/${player.tracking_id}`, 
        () => powerRankingsService.getPastMatchsPowerRankings(player.tracking_id ?? "")
    );

    const matchesPR: any[] = data ?? [];

    if (isLoading) return <LoadingState />

    return (
        <div>{matchesPR.map((a) => {
            return <p>{a.game_id}</p>
        })}</div>
    )
}
