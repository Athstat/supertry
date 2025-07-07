import useSWR from "swr"
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingState } from "../ui/LoadingState";
import { ProPredictionsRanking } from "../../types/proPredictions";
import SecondaryText from "../shared/SecondaryText";
import { twMerge } from "tailwind-merge";
import { useAuthUser } from "../../hooks/useAuthUser";
import { User } from "lucide-react";

export default function ProPredictionsLeaderboard() {

    const user = useAuthUser();
    const key = `pro-predictions-rankings`
    let {data: rankings, isLoading} = useSWR(key, () => proPredictionsRankingService.getAllUserRankings());

    if (isLoading) {
        return <LoadingState />
    }

    rankings = rankings ?? [];

    return (
        <div className="flex flex-col gap-2 p-3" >
            {rankings.map((r, index) => {
                return <LeaderboardItem 
                    ranking={r}
                    key={index}
                    isUser={user.id === r.user_id}
                />
            })}
    </div>
    )
}

type LeaderboardItemProps = {
    ranking: ProPredictionsRanking,
    isUser?: boolean
}

function LeaderboardItem({ranking, isUser} : LeaderboardItemProps) {

    return (
        <div className={twMerge(
            "p-4 rounded-xl flex flex-row items-center gap-4 bg-white border border-slate-300",
            'dark:bg-slate-800/40 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
            isUser && "dark:bg-primary-500 hover:animate-glow dark:hover:animate-glow dark:hover:bg-primary-500 hover:bg-primary-500 bg-primary-500 border border-primary-200dark:border-primary-400"
        )}>
            
            <div>
                <p className={twMerge(
                    "text-lg font-bold text-blue-500",
                    isUser && 'text-primary-100'
                )} >{ranking.rank ?? '-'}</p>
            </div>

            <div className="flex flex-col items-start" >
                <p className={twMerge("font-bold", isUser && 'text-white')} >{ranking.username}</p>
                <div className="flex flex-row items-center gap-2 flex-wrap" >
                    <SecondaryText className={twMerge(isUser && 'dark:text-white text-white')} >Attempts <strong>{ranking.predictions_made ?? '-'}</strong></SecondaryText>
                    <SecondaryText className={twMerge(isUser && 'dark:text-white text-white')} >Correct <strong>{ranking.correct_predictions ?? '-'}</strong></SecondaryText>
                </div>
            </div>

            <div className="flex flex-1 items-end justify-end" >
                {isUser ? 
                <div className="flex flex-row bg-white rounded-xl text-primary-500 items-center justify-center px-2 py-0.5 gap-1" >
                    <p className="text-sm" >Me</p>
                    <User className="w-4 h-4" />
                </div>    
             : undefined}
            </div>

        </div>
    )
}
