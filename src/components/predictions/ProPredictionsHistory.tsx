/** Render User Pro Predictions History Tab */

import useSWR from "swr";
import { useAuthUser } from "../../hooks/useAuthUser"
import { swrFetchKeys } from "../../utils/swrKeys";
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import NoContentCard from "../shared/NoContentMessage";
import { ProGameVote } from "../../types/proPredictions";
import { gamesService } from "../../services/gamesService";
import FixtureCard from "../fixtures/FixtureCard";

export default function UserProPredictionsHistoryTab() {

    const user = useAuthUser();
    const uid = (user as any)?.kc_id ?? (user as any)?.id;
    const key = swrFetchKeys.getUserProPredictionsHistoryKey(uid);
    let { data: history, isLoading, error } = useSWR(key, () => proPredictionsRankingService.getUserPredicitionHistory(uid));

    history = history ?? [];

    if (isLoading) return (
        <LoadingState />
    )

    if (error) {
        return <ErrorState
            error="Failed to load your pro predictions history"
        />
    }

    if (history.length === 0) {
        return <NoContentCard
            message="You have not made any predictions yet"
        />
    }

    return (
        <div className="" >

            <div className="flex flex-col gap-4" >
                {history.map((gameVote, index) => {
                    return <ProPredictionHistoryCard
                        gameVote={gameVote}
                        key={index}
                    />
                })}
            </div>
        </div>
    )
}

type ItemProps = {
    gameVote: ProGameVote
}

function ProPredictionHistoryCard({ gameVote }: ItemProps) {

    const key = swrFetchKeys.getProFixtureKey(gameVote.game_id)
    const { data: fixture } = useSWR(key, () => gamesService.getGameById(gameVote.game_id));

    if (!fixture) {
        return;
    }

    return (
        <FixtureCard
            fixture={fixture}
            showLogos
            showCompetition
            className="rounded-xl"
        />
    )
}
