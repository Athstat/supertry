import { useRef } from "react";
import { useScrollTo } from "../../hooks/web/useScrollTo";
import { UserRanking } from "../../types/userRanking"
import UserRankingsItem from "./UserRankingsItem";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
    rankings: UserRanking[]
}

export default function UserRankingFocusShort({ rankings }: Props) {

    const {authUser} = useAuth();

    // get user ranking
    const rankIndex = rankings.findIndex((r) => r.user_id === authUser?.kc_id);
    const userRanking = rankings[rankIndex];

    let rankingSlice = rankings;
    const start = rankIndex - 3;
    const end = rankIndex + 3;

    rankingSlice = rankingSlice.slice(start, end);

    const ref = useRef<HTMLDivElement>(null)
    useScrollTo(ref);


        if (rankIndex === -1) return;
    if (userRanking.rank <= 15) return;

    return (
        <div ref={ref} >

            <h2 className="text-lg font-bold text-black dark:text-white my-5" >Your Position</h2>


            <div className="bg-white mt-5 mb-5 dark:bg-gray-800/40 rounded-2xl shadow-sm overflow-hidden" >

                {rankingSlice.map((r, index) => {
                    return <UserRankingsItem userRank={r} key={index} index={index} />
                })}
            </div>
        </div>
    )
}
