import { useState } from "react";
import { useAthletes } from "../../contexts/AthleteContext"
import useAthleteFilter from "../../hooks/useAthleteFilter";
import { IProAthlete } from "../../types/athletes"
import DialogModal from "../shared/DialogModal";
import { PlayerSearch } from "./PlayerSearch";
import PlayerMugshot from "../shared/PlayerMugshot";
import SecondaryText from "../shared/SecondaryText";
import { twMerge } from "tailwind-merge";
import { useDebounced } from "../../hooks/useDebounced";
import { LoadingState } from "../ui/LoadingState";

type Props = {
    onSelectPlayers?: (players: IProAthlete[]) => void,
    open?: boolean,
    onClose?: () => void,
    exludeIds?: string[]
}

export default function QuickPlayerSelectModal({ onSelectPlayers, open, onClose }: Props) {

    const {athletes} = useAthletes();
    const [search, setSearch] = useState<string>("");

    const debouncedSearchQuery = useDebounced(search, 300);

    const {filteredAthletes, isFiltering} = useAthleteFilter({
        athletes,
        searchQuery: debouncedSearchQuery
    });

    return (
        <DialogModal
            open={open}
            onClose={onClose}
            title="Add Players"
            className="flex flex-col gap-2"
        >
            <PlayerSearch 
                searchQuery={search}
                onSearch={setSearch}
            />

            <div className="flex flex-row items-center justify-between" >
                <SecondaryText>Player</SecondaryText>
                <SecondaryText>Power Ranking</SecondaryText>
            </div>

            {isFiltering && <LoadingState />}

            <div className="flex flex-col gap-2" >
                {filteredAthletes.map((athlete, index) => {
                    return <PlayerItem
                        player={athlete}
                        key={index}
                    />
                })}
            </div>
        </DialogModal>
    )
}

type PlayerItemProps = {
    player: IProAthlete,
    onClick?: (player: IProAthlete) => void,
    isSelected?: boolean
}

function PlayerItem({player, onClick, isSelected} : PlayerItemProps) {
    return (
        <div className={twMerge(
            "flex py-2 px-4 rounded-xl flex-row items-center justify-between gap-2",
            "bg-slate-200 dark:bg-slate-700/40"
        )} >
            <PlayerMugshot 
                url={player.image_url}
                playerPr={player.power_rank_rating}
                showPrBackground
            />
            
            <div className="flex-1 flex items-start flex-col" >
                <p>{player.player_name}</p>
                <SecondaryText className="text-sm" >{player.team.athstat_name}</SecondaryText>
            </div>

            <div>
                <p className="font-bold text-primary-500 dark:text-primary-4 00" >
                    {player.power_rank_rating ?
                        Math.floor(player.power_rank_rating)
                        : "-"    
                    }
                </p>
            </div>

        </div>
    )
}
