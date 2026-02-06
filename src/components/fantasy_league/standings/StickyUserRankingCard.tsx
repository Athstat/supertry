import { twMerge } from "tailwind-merge"
import { FantasySeasonRankingItem } from "../../../types/fantasyLeagueGroups"
import { smartRoundUp } from "../../../utils/intUtils"
import { User } from "lucide-react"

type Props = {
    userRanking?: FantasySeasonRankingItem,
    onClick?: () => void
}

/** Sticky User Ranking thats always at the bottom of the screen */
export default function StickyUserRankingCard({ userRanking, onClick }: Props) {

    const pointsDisplay = smartRoundUp(userRanking?.total_score) || '-';

    return (
        <div className="fixed p-4 bottom-1 left-0 w-full" >
            <div onClick={onClick} className={twMerge(
                "w-full rounded-xl bg-blue-500 dark:shadow-lg text-white shadow-black dark:bg-blue-600 cursor-pointer p-4 flex flex-col gap-2",
            )} >


                <div className="flex-row items-center gap-2 justify-between flex" >
                    <div className="flex flex-row gap-4 items-center" >
                        <div>
                            <p className="font-semibold" >{userRanking?.league_rank}</p>
                        </div>

                        <div className="flex flex-row items-center gap-2" >
                            <User className="w-4 h-4" />
                            <p>{userRanking?.username}</p>
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
