import { Medal, User } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { FantasySeasonRankingItem } from "../../../types/fantasyLeagueGroups";
import { smartRoundUp } from "../../../utils/intUtils";
import SecondaryText from "../../ui/typography/SecondaryText";

type StandingsProps = {
    ranking: FantasySeasonRankingItem;
    index: number;
    isUser?: boolean;
    hideUserScore?: boolean;
    onClick?: (member: FantasySeasonRankingItem) => void,
    showBadges?: boolean
};

/** Renders a league standing table row */
export function LeagueStandingsTableRow({ ranking, isUser, hideUserScore, index, onClick, showBadges }: StandingsProps) {

    const rank = ranking.league_rank ?? index + 1;
    const shouldHideScore = (isUser && hideUserScore) || !ranking.total_score
    const pointsDisplay = shouldHideScore ? '-' : smartRoundUp(ranking.total_score);

    const isPointsKing = ranking.league_rank === 1;

    const handleClick = () => {
        if (onClick && ranking) {
            onClick(ranking);
        }
    }

    return (
        <section
            id={isUser ? 'user-ranking' : undefined}
            className={twMerge(
                'cursor-pointer flex flex-col gap-2 hover:bg-slate-200 hover:dark:bg-slate-800/60 p-2',
                isUser && 'bg-slate-300 dark:text-white && hover:bg-slate-300 dark:bg-slate-700 hover:dark:bg-slate-700/90',
                isPointsKing && ' rounded-xl'
            )}

            onClick={handleClick}
        >


            <div className="flex flex-row items-center gap-2 justify-between px-2" >
                <div className="flex flex-row items-center gap-2">

                    <div className="flex flex-row">
                        <SecondaryText className={twMerge(
                            "w-10",
                            isUser && "text-black dark:text-white"
                        )}>
                            {/* {rank} {badge}{' '} */}
                            {rank}
                        </SecondaryText>

                    </div>

                    {isUser && (
                        <div className=" w-6 h-6 bg-blue-500 rounded-xl flex flex-col items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <p>{ranking.username ?? ranking.first_name}</p>

                        {isUser && hideUserScore && (
                            <p className={twMerge('text-xs', isUser ? 'text-white/80' : 'text-gray-500')}>
                                Claim account to see your points
                            </p>
                        )}
                    </div>

                    {showBadges && <RankingCrown isUser={isUser} ranking={ranking} />}
                </div>

                <div className="text-right">
                    <p>{pointsDisplay}</p>
                </div>
            </div>
        </section>
    );
}

type RankingCrownProps = {
    isUser?: boolean,
    ranking: FantasySeasonRankingItem
}

function RankingCrown({ isUser, ranking }: RankingCrownProps) {

    const rankType = ranking.league_rank === 1 ? 'gold' :
        ranking.league_rank === 2 ? 'silver' :
            ranking.league_rank === 3 ? 'bronze' : 'none';

    if (rankType === "none") {
        return null;
    }

    return (
        <div className={twMerge(
            "w-fit px-2 py-1 bg-gradient-to-r from-[#1196F5] to-[#1196F5] text-white dark:text-white rounded-full flex flex-row items-center gap-2",
            isUser && 'from-white to-white text-[#1196F5] dark:text-[#1196F5]',
            rankType === 'gold' && 'from-[#FFC603] to-[#d29402] text-black dark:text-black',
            rankType === 'silver' && 'from-[#a8a8a8] to-[#848484] text-white dark:text-white',
            rankType === 'bronze' && 'from-[#8c5304] to-[#e66305] text-white dark:text-white',
        )} >
            <Medal className="w-4 h-4" />
        </div>
    )
}