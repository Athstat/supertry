import useSWR from "swr";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { fantasyRankingsService } from "../../../services/fantasyRankingsService";
import { LoadingState } from "../../ui/LoadingState";


export default function UserStatsGrid() {

    const user = useAuthUser();
    const  {data: rank, isLoading} = useSWR(user.id, fantasyRankingsService.getUserRankingByUserId);

    if (isLoading) return <LoadingState />

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-white">
                    Total Points
                </div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                    {rank?.total_score ? rank.total_score.toFixed(0) : "0"}
                </div>
            </div>

            {/* <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-white">
                    Current Division
                </div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                    #{userStats.currentDivision}
                </div>
            </div> */}

            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-white">
                    Current Rank
                </div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                    <p>{rank?.rank ? "#" + rank?.rank : "-"}</p>
                </div>
            </div>
            {/* <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-white">
                    Best Rank
                </div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                <p>{rank?.rank ? "#" + rank?.rank : "-"}</p>
                </div>
            </div> */}
        </div>
    )
}
