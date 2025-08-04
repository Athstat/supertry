import { X, Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import { formatPosition } from "../../utils/athleteUtils";
import { CircleDollarSign } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { athleteService } from "../../services/athletes/athleteService";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { useAtomValue } from "jotai";
import { fantasyLeagueLockedAtom } from "../../state/fantasyLeague.atoms";

type PlayerActionModalProps = {
  player: IFantasyTeamAthlete;
  onClose: () => void;
  onViewStats: (player: IFantasyTeamAthlete) => void;
  onSwapPlayer: (player: IFantasyTeamAthlete) => void;
  league?: IFantasyLeague
}

export function PlayerActionModal({
  player,
  onClose,
  onViewStats,
  onSwapPlayer
}: PlayerActionModalProps) {

  const { data: info, isLoading } = useFetch("athletes-info", player.tracking_id ?? "fall-back", athleteService.getRugbyAthleteById);
  console.log(info);

  const isSwapLocked = useAtomValue(fantasyLeagueLockedAtom);
  const isSub = !player.is_starting;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-sm shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold dark:text-gray-100">
              Player Actions
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Player Info */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-dark-800/40 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary-300 dark:border-primary-700">
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

              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold w-full text-md dark:text-gray-100">
                  {player.player_name}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                {!isLoading && info && <span className="text-gray-600 font-semibold w-full dark:text-gray-400">
                  {player.team_name}
                </span>}

                {isLoading && <div className="h-2 w-10 rounded-lg bg-slate-300 dark:bg-slate-700 animate-pulse" ></div>}
                <p className="text-primary-700 dark:text-primary-500 font-bold flex flex-row gap-2 items-center">
                  <CircleDollarSign className="text-yellow-400 w-5 h-5" /> {player.price}
                </p>
              </div>

              <div className="flex flex-col mt-1" >
                <span className=" text-slate-700 dark:text-slate-400 text-xs ">
                  {formatPosition(player.position ?? "")}
                </span>
              </div>


              {isSub && (
                <div className="mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Super Sub - Can play any position
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onViewStats(player)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-dark-800/40 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Trophy
                size={24}
                className="text-primary-600 dark:text-primary-400"
              />
              <span className="font-medium">View Stats</span>
            </button>

            {!isSwapLocked && <button
              onClick={() => onSwapPlayer(player)}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-dark-800/40 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Users
                size={24}
                className="text-primary-600 dark:text-primary-400"
              />
              <span className="font-medium">Swap Player</span>
            </button>}

            {isSwapLocked && <button
              className="flex flex-col opacity-30 cursor-not-allowed items-center justify-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-dark-800/40 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Users
                size={24}
                className="text-primary-600 dark:text-primary-400"
              />
              <span className="font-medium">Swap Player</span>
            </button>}

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
