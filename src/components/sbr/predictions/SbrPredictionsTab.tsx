import { CircleCheck, Sparkles, Target, Trophy } from "lucide-react";
import { sbrService } from "../../../services/sbrService";
import useSWR from "swr";
import { LoadingState } from "../../ui/LoadingState";
import { useFetch } from "../../../hooks/useFetch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { UserPredictionsRanking } from "../../../types/sbr";
import { BowArrow } from "lucide-react";
import { XCircle } from "lucide-react";
import { Percent } from "lucide-react";


export default function SbrPredictionsTab() {

  const user = useAuthUser();
  const { data, isLoading: loadingRankings } = useSWR("predictions-rankings", sbrService.getPredictionsRanking);
  const rankings = (data ?? []).slice(0, 15);

  const { data: userRank, isLoading: loadingUserRank } = useFetch("user-predictions-ranking", user.id, sbrService.getUserPredictionsRanking)

  return (
    <div className="flex flex-col gap-3" >
      <div className="flex flex-row items-center gap-2" >
        <Sparkles />
        <h1 className="text-xl font-bold" >Predictions</h1>
      </div>

      {loadingUserRank && <div className="w-full h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" >
      </div>}

      {!loadingUserRank && userRank && <UserPredictionsRankCard userRank={userRank} />}

      <h2 className="text-lg font-bold" >Leaderboard - Top 15</h2>
      {/* {JSON.stringify(data)} */}
      {loadingRankings && <LoadingState />}
      {!loadingRankings && <div className="grid grid-cols-1 gap-3" >
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
      </div>}
    </div>
  )
}

type UserRankProps = {
  userRank: UserPredictionsRanking
}

function UserPredictionsRankCard({ userRank }: UserRankProps) {
  return (
    <div className="flex flex-col p-5 bg-white dark:bg-slate-800/50 gap-2 rounded-xl border border-slate-100 dark:border-slate-700" >
      <div className="flex flex-row items-center gap-2" >
        <p className="text-2xl font-semibold" >{userRank.first_name}</p>
      </div>

      <div className="flex flex-col text-slate-700 dark:text-slate-300" >
        <div className="flex flex-row items-center gap-2 w-fit" >
          <Trophy className="w-4 h-4 text-amber-500" />
          <p>Rank <strong>#{userRank.user_rank}</strong></p>
        </div>

        <div className="flex flex-row items-center gap-2 w-fit" >
          <BowArrow className="w-4 h-4 text-amber-500" />
          <p><strong>{userRank.predictions_made}</strong> Total Predictions</p>
        </div>

        <div className="flex flex-row items-center gap-2 w-fit" >
          <CircleCheck className="w-4 h-4 text-amber-500" />
          <p><strong>{userRank.correct_predictions}</strong> Correct Predictions</p>
        </div>

        <div className="flex flex-row items-center gap-2 w-fit" >
          <XCircle className="w-4 h-4 text-amber-500" />
          <p><strong>{userRank.wrong_predictions}</strong> Wrong Predictions</p>
        </div>

        {userRank.predictions_perc && <div className="flex flex-row items-center gap-2 w-fit" >
          <Percent className="w-4 h-4 text-amber-500" />
          <p><strong>{Math.floor(userRank.predictions_perc * 100)}%</strong> Accuracy</p>
        </div>}
      </div>
    </div>
  )
}