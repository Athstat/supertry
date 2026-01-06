/** Render User Pro Predictions History Tab */

import useSWR from "swr";
import { useAuthUser } from "../../hooks/useAuthUser"
import { swrFetchKeys } from "../../utils/swrKeys";
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { ErrorState } from "../ui/ErrorState";
import NoContentCard from "../shared/NoContentMessage";
import { ProGameVote } from "../../types/proPredictions";
import { gamesService } from "../../services/gamesService";
import FixtureCard from "../fixture/FixtureCard";
import RoundedCard from "../shared/RoundedCard";

export default function UserProPredictionsHistoryTab() {

    const user = useAuthUser();
    const userId = user?.kc_id ?? "";
    const key = swrFetchKeys.getUserProPredictionsHistoryKey(userId);
    const { data, isLoading, error } = useSWR(key, () => proPredictionsRankingService.getUserPredicitionHistory(userId));

    const history = data ?? [];

    if (isLoading) return (
        <LoadingIndicator />
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
                {history.map((gameVote) => {
                    return <ProPredictionHistoryCard
                        gameVote={gameVote}
                        key={gameVote.id}
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
    const { data: fixture, isLoading } = useSWR(key, () => gamesService.getGameById(gameVote.game_id));

    if (isLoading) {
        return <RoundedCard className="w-full bg-slate-200 h-[268px] animate-pulse border-none" />
    }

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
