import { useMemo } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { IProSeason } from "../../../types/season";
import { useMostSelectedPlayers } from "../../../hooks/fantasy/useSportActionRanking";
import RoundedCard from "../../shared/RoundedCard";
import { MostSelectedRankingItem } from "../../../types/fantasyLeagueGroups";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    season?: IProSeason
}

export default function MostSelectedPlayersList({ season }: Props) {

    const { currentSeason } = useDashboard();

    const finalSeason = useMemo(() => {
        return season || currentSeason;
    }, [currentSeason, season]);

    const { rankings, isLoading } = useMostSelectedPlayers(
        finalSeason?.id ?? '',

    );

    if (!finalSeason) {
        return;
    }

    if (isLoading) {
        return (
            <>
                <RoundedCard className="p-4 h-[190px] animate-pulse border-none flex flex-col gap-2" ></RoundedCard>
            </>
        )
    }

    return (
        <RoundedCard className="p-4 h-[190px] flex flex-col gap-2" >

            <div>
                <p className="font-semibold" >Most Selected Players</p>
            </div>

            <div className="flex flex-row no-scrollbar items-center overflow-x-auto overflow-y-hidden gap-4" >
                {rankings.map((r) => {
                    return (
                        <RankingItem
                            item={r}
                            key={r.tracking_id}
                        />
                    )
                })}
            </div>
        </RoundedCard>
    )
}

type RankingItemProps = {
    item: MostSelectedRankingItem
}

function RankingItem({ item }: RankingItemProps) {
    return (
        <div>
            <div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1" >
                <PlayerMugshot
                    url={item.image_url}
                    className="w-20 h-20 bg-blue-500"
                />

                <div>
                    <p className="text-xs text-center text-nowrap" >{item.athstat_lastname}</p>
                </div>

                <SecondaryText className="text-xs" >{item.percentage_selected}%</SecondaryText>
            </div>
        </div>
    )
}
