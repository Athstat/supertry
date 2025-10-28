import { useMemo } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { IProSeason } from "../../../types/season";
import { useFantasyPointsRankings  } from "../../../hooks/fantasy/useSportActionRanking";
import RoundedCard from "../../shared/RoundedCard";
import { FantasyPointsScoredRankingItem } from "../../../types/fantasyLeagueGroups";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    season?: IProSeason
}

export default function FantasyPointsScoredPlayerList({ season }: Props) {

    const { currentSeason } = useDashboard();

    const finalSeason = useMemo(() => {
        return season || currentSeason;
    }, [currentSeason, season]);

    const { rankings, isLoading } = useFantasyPointsRankings(
        finalSeason?.id ?? '',
        15
    );

    if (!finalSeason) {
        return;
    }

    if (isLoading) {
        return (
            <>
                <RoundedCard className="p-4 h-[160px] animate-pulse border-none flex flex-col gap-2" ></RoundedCard>
            </>
        )
    }

    return (
        <RoundedCard className="p-4 h-[160px] flex flex-col gap-3" >

            <div>
                <p className="font-semibold" >Fantasy Points Scored</p>
            </div>

            <div className="flex flex-row no-scrollbar items-center overflow-x-auto overflow-y-hidden gap-4" >
                {rankings.map((r, index) => {
                    return (
                        <RankingItem
                            item={r}
                            key={r.tracking_id}
                            index={index}
                        />
                    )
                })}
            </div>
        </RoundedCard>
    )
}

type RankingItemProps = {
    item: FantasyPointsScoredRankingItem,
    index: number
}

function RankingItem({ item, index }: RankingItemProps) {

    const rank = index + 1;

    return (
        <div className="flex flex-row gap-2" >
            <div>
                <SecondaryText className="" >#{rank}</SecondaryText>
            </div>
            <div className="flex flex-col items-center justify-center gap-1" >
                <PlayerMugshot
                    url={item.image_url}
                    className="w-14 h-14 bg-blue-500"
                />

                <div className="flex flex-col items-center justify-center" >
                    <p className="text-xs text-center text-nowrap" >{item.athstat_lastname}</p>
                    <SecondaryText className="text-xs" >{Math.floor(item.total_points)}</SecondaryText>
                </div>

            </div>
        </div>
    )
}
