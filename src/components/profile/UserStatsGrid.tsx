import useSWR from "swr";
import { useAuthUser } from "../../hooks/useAuthUser";
import { userRankingsService } from "../../services/userRankingsService";
import { LoadingState } from "../ui/LoadingState";


export default function UserStatsGrid() {

    const userStats = {
        totalPoints: 2456,
        currentRank: 7,
        currentDivision: 2,
        bestRank: 3,
        bestSeason: "2023/24",
        favoriteTeam: "Crusaders",
        gamesPlayed: 156,
    };

    const user = useAuthUser();
    const  {data: rank, isLoading} = useSWR(user.id, userRankingsService.getUserRankingByUserId);

    if (isLoading) return <LoadingState />

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-white">
                    Total Points
                </div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                    {rank ? rank.total_score : 0}
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
                    <p>{rank ? "#" + rank?.rank : "Unranked"}</p>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-white">
                    Best Rank
                </div>
                <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
                <p>{rank ? "#" + rank?.rank : "Unranked"}</p>
                </div>
            </div>
        </div>
    )
}
