import React from "react";
import { Trophy, Loader } from "lucide-react";
import { ActiveLeaguesSectionProps } from "./types";
import { activeLeaguesFilter } from "../../utils/leaguesUtils";
import LeagueCardDetailed from "../leagues/LeagueCardDetailed";

export const ActiveLeaguesSection: React.FC<ActiveLeaguesSectionProps> = ({
  leagues,
  isLoading
}) => {
  const activeLeagues = activeLeaguesFilter(leagues);

  return (
    <div className="w-full ">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
        <Trophy size={24} className="text-primary-500" />
        Active Leagues
      </h2>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : leagues.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No active leagues available.</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
          {activeLeagues.slice(0, 3).map((league, index) => (
            <LeagueCardDetailed
              key={index}
              league={league}
            />
          ))}

        </div>
      )}
    </div>
  );
};
