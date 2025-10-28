import { useMemo } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { IProSeason } from "../../../types/season"
import { useSportActionRankings } from "../../../hooks/fantasy/useSportActionRanking";
import { PlayerSportActionRankingItem } from "../../../types/fantasyLeagueGroups";
import SecondaryText from "../../shared/SecondaryText";
import PlayerMugshot from "../../shared/PlayerMugshot";
import TeamLogo from "../../team/TeamLogo";
import RoundedCard from "../../shared/RoundedCard";

type Props = {
    season?: IProSeason,
    actionName: string,
    title: string
}

/** Renders a sports action ranking card */
export default function SportActionRankingsList({ season, actionName, title }: Props) {

    const { currentSeason } = useDashboard();

    const finalSeason = useMemo(() => {
        return season ?? currentSeason
    }, [season, currentSeason]);

    const { rankings, isLoading } = useSportActionRankings(finalSeason?.id ?? "", actionName);

    if (!finalSeason) {
        return;
    }

    if (isLoading) {
        return (
            <>
                <RoundedCard className=" h-[380px] animate-pulse border-none rounded-xl p-4 flex flex-col gap-2" ></RoundedCard>
            </>
        )
    }

    return (
        <RoundedCard className=" h-[380px] rounded-xl p-4 flex flex-col gap-2" >
            <div>
                <p className="font-semibold">{title}</p>
            </div>

            <div className="flex flex-col items-center gap-2" >
                {rankings.map((r, index) => {
                    return (
                        <PlayerRankingCard
                            item={r}
                            index={index}
                            key={r.tracking_id}
                        />
                    )
                })}
            </div>
        </RoundedCard>
    )
}

type RankingCardProps = {
    item: PlayerSportActionRankingItem,
    index: number
}

function PlayerRankingCard({ item, index }: RankingCardProps) {
    const rank = index + 1;

    return (
        <div className="flex flex-col w-full" >

            <div className="flex flex-row items-center gap-4" >
                <div>
                    <SecondaryText>#{rank}</SecondaryText>
                </div>

                <div className="flex flex-row items-center gap-2" >
                    <PlayerMugshot className="w-14 bg-blue-600 h-14" url={item.image_url} />
                    <TeamLogo className="w-8 h-8" url={item.team?.image_url} />
                </div>

                <div>
                    <p className="text-sm" >{item.player_name}</p>
                    <SecondaryText className="text-xs" >{item.team?.athstat_name}</SecondaryText>
                </div>

                <div className="flex-1 w-full flex mr-4 flex-row items-center justify-end" >
                    <p className="font-bold text-md" >{item.action_count}</p>
                </div>
            </div>


        </div>
    )
}