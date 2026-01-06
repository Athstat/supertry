import useSWR from "swr"
import { proPredictionsRankingService } from "../../services/proPredictionsRankings";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { ProPredictionsRanking } from "../../types/proPredictions";
import SecondaryText from "../ui/typography/SecondaryText";
import { twMerge } from "tailwind-merge";
import { User } from "lucide-react";
import { isEmail } from "../../utils/stringUtils";
import NoContentCard from "../ui/typography/NoContentMessage";
import { useAuth } from "../../contexts/AuthContext";
import { useMemo } from "react";

// TODO: Reuse or Deprecate component
export default function ProPredictionsLeaderboard() {

    const { authUser: user } = useAuth();
    const key = `pro-predictions-rankings`;
    const { data, isLoading } = useSWR(key, () => proPredictionsRankingService.getAllUserRankings());

    const rankings = useMemo(() => data || [], [data]);
    let rankingsList = rankings !== undefined ? rankings : []

    rankingsList = rankingsList.sort((a, b) => {
        const aN = a.rank ?? rankingsList.length;
        const bN = b.rank ?? rankingsList.length;

        return aN - bN;
    });

    const rankedUsers = rankingsList.filter((r) => {
        return r.rank && r.rank > 0;
    });

    const unRankedUsers = rankingsList.filter((r) => {
        return r.rank === undefined || r.rank === null || r.rank === 0;
    });

    const shouldHide = (r: ProPredictionsRanking) => {
        return isEmail(r.username) && r.user_id !== user?.kc_id;
    }

    const isEmpty = rankingsList.length === 0;

    if (isLoading) {
        return <LoadingIndicator />
    }

    return (
        <div className="flex flex-col gap-4 " >

            <div className="flex flex-col gap-2 " >
                {rankedUsers.map((r, index) => {

                    if (shouldHide(r)) {
                        return;
                    }

                    return <LeaderboardItem
                        ranking={r}
                        key={index}
                        isUser={user?.kc_id === r.user_id}
                    />
                })}
            </div>

            {unRankedUsers.length > 0 && <p className="font-bold text-lg" >Unranked</p>}

            <div className="flex flex-col gap-2 " >
                {unRankedUsers.map((r, index) => {

                    if (shouldHide(r)) {
                        return;
                    }

                    return <LeaderboardItem
                        ranking={r}
                        key={index}
                        isUser={user?.kc_id === r.user_id}
                    />
                })}
            </div>

            {/* {isRanked && (
                <div className="flex flex-row items-end justify-end p-4 fixed bottom-20 left-0 w-full" >
                    <button onClick={onJumpToRanking} className="p-2 rounded-full bg-primary-500 text-white cursor-pointer hover:bg-primary-600 hover:animate-glow w-fit" >
                        <User />
                    </button>
                </div>
            )} */}

            {isEmpty && (
                <NoContentCard
                    message="No pro predictions rankings available right now"
                />
            )}
        </div>
    )
}

type LeaderboardItemProps = {
    ranking: ProPredictionsRanking,
    isUser?: boolean
}

function LeaderboardItem({ ranking, isUser }: LeaderboardItemProps) {

    return (
        <section id={isUser ? 'my-rank-section' : undefined}>
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
        </section>
    )
}
