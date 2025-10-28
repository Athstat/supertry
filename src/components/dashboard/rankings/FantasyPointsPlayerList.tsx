import { Fragment, useMemo, useState } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { IProSeason } from "../../../types/season";
import { useFantasyPointsRankings } from "../../../hooks/fantasy/useSportActionRanking";
import RoundedCard from "../../shared/RoundedCard";
import { FantasyPointsScoredRankingItem } from "../../../types/fantasyLeagueGroups";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";
import { IProAthlete } from "../../../types/athletes";
import PlayerProfileModal from "../../player/PlayerProfileModal";
import NoContentCard from "../../shared/NoContentMessage";

type Props = {
    season?: IProSeason
}

export default function FantasyPointsScoredPlayerList({ season }: Props) {

    const { currentSeason } = useDashboard();

    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const toggleModal = () => {
        setSelectedPlayer(undefined);
    }

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
        <Fragment>
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
                                onClickPlayer={setSelectedPlayer}
                            />
                        )
                    })}
                </div>

                {rankings.length === 0 && (
                    <NoContentCard
                        message="Whoops!! Nothing to see here yet. Check again soon"
                    />
                )}
            </RoundedCard>

            {selectedPlayer && (
                <PlayerProfileModal
                    player={selectedPlayer}
                    onClose={toggleModal}
                    isOpen={true}
                />
            )}
        </Fragment>
    )
}

type RankingItemProps = {
    item: FantasyPointsScoredRankingItem,
    index: number,
    onClickPlayer: (player: IProAthlete) => void
}

function RankingItem({ item, index, onClickPlayer }: RankingItemProps) {

    const rank = index + 1;

    const handleOnClick = () => {
        if (onClickPlayer) {
            onClickPlayer(item);
        }
    }

    return (
        <div onClick={handleOnClick} className="flex flex-row gap-2" >
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
