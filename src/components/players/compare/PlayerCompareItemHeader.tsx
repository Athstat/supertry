import { IProAthlete } from '../../../types/athletes'
import { X, Dot } from 'lucide-react'
import { formatPosition } from '../../../utils/athleteUtils'
import { PlayerGameCard } from '../../player/PlayerGameCard'

type Props = {
    player: IProAthlete,
    onRemove?: () => void
}

export default function PlayerCompareItemHeader({ player, onRemove }: Props) {

    return (
        <div>
            <div className="flex flex-row items-center justify-end">
                <button
                    onClick={onRemove}
                    className="flex w-fit text-sm text-slate-700 dark:text-white flex-row gap-1 cursor-pointer items-center dark:bg-slate-700/70 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border dark:border-slate-600 px-2 rounded-xl py-0.5"
                >
                    Remove
                    <X className="w-4 h-4" />
                </button>
            </div>

            <PlayerGameCard className="h-[200px] lg:h-[300px]" blockGlow player={player} />

            <div>
                <p className="font-bold truncate text-slate-800 dark:text-slate-100">
                    {player.player_name}
                </p>

                <div className="flex text-sm flex-row text-slate-700 dark:text-slate-400">
                    {player.position && <p className="truncate">{formatPosition(player.position)}</p>}
                    <Dot className="" />
                    <p className="truncate">{player.team.athstat_name}</p>
                </div>
            </div>
        </div>
    )
}
