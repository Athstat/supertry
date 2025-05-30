import { Dot, X } from "lucide-react";
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { formatPosition } from "../../../utils/athleteUtils";
import { PlayerGameCard } from "../../player/PlayerGameCard";
import DialogModal from "../../shared/DialogModal";
import { twMerge } from "tailwind-merge";
import { useFetch } from "../../../hooks/useFetch";
import { athleteService } from "../../../services/athleteService";

type Props = {
    selectedPlayers: RugbyPlayer[],
    open?: boolean,
    onClose?: () => void,
    onRemove: (player: RugbyPlayer) => void
}

export default function PlayerCompareModal({ selectedPlayers, open, onClose, onRemove }: Props) {

    if (open === false || selectedPlayers.length < 2) return;

    const player1 = selectedPlayers[0];
    const player2 = selectedPlayers[1];
    let title = `Comparing ${player1.player_name} and ${player2.player_name}`;

    return (
        <DialogModal

            open={open}
            title={title}
            onClose={onClose}
            hw="lg:w-[500px]"
        >

            <div className="grid grid-cols-2 gap-4" >

                <PlayersCompareItem
                    player={player1}
                    comparingPlayer={player2}
                    onRemove={onRemove}
                />

                <PlayersCompareItem
                    player={player2}
                    comparingPlayer={player1}
                    onRemove={onRemove}
                />

            </div>


        </DialogModal>
    )
}

type StatLabelProp = {
    label?: string,
    value?: string | number,
    isGreen?: boolean
}

function StatLabel({ label, value, isGreen }: StatLabelProp) {

    const hasVal = value !== undefined;

    return (
        <div className="flex flex-row items-center gap-1" >
            <div className="bg-slate-200 flex-[3] py-1 dark:bg-slate-600 rounded-md text-sm px-2" >{label}</div>
            <div className={twMerge(
                "bg-slate-300 flex-1 py-1 text-center items-center dark:bg-slate-700 rounded-md text-sm px-1",
                isGreen && "bg-green-500 dark:bg-green-700 text-white"
            )} >{hasVal ? value : "-"}</div>
        </div>
    )
}

type ItemProps = {
    player: RugbyPlayer,
    comparingPlayer?: RugbyPlayer,
    onRemove?: (player: RugbyPlayer) => void
}

function PlayersCompareItem({ player, comparingPlayer, onRemove }: ItemProps) {

    const handleRemove = () => {
        if (onRemove) {
            onRemove(player);
        }
    }

    const { data: stats, isLoading: loadingStats } = useFetch("player-stats", player.tracking_id ?? "fallback", athleteService.getRugbyAthleteById);
    const { data: comparingStats, isLoading: loadingComparingStats } = useFetch("player-stats", comparingPlayer?.tracking_id ?? "fallback", athleteService.getRugbyAthleteById);

    const isLoading = loadingComparingStats || loadingStats;

    if (isLoading) return (
        <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 animate-pulse" >

        </div>
    )

    return (
        <div className="flex flex-col gap-2" >

            <div className="flex flex-row items-center justify-end" >
                <button onClick={handleRemove} className=" flex w-fit text-sm text-white flex-row px-2 hover:bg-red-600 rounded-xl gap-1 cursor-pointer items-center bg-red-500 dark:bg-red-600 dark:hover:bg-red-700" >
                    Remove
                    <X className="w-4 h-4" />
                </button>
            </div>

            <PlayerGameCard className="h-[200px] lg:h-[300px]" blockGlow player={player} />

            <div>
                <p className="font-bold truncate" >{player.player_name}</p>

                <div className="flex text-sm flex-row text-slate-700 dark:text-slate-400" >
                    {player.position && <p className="truncate" >{formatPosition(player.position)}</p>}
                    <Dot className="" />
                    <p className="truncate" >{player.team_name}</p>
                </div>

            </div>

            <div className="flex flex-col gap-1" >

                <p className="mt-2" >General</p>

                <StatLabel
                    label="Power Rating"
                    value={player.power_rank_rating}
                    isGreen={(player.power_rank_rating ?? 0) > (comparingPlayer?.power_rank_rating ?? 0)}
                />

                <StatLabel
                    label="Price"
                    value={player.price}
                    isGreen={(player.price ?? 0) > (comparingPlayer?.price ?? 0)}
                />

                <p className="mt-2" >Attacking</p>
                <StatLabel
                    label="Attacking"
                    value={stats?.attacking}
                    isGreen={(stats?.attacking ?? 0) > (comparingStats?.attacking ?? 0)}
                />

                <StatLabel
                    label="Scoring"
                    value={stats?.scoring}
                    isGreen={(stats?.scoring ?? 0) > (comparingStats?.scoring ?? 0)}
                />

                <StatLabel
                    label="Ball Carying"
                    value={player.ball_carrying}
                    isGreen={(player.ball_carrying ?? 0) > (comparingPlayer?.ball_carrying ?? 0)}
                />


                <p className="mt-2" >Defense</p>

                <StatLabel
                    label="Defence"
                    value={stats?.defence}
                    isGreen={(stats?.defence ?? 0) > (comparingStats?.defence ?? 0)}
                />

                <StatLabel
                    label="Strength"
                    value={player.strength}
                    isGreen={(player.strength ?? 0) > (comparingPlayer?.strength ?? 0)}
                />

                <StatLabel
                    label="Tackling"
                    value={player.tackling}
                    isGreen={(player.tackling ?? 0) > (comparingPlayer?.tackling ?? 0)}
                />

                <p className="mt-2" >Kicking</p>

                <StatLabel
                    label="Kicking"
                    value={stats?.kicking}
                    isGreen={(stats?.kicking ?? 0) > (comparingStats?.kicking ?? 0)}
                />

                <StatLabel
                    label="Infield Kicking"
                    value={stats?.infield_kicking}
                    isGreen={(stats?.infield_kicking ?? 0) > (comparingStats?.infield_kicking ?? 0)}
                />


            </div>
        </div>
    )
}