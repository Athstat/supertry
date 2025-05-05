import { Trophy } from 'lucide-react'
import { useAuthUser } from '../../hooks/useAuthUser';
import useSWR from 'swr';
import { userRankingsService } from '../../services/userRankingsService';


export default function UserRankingCard() {

    const authUser = useAuthUser();
    const {data: userRank, isLoading} = useSWR(authUser.id, userRankingsService.getUserRankingByUserId);

    if (isLoading) return <div className='w-full h-20 bg-slate-100 dark:slate-800 animate-pulse' ></div>
    if (!userRank) return <></>

    return (
        <div className="bg-gradient-to-br from-primary-600 dark:from-primary-800 via-primary-800 to-primary-900 rounded-2xl shadow-sm p-6 mb-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white blur-2xl" />
                <div className="absolute -left-4 -bottom-8 w-32 h-32 rounded-full bg-white blur-2xl" />
            </div>

            <div className="flex items-center justify-between mb-4 relative">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-amber-300" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            User Rankings
                        </h2>
                        <p className="text-slate-50 text-lg font-semibold">
                            Total Points {userRank.total_score}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-white">#{userRank.rank}</div>
                    <div className="text-primary-100">Your Rank</div>
                </div>
            </div>
        </div>
    )
}
