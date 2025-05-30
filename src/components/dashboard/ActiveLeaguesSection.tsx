import React from "react";
import { Loader } from "lucide-react";
import { ActiveLeaguesSectionProps } from "./types";
import { activeLeaguesFilter, upcomingLeaguesFilter } from "../../utils/leaguesUtils";
import LeagueCardDetailed from "../leagues/LeagueCardDetailed";

export const ActiveLeaguesSection: React.FC<ActiveLeaguesSectionProps> = ({
  leagues,
  isLoading,
}) => {
  const activeLeagues = activeLeaguesFilter(leagues);
  const upcomingLeagues = upcomingLeaguesFilter(leagues);

  const noLeagues = activeLeagues.length === 0 && upcomingLeagues.length === 0;

  return (
    <div className="w-full ">
      {/* <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
        <Trophy size={24} className="text-primary-500" />
        {activeLeagues.length > 0 ? "Active Leagues" : "Upcoming Leagues"}
      </h2> */}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : noLeagues ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{upcomingLeagues.length === 0 ? "No upcoming leagues available" : "No active leagues available."}</p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 gap-3 lg:gap-5">
          {activeLeagues.slice(0, 3).map((league, index) => (
            <LeagueCardDetailed key={index} league={league} />
          ))}

          { activeLeagues.length === 0 && upcomingLeagues.slice(0, 1).map((league, index) => (
            <LeagueCardDetailed key={index} league={league} />
          ))}
        </div>
      )}
    </div>
  );
};
