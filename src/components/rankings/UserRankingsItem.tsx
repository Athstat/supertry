import { UserRanking } from "../../types/userRanking"
import { Medal, UserCircle } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
    index: number,
    userRank: UserRanking
}

export default function UserRankingsItem({ userRank }: Props) {

    const {authUser} = useAuth();

    const isCurrentUser = authUser?.kc_id === userRank.user_id;


    const isInPromotionZone = userRank.rank <= 5;
    const isInDemotionZone = userRank.rank >= 11;


    if (!userRank.first_name) {
        return;
    }

    return (
        <>
            <div
                // className={`flex items-center border dark:border-slate-700 rounded-xl bg-slate-50 border-slate-300 dark:bg-slate-800/40 p-4 my-2 ${isCurrentUser(userRank.user_id)
                //     ? " bg-slate-300  border-blue-200 dark:bg-primary-900/40"
                //     : "hover:bg-gray-50 dark:hover:bg-gray-700/10"
                //     } ${isInPromotionZone(userRank.rank)
                //         ? "border-l-4 !border-l-green-500"
                //         : isInDemotionZone(userRank.rank)
                //             ? "border-l-4 !border-l-red-500"
                //             : ""
                //     }`}

                className={twMerge(
                    "flex items-center border dark:border-slate-700 rounded-xl bg-slate-50 border-slate-300 dark:bg-slate-800/40 p-4 my-2",
                    isCurrentUser && " bg-slate-200  border-blue-200 dark:bg-primary-900/40",
                    !isCurrentUser && "hover:bg-gray-50 dark:hover:bg-gray-700/10",
                    isInPromotionZone && "border-l-4 !border-l-green-500",
                    isInDemotionZone && "border-l-4 !border-l-red-500",
                    !isInDemotionZone && !isInPromotionZone && "border-l-4 border-l-slate-200 dark:border-l-slate-800"

                )}
            >
                <div className="w-12 flex flex-row gap-2">
                    <p className="font-semibold dark:text-white" >{userRank.total_score ? userRank.rank : "-"}</p>

                    {userRank.rank <= 3 && <Medal
                        className={twMerge(
                            'font-semibold text-gray-700 dark:text-gray-300',
                            userRank.rank === 1 && "text-yellow-500 dark:text-yellow-500",
                            userRank.rank === 2 && "text-gray-400 dark:text-gray-300",
                            userRank.rank === 3 && "text-amber-600 dark:text-amber-600"
                        )}
                    />}


                </div>
                <div className="w-8">

                </div>

                <div className="flex-1 ml-3">
                    <div className="font-medium flex flex-row items-center gap-1 dark:text-gray-100">
                        <p>{userRank.first_name}</p>
                        {isCurrentUser && <UserCircle className="w-4 h-4" />}
                    </div>
                </div>
                <div className="text-right font-semibold text-primary-600 dark:text-primary-400">
                    {userRank.total_score ? Math.floor(userRank.total_score) : "-"}
                </div>
            </div>
        </>
    )
}
