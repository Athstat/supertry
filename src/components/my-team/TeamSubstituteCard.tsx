import { motion } from "framer-motion"
import { Player } from "../../types/team"
import { formatPosition } from "../../utils/athleteUtils"
import SimpleCoinIcon from "../shared/SimpleCoinIcon"
import { useFetch } from "../../hooks/useFetch"
import { athleteService } from "../../services/athleteService"
import { LoadingState } from "../ui/LoadingState"
import { twMerge } from "tailwind-merge"
import { Info } from "lucide-react"

type Props = {
    player: Player,
    handlePlayerClick: (player: Player) => void
}

export default function TeamSubstituteCard({player, handlePlayerClick} : Props) {

    const {data, isLoading} = useFetch("player-info", player.tracking_id ?? "fallback-id", athleteService.getRugbyAthleteById);

    if (isLoading) return <LoadingState />

    const isAvailable = data?.available;

    return (
        <div>
            <motion.div
                key={player.id}
                className={twMerge(
                    "flex items-center gap-4 cursor-pointer rounded-lg p-2",
                    !isAvailable && "opacity-50"
                )}
                onClick={() => handlePlayerClick(player)}
                whileHover={{
                    scale: 1.02,
                    transition: { type: "spring", stiffness: 300 },
                }}
                initial={{ opacity: 0.9 }}
                animate={{ opacity: 1 }}
            >
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-orange-300 dark:border-orange-600">
                    {player.image_url ? (
                        <img
                            src={player.image_url}
                            alt={player.player_name}
                            className="w-full h-full object-cover"
                        />
            
                    ) : (
                        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                            {player.player_name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                            {player.player_name}
                        </span>
                        { player.position && <span className="text-sm font-bold px-2 py-0.5 bg-gray-100 dark:bg-dark-700 rounded-full text-gray-800 dark:text-gray-300">
                            {formatPosition(player.position)}
                        </span>}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                            {player.team_name}
                        </span>
                        <span className="text-primary-700 dark:text-primary-500 font-bold flex items-center">
                            <SimpleCoinIcon />
                            {player.price}
                        </span>
                    </div>
                    <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
                        Can Substitute For Any Position
                    </div>
                </div>
            </motion.div>

            {!isAvailable && <div className="bg-yellow-500/70 dark:bg-yellow-900/40 border border-yellow-500 text-yellow-700 dark:border-yellow-700  border-text-yellow-300 dark:text-yellow-600 mt-2 flex flex-row items-center gap-2 text-xs rounded-xl p-2">
                <Info  className="w-4 h-4" />
                Substitute {player.player_name}'s availability has not been confirmed yet
            </div>}
        </div>
    )
}
