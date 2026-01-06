import { CircleCheck, Info, Sparkles} from "lucide-react";
import { sbrService } from "../../../services/sbr/sbrService";
import { UserPredictionsRanking } from "../../../types/sbr";
import { BowArrow } from "lucide-react";
import { XCircle } from "lucide-react";
import { Percent } from "lucide-react";
import SbrPredictionsTabLeaderboard from "./SbrPredictionsTabLeaderboard";
import { useAuth } from "../../../contexts/AuthContext";
import useSWR from "swr";

export default function SbrPredictionsTab() {

  const {authUser: user} = useAuth();
  const userId = user?.kc_id;

  const key = userId ? `/users/${userId}/predictions-ranking` : null;
  const { data: userRank, isLoading: loadingUserRank } = useSWR(key, () => sbrService.getUserPredictionsRanking(userId || ""))

  return (
    <div className="flex flex-col gap-3" >
      <div className="flex flex-row items-center gap-2 mb-5" >
        <Sparkles />
        <h1 className="text-xl font-bold" >Predictions</h1>
      </div>

      <h1 className="text-lg font-medium " >Predictions Summary</h1>

      {loadingUserRank &&
        <div className="w-full h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" >

        </div>
      }

      {!loadingUserRank && userRank &&
        <UserPredictionsRankCard userRank={userRank} />
      }

      <div className="bg-yellow-100 dark:bg-yellow-800/40 border text-yellow-700 dark:text-yellow-700 text-sm flex flex-row items-center gap-2 border-yellow-200 dark:border-yellow-700 rounded-xl p-4" >
        <div className="w-fit" >
          <Info className="" />
        </div>
        Your predictions summary is based of completed fixtures and doesn't include pending or upcoming fixtures.
      </div>

      <h1 className="text-lg font-medium mt-5" >Leaderboard - Top 15</h1>
      <SbrPredictionsTabLeaderboard />

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
        {/* <div className="flex flex-row items-center gap-2 w-fit" >
          <Trophy className="w-4 h-4 text-amber-500" />
          <p>Rank <strong>#{userRank.user_rank}</strong></p>
        </div> */}

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