import useSWR from "swr";
import { sbrService } from "../../../services/sbrService";
import { LoadingState } from "../../ui/LoadingState";

/** Renders the SBR Leaderboard component */
export default function SbrPredictionsTabLeaderboard() {
    const { data, isLoading: loadingRankings } = useSWR("predictions-rankings", sbrService.getPredictionsRanking);
    const rankings = (data ?? []).slice(0, 5);

    if (loadingRankings) return <LoadingState />

    return (
        <div className="w-full h-fit flex flex-col gap-2 relative" >

            {/* Overlay for Coming Soon */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm rounded-xl px-4 py-8 text-center">
                <span className="text-xl font-bold text-slate-00 dark:text-slate-white mb-2">Predictions Leaderboard Coming Soon!</span>
                {/* <span className="text-base text-slate-600 dark:text-slate-300">
                    Track your predictions, and see who truly had the best calls week by week.
                </span> */}
            </div>

            <div className="blur-xs pointer-events-none select-none">
                {!loadingRankings && <div className="grid grid-cols-1 gap-3" >
                    {rankings.map((u, index) => {
                        return (
                            <div key={index} className="flex flex-row items-center gap-3 bg-white dark:bg-slate-800/40 p-4 rounded-xl " >
                                <div className="font-bold text-blue-500 dark:text-blue-400" >
                                    <p>{index + 1}</p>
                                </div>

                                <div>
                                    <p>{u.first_name}</p>
                                    <div className="flex flex-row items-center gap-2 text-slate-700 text-xs dark:text-slate-400" >
                                        <p>Accuracy {Math.floor(u.predictions_perc * 100)}%</p>
                                        <p>Correct {u.correct_predictions}</p>
                                        <p>Wrong {u.wrong_predictions}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div>
    )
}
