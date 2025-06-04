import { useAuthUser } from "../../hooks/useAuthUser"
import { UserRanking } from "../../types/userRanking"

type Props = {
    index: number,
    userRank: UserRanking
}

export default function UserRankingsItem({userRank} : Props) {
    
    const authUser = useAuthUser();

    const isCurrentUser = (userId: string) => {
        return authUser.id === userId;
    }

    const isInPromotionZone = (rank: number) => rank <= 5;
    const isInDemotionZone = (rank: number) => rank >= 11;


    if (!userRank.first_name) {
        return;
    }
    
    return (
        <>
            <div
                className={`flex items-center border dark:border-slate-700 rounded-xl bg-slate-100 border-slate-300 dark:bg-slate-800/40 p-4 my-2 ${isCurrentUser(userRank.user_id)
                    ? " bg-blue-200 border-blue-300 dark:bg-primary-900/40"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/10"
                    } ${isInPromotionZone(userRank.rank)
                        ? "border-l-4 !border-l-green-500"
                        : isInDemotionZone(userRank.rank)
                            ? "border-l-4 !border-l-red-500"
                            : ""
                    }`}
            >
                <div className="w-12 text-center">
                    <span
                        className={`font-semibold ${userRank.rank === 1
                            ? "text-yellow-500"
                            : userRank.rank === 2
                                ? "text-gray-400"
                                : userRank.rank === 3
                                    ? "text-amber-600"
                                    : "text-gray-700 dark:text-gray-300"
                            }`}
                    >
                        {userRank.total_score ? userRank.rank : "-"}
                    </span>
                </div>
                <div className="w-8">

                </div>

                <div className="flex-1 ml-3">
                    <div className="font-medium dark:text-gray-100">
                        <p>{userRank.first_name}</p>
                    </div>
                </div>
                <div className="text-right font-semibold text-primary-600 dark:text-primary-400">
                    {userRank.total_score ? Math.floor(userRank.total_score) : "-"}
                </div>
            </div>
        </>
    )
}
