import React from "react";
import { alphabeticalComparator } from "../../utils/stringUtils";
import TeamLogo from "../team/TeamLogo";

interface Team {
  id: string;
  name: string;
  logo?: string;
}

interface TeamFilterProps {
  availableTeams: Team[];
  teamFilter: string[];
  toggleTeamFilter: (teamId: string) => void;
}

const TeamFilter: React.FC<TeamFilterProps> = ({
  availableTeams,
  teamFilter,
  toggleTeamFilter,
}) => {

  const sortedTeams = availableTeams.sort((a, b) => {
    return alphabeticalComparator(a.name ?? "", b.name ?? "");
  });

  return (
    <div className="px-6 py-0 border-b dark:border-gray-700">
      {/* Teams filter */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 ">
          Teams:
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-dark-800 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-dark-800 to-transparent z-10 pointer-events-none"></div>
          <div
            className="flex overflow-x-auto py-2 no-scrollbar whitespace-nowrap gap-2 px-6 after:content-[''] after:w-4 after:shrink-0 scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {sortedTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => toggleTeamFilter(team.id)}
                className={`
                px-3 py-1.5 flex flex-row items-center gap-2 rounded-full text-xs font-medium transition shrink-0
                ${
                  teamFilter.includes(team.id)
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-500 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                }
              `}
              >
                {team.logo && (
                  <TeamLogo 
                    url={team.logo}
                    teamName={team.name}
                    className="w-5 h-5"
                  />
                )}

                {team.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFilter;
