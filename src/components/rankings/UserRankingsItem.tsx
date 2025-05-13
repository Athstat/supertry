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

    const hasFullName = (ranking: UserRanking) => ranking.first_name && ranking.last_name;

    if (!userRank.first_name && !userRank.last_name) {
        return;
    }
    
    return (
        <>
            <div
                className={`flex items-center p-4 ${isCurrentUser(userRank.user_id)
                    ? "bg-primary-50 dark:bg-primary-600/10"
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
                        <p>{hasFullName(userRank) ? userRank.first_name + " " + userRank.last_name : userRank.email}</p>
                    </div>
                </div>
                <div className="text-right font-semibold text-primary-600 dark:text-primary-400">
                    {userRank.total_score ? Math.floor(userRank.total_score) : "-"}
                </div>
            </div>
        </>
    )
}
