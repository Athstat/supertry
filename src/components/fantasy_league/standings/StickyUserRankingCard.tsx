import { twMerge } from "tailwind-merge"
import { FantasySeasonRankingItem } from "../../../types/fantasyLeagueGroups"
import { smartRoundUp } from "../../../utils/intUtils"
import UserAvatarCard from "../../auth/user_profile/avatar/UserAvatarCard"

type Props = {
    userRanking?: FantasySeasonRankingItem,
    onClick?: () => void
}

/** Sticky User Ranking thats always at the bottom of the screen */
export default function StickyUserRankingCard({ userRanking, onClick }: Props) {

    const pointsDisplay = smartRoundUp(userRanking?.league_points ?? userRanking?.total_score) || '-';

    return (
        <div className="fixed p-4 bottom-1 left-0 z-[10] w-full flex flex-col items-center justify-center" >
            <div onClick={onClick} className={twMerge(
                "w-full lg:w-1/3 rounded-md bg-blue-500 dark:shadow-lg text-white shadow-black dark:bg-blue-600 cursor-pointer p-4 flex flex-col gap-2",
            )} >


                <div className="flex-row items-center gap-2 justify-between flex" >

                    <div className="flex flex-row gap-4 items-center w-3/4 overflow-x-clip" >
                        <div>
                            <p className="font-semibold" >{userRanking?.league_rank}</p>
                        </div>

                        <div className="flex flex-row items-center gap-2 " >
                            <UserAvatarCard 
                                imageUrl={userRanking?.avatar_url}
                                className="w-[35px] h-[35px] border-none"
                                iconCN="w-4 h-4"
                            />
                            <p className="text-sm w-2/5 truncate" >{userRanking?.username}</p>
                        </div>
                    </div>
                    <div>
                        <p className="" >{pointsDisplay}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
