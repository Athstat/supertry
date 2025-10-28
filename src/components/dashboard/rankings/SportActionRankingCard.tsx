import { Fragment, useMemo, useState } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { IProSeason } from "../../../types/season"
import { useSportActionRankings } from "../../../hooks/fantasy/useSportActionRanking";
import { PlayerSportActionRankingItem } from "../../../types/fantasyLeagueGroups";
import SecondaryText from "../../shared/SecondaryText";
import PlayerMugshot from "../../shared/PlayerMugshot";
import TeamLogo from "../../team/TeamLogo";
import RoundedCard from "../../shared/RoundedCard";
import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import PlayerProfileModal from "../../player/PlayerProfileModal";
import NoContentCard from "../../shared/NoContentMessage";

type Props = {
    season?: IProSeason,
    actionName: string,
    title: string,
    className?: string
}

/** Renders a sports action ranking card */
export default function SportActionRankingsList({ season, actionName, title, className }: Props) {

    const { currentSeason } = useDashboard();
    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const toggleModal = () => {
        setSelectedPlayer(undefined);
    }

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
                <RoundedCard className={twMerge(
                    " h-[380px] animate-pulse border-none rounded-xl p-4 flex flex-col gap-2",
                    className
                )} ></RoundedCard>
            </>
        )
    }

    return (
        <Fragment>
            <RoundedCard className={twMerge(
                " h-[380px] rounded-xl p-4 flex flex-col gap-2",
                className
            )}>
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
                                onClickPlayer={setSelectedPlayer}
                            />
                        )
                    })}
                </div>
                
                {rankings.length === 0  && (
                    <NoContentCard 
                        message="Whoops!! Nothing to see here yet. Check again soon"
                    />
                )}

            </RoundedCard>

            {selectedPlayer && (
                <PlayerProfileModal 
                    player={selectedPlayer}
                    isOpen={true}
                    onClose={toggleModal}
                />
            )}
        </Fragment>
    )
}

type RankingCardProps = {
    item: PlayerSportActionRankingItem,
    index: number,
    onClickPlayer: (player: IProAthlete) => void
}

function PlayerRankingCard({ item, index, onClickPlayer }: RankingCardProps) {
    const rank = index + 1;

    const handleOnClick = () => {
        if (onClickPlayer) {
            onClickPlayer(item);
        }
    }

    return (
        <div className="flex flex-col w-full" >
 
            <div onClick={handleOnClick} className="flex cursor-pointer flex-row items-center gap-4" >
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