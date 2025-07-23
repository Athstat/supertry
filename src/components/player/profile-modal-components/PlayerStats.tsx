import React from "react";
import { IProAthlete } from "../../../types/athletes";
import PlayerIconsRow from "../../players/compare/PlayerIconsRow";
import usePlayerStats from "./usePlayerStats";

interface PlayerStatsProps {
  player: IProAthlete;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {

  const {starRatings, seasonPlayerStats} = usePlayerStats(player);
  console.log("Sacha star ratings ", starRatings);

  return (
    <>
      <div className="flex justify-between px-4 py-3 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-800/40 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            {player.price}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            {player.power_rank_rating?.toFixed(1) || "N/A"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Power Ranking
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/40 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
          {player.team.image_url ? (
            <img
              src={player.team.image_url}
              alt={player.team.athstat_name}
              className="h-6 w-6 object-contain mb-1"
            />
          ) : (
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              —
            </div>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400">Team</div>
        </div>
      </div>
      
      {/* Player Icons */}
      <div className="px-4 mt-2 w-full flex flex-row items-center justify-center">
        <PlayerIconsRow 
          player={player} 
          starRatings={starRatings ?? null} 
          seasonStats={seasonPlayerStats} 
          size="sm" 
        />
      </div>
    </>
  );
};

export default PlayerStats;
