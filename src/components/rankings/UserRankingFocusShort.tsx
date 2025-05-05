import { useAuthUser } from "../../hooks/useAuthUser"
import { UserRanking } from "../../types/userRanking"
import UserRankingsItem from "./UserRankingsItem";

type Props = {
    rankings: UserRanking[]
}

export default function UserRankingFocusShort({ rankings }: Props) {

    const authUser = useAuthUser();

    // get user ranking
    const rankIndex = rankings.findIndex((r) => r.user_id === authUser.id);

    if (rankIndex === -1) return;

    const userRanking = rankings[rankIndex];

    if (userRanking.rank <= 15) return;

    let rankingSlice = rankings;
    const start = rankIndex - 3;
    const end = rankIndex + 3;
    rankingSlice = rankingSlice.slice(start, end);

    return (
        <div>

            <h2 className="text-lg font-bold text-black dark:text-white my-5" >Your Position</h2>


            <div className="bg-white mt-5 mb-5 dark:bg-gray-800/40 rounded-2xl shadow-sm overflow-hidden" >

                {rankingSlice.map((r, index) => {
                    return <UserRankingsItem userRank={r} key={index} index={index} />
                })}
            </div>
        </div>
    )
}
