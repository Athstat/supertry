import { ArrowUp, ArrowDown } from "lucide-react";
import useSWR from "swr";
import { useAuthUser } from "../../hooks/useAuthUser";
import { userRankingsService } from "../../services/userRankingsService";
import { LoadingState } from "../ui/LoadingState";
import { UserRanking } from "../../types/userRanking";
import UserRankingFocusShort from "./UserRankingFocusShort";

export default function UserRankingsLeaderBoard() {

    const authUser = useAuthUser();
    const {data: rankings, isLoading} = useSWR([1, 15], userRankingsService.getUserRankings);
    
    if (isLoading) return <LoadingState  />

    const isCurrentUser = (userId: string) => {
        return authUser.id === userId;
    }

    const isInPromotionZone = (rank: number) => rank <= 5;
    const isInDemotionZone = (rank: number) => rank >= 11;

    if (!rankings) return <></>

    let shortList = rankings;

    shortList = shortList.slice(0, 15);

    const hasFullName = (ranking: UserRanking) => ranking.first_name && ranking.last_name;
 
    return (
        <div>
            <div className="bg-white dark:bg-gray-800/40 rounded-2xl shadow-sm overflow-hidden">
                <div className="">
                    {shortList.map((user, index) => (

                        <>
                            {index === 5 && (
                                <div className="px-4 py-2">
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                                        <ArrowUp className="w-4 h-4 stroke-[3]" />
                                        Promotion Zone
                                        <ArrowUp className="w-4 h-4 stroke-[3]" />
                                    </p>
                                </div>
                            )}
                            {index === 10 && (
                                <div className="px-4 py-2">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-2">
                                        <ArrowDown className="w-4 h-4 stroke-[3]" />
                                        Demotion Zone
                                        <ArrowDown className="w-4 h-4 stroke-[3]" />
                                    </p>
                                </div>
                            )}
                            <div
                                key={index}
                                className={`flex items-center p-4 ${isCurrentUser(user.user_id)
                                    ? "bg-primary-50 dark:bg-primary-600/10"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/10"
                                    } ${isInPromotionZone(user.rank)
                                        ? "border-l-4 !border-l-green-500"
                                        : isInDemotionZone(user.rank)
                                            ? "border-l-4 !border-l-red-500"
                                            : ""
                                    }`}
                            >
                                <div className="w-12 text-center">
                                    <span
                                        className={`font-semibold ${user.rank === 1
                                            ? "text-yellow-500"
                                            : user.rank === 2
                                                ? "text-gray-400"
                                                : user.rank === 3
                                                    ? "text-amber-600"
                                                    : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {user.rank}
                                    </span>
                                </div>
                                <div className="w-8">
                                    
                                </div>
                                
                                <div className="flex-1 ml-3">
                                    <div className="font-medium dark:text-gray-100">
                                        <p>{hasFullName(user) ? user.first_name + " " + user.last_name : user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right font-semibold text-primary-600 dark:text-primary-400">
                                    {user.total_score}
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </div>

            <UserRankingFocusShort rankings={rankings} />

            {/* Bottom Section */}
            <div className="mt-6 space-y-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Top 5 players will be promoted to Division {0}.
                    Bottom 5 players will be demoted to Division {0}.
                </p>
            </div>
        </div>
    )
}
