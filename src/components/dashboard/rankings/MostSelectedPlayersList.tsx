import { Fragment, useMemo, useState } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { IProSeason } from "../../../types/season";
import { useMostSelectedPlayers } from "../../../hooks/fantasy/useSportActionRanking";
import RoundedCard from "../../shared/RoundedCard";
import { MostSelectedRankingItem } from "../../../types/fantasyLeagueGroups";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";
import { IProAthlete } from "../../../types/athletes";
import PlayerProfileModal from "../../player/PlayerProfileModal";
import NoContentCard from "../../shared/NoContentMessage";
import TeamLogo from "../../team/TeamLogo";

type Props = {
    season?: IProSeason
}

export default function MostSelectedPlayersList({ season }: Props) {

    const { currentSeason } = useDashboard();

    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const toggleModal = () => {
        setSelectedPlayer(undefined);
    }

    const finalSeason = useMemo(() => {
        return season || currentSeason;
    }, [currentSeason, season]);

    const { rankings, isLoading } = useMostSelectedPlayers(
        finalSeason?.id ?? '',
        3
    );

    if (!finalSeason) {
        return;
    }

    if (isLoading) {
        return (
            <>
                <RoundedCard className="p-4 h-[250px] animate-pulse border-none flex flex-col gap-2" ></RoundedCard>
            </>
        )
    }

    return (
        <Fragment>

            <RoundedCard className="p-4 h-[250px] flex flex-col gap-2" >

                <div>
                    <p className="font-semibold" >Most Selected Players</p>
                </div>

                <div className="flex flex-col gap-2" >
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

            {
                selectedPlayer && (
                    <PlayerProfileModal
                        player={selectedPlayer}
                        onClose={toggleModal}
                        isOpen={true}
                    />
                )
            }

        </Fragment>
    )
}

type RankingItemProps = {
    item: MostSelectedRankingItem,
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
                    <p className="font-bold text-md" >{item.percentage_selected}%</p>
                </div>
            </div>


        </div>
    )
}
