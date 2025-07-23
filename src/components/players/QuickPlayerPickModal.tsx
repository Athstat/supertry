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
import { X } from "lucide-react";
import RoundedCard from "../shared/RoundedCard";
import PrimaryButton from "../shared/buttons/PrimaryButton";

type Props = {
    onSelectPlayers?: (players: IProAthlete[]) => void,
    open?: boolean,
    onClose?: () => void,
    exclude?: IProAthlete[]
}

export default function QuickPlayerSelectModal({ onSelectPlayers, open, onClose, exclude = [] }: Props) {

    const { athletes } = useAthletes();
    const [search, setSearch] = useState<string>("");

    const [selected, setSelected] = useState<IProAthlete[]>([]);

    const debouncedSearchQuery = useDebounced(search, 300);

    const { filteredAthletes } = useAthleteFilter({
        athletes,
        searchQuery: debouncedSearchQuery
    });

    const onClickPlayer = (player: IProAthlete) => {

        if (exclude.find((a) => a.tracking_id === player.tracking_id)) {
            return;
        }

        if (selected.some(p => p.tracking_id === player.tracking_id)) {

            setSelected(prev =>
                prev.filter((p) => p.tracking_id !== player.tracking_id)
            )
        } else {
            setSelected(prev => [...prev, player]);
        }
    }

    const onRemovePlayer = (player: IProAthlete) => {
        setSelected(prev =>
            prev.filter((p) => p.tracking_id !== player.tracking_id)
        )
    }

    const handleCloseModal = () => {

        if (onClose) {
            onClose();
            setSelected([]);
        }
    }

    const onLockSelection = () => {

        if (onSelectPlayers) {
            onSelectPlayers(selected);
        }

        handleCloseModal();
    }

    return (
        <DialogModal
            open={open}
            onClose={handleCloseModal}
            title="Add Players"
            className="flex flex-col gap-3 overflow-hidden"
        >
            <div className="overflow-y-auto flex flex-col gap-3" >

                <PlayerSearch
                    searchQuery={search}
                    onSearch={setSearch}
                />

                {selected.length > 0 && <SecondaryText>Selected Players ({selected.length})</SecondaryText>}
                <div className="flex flex-row items-center gap-1 flex-wrap " >

                    {selected.map((player) => {

                        const firstName = player.athstat_firstname
                        const lastName = player.athstat_lastname;
                        return (
                            <RoundedCard
                                className="px-2 dark:bg-slate-700 text-nowrap cursor-pointer hover:bg-blue-500 hover:dark:bg-blue-500 py-0.5 flex flex-row items-center gap-1"
                                onClick={() => onRemovePlayer(player)}
                                key={player.tracking_id}
                            >
                                <p className="text-sm">{firstName && firstName[0]}. {lastName && lastName}</p>
                                <X className="w-4 h-4" />
                            </RoundedCard>
                        )
                    })}
                </div>

                <div className="flex flex-row items-center justify-between" >
                    <SecondaryText>Player</SecondaryText>
                    <SecondaryText>Power Ranking</SecondaryText>
                </div>

                <div className="flex flex-col gap-2 " >
                    {filteredAthletes.map((athlete) => {
                        return <PlayerItem
                            player={athlete}
                            key={athlete.tracking_id}
                            onClick={onClickPlayer}
                            isSelected={selected.some(p => p.tracking_id === athlete.tracking_id)}
                            disabled={exclude.some(p => p.tracking_id === athlete.tracking_id)}
                        />
                    })}
                </div>
            </div>

            <div>
                <PrimaryButton onClick={onLockSelection} >Done</PrimaryButton>
            </div>
        </DialogModal>
    )
}

type PlayerItemProps = {
    player: IProAthlete,
    onClick?: (player: IProAthlete) => void,
    isSelected?: boolean,
    disabled?: boolean,
}

function PlayerItem({ player, onClick, isSelected, disabled }: PlayerItemProps) {

    const handleClick = () => {

        if (disabled) {
            return;
        }

        if (onClick) {
            onClick(player);
        }
    }

    return (
        <div
            className={twMerge(
                "flex py-2 px-4 rounded-xl cursor-pointer flex-col items-start gap-2",
                "bg-slate-200 dark:bg-slate-700/40 hover:dark:bg-slate-600 hover:bg-slate-100",
                isSelected && "bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 hover:dark:bg-blue-600",
                disabled && "opacity-35"
            )}

            onClick={handleClick}
        >
            <div className="flex flex-row items-center w-full gap-2 justify-between" >
                <PlayerMugshot
                    url={player.image_url}
                    playerPr={player.power_rank_rating}
                    showPrBackground
                />

                <div className="flex-1 flex items-start flex-col" >
                    <p  className={twMerge(
                        isSelected && "text-white font-bold"
                    )} >{player.player_name}</p>
                    <SecondaryText className={twMerge(
                        "text-sm",
                        isSelected && "text-slate-100 dark:text-slate-100"
                    )} >{player.team.athstat_name}</SecondaryText>
                </div>

                <div className="flex flex-row items-center gap-2" >
                    <p className={twMerge(
                        "font-bold text-primary-500 dark:text-primary-4 00",
                        isSelected && "text-white"
                    )} >
                        {player.power_rank_rating ?
                            Math.floor(player.power_rank_rating)
                            : "-"
                        }
                    </p>

                </div>
            </div>

            {disabled && <p className="text-xs text-red-500" >Player is already selected</p>}

        </div>
    )
}
