import { Sparkles } from "lucide-react";
import { sbrService } from "../../../services/sbrService";
import useSWR from "swr";
import { LoadingState } from "../../ui/LoadingState";


export default function SbrPredictionsTab() {

  const {data, isLoading} = useSWR("predictions-rankings", sbrService.getPredictionsLeaderboard);
  const rankings = (data ?? []).slice(0, 15);
  
  if (isLoading) return <LoadingState />

  return (
    <div className="flex flex-col gap-3" >
        <div className="flex flex-row items-center gap-2" >
            <Sparkles />
            <h1 className="text-xl font-bold" >Predictions</h1>
        </div>

        <div className="flex flex-col items-center justify-center p-5" >
            <p className="dark:text-slate-300 text-slate-700" >Predictions leaderboard is coming soon! 👀</p>
        </div>

        <h2 className="text-lg font-bold" >Leaderboard - Top 15</h2>
        {/* {JSON.stringify(data)} */}
        <div className="grid grid-cols-1 gap-3" >
          {rankings.map((u) => {
            return (
              <div className="flex flex-row items-center gap-3 bg-white dark:bg-slate-800/40 p-4 rounded-xl " >
                <div className="font-bold text-blue-500 dark:text-blue-400" >
                  <p>{u.user_rank}</p>
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
        </div>
    </div>
  )
}
