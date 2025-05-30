import { useRef, Ref } from "react";
import { Trophy, Loader, ChevronRight } from "lucide-react";
import { RankedFantasyTeam } from "../../types/league";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { isLeagueLocked } from "../../utils/leaguesUtils";
import RoundedCard from "../shared/RoundedCard";

interface LeagueStandingsProps {
  teams: RankedFantasyTeam[];
  showJumpButton: boolean;
  onJumpToTeam: () => void;
  isLoading?: boolean;
  error?: string | null;
  onTeamClick?: (team: RankedFantasyTeam) => void;
  league: IFantasyLeague;
}

export function LeagueStandings({
  teams,
  isLoading = false,
  error = null,
  onTeamClick,
  league,
}: LeagueStandingsProps) {
  const userTeamRef = useRef<HTMLTableRowElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 64;
  const HEADER_HEIGHT = 56;
  const TABLE_HEIGHT = ROW_HEIGHT * 6 + HEADER_HEIGHT + 100;

  // Scroll to user's team when component mounts or teams change
  // useEffect(() => {
  //   if (
  //     userTeamRef.current &&
  //     tableRef.current &&
  //     teams.some((team) => team.isUserTeam)
  //   ) {
  //     // Add a small delay to ensure the table is fully rendered
  //     setTimeout(() => {
  //       const userTeamPosition =
  //         userTeamRef.current && userTeamRef.current.offsetTop - HEADER_HEIGHT;
  //       if (userTeamPosition) {
  //         tableRef.current?.scrollTo({
  //           top: userTeamPosition,
  //           behavior: "smooth",
  //         });
  //       }
  //     }, 300);
  //   }
  // }, [teams]);

  // Handle team row click
  const handleTeamClick = (team: RankedFantasyTeam) => {
    if (onTeamClick) {
      onTeamClick(team);
    }
  };

  return (
    <RoundedCard className="shadow-sm">
      
      <div className="p-6 sticky top-0 bg-white dark:bg-dark-800/20 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
            <Trophy size={24} className="text-primary-500" />
            League Standings
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading standings...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-8 px-4">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button className="mt-2 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
            Try again
          </button>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-gray-600 dark:text-gray-400">
            No teams have joined this league yet.
          </p>
        </div>
      ) : (
        <div
          ref={tableRef}
          className=" scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-600 scrollbar-track-gray-100 dark:scrollbar-track-dark-800 relative"
          
        >
          <div className="relative">
            <table className="w-full">
              <thead className="sticky top-0  bg-gray-50 dark:bg-dark-800 z-40">
                <tr>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Rank
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Team
                  </th>
                  <th className="py-4 px-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Total Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...teams]
                  .sort((a, b) => {
                    // If both teams have ranks, sort normally
                    if (a.rank && b.rank) {
                      return a.rank - b.rank;
                    }
                    // Push teams without ranks to the bottom
                    if (!a.rank) return 1;
                    if (!b.rank) return -1;
                    // Fallback sorting
                    return 0;
                  })
                  .map((team, index) => {
                    return (
                      <StandingsTableRow
                        key={team.team_id}
                        index={index}
                        team={team}
                        userTeamRef={userTeamRef}
                        handleTeamClick={handleTeamClick}
                        league={league}
                      />
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* 
      {showJumpButton && teams.some(isUserTeamCheck) && (
        <div className="p-3 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onJumpToTeam}
            className="w-full py-3 flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            aria-label="Jump to my team"
          >
            Jump to my team
            <span>↓</span>
          </button>
        </div>
      )} */}

      <style>
        {`
          @keyframes glow {
             0%, 100% {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
            }
          }
          .animate-glow {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
          }
        `}
      </style>
    </RoundedCard>
  );
}

type StandingsTableRowProps = {
  team: RankedFantasyTeam;
  userTeamRef: Ref<any>;
  handleTeamClick: (team: RankedFantasyTeam) => void;
  index: number;
  league: IFantasyLeague;
};

function StandingsTableRow({
  team,
  userTeamRef,
  handleTeamClick,
  index,
  league,
}: StandingsTableRowProps) {
  const user = authService.getUserInfo();
  const isUserTeam = user ? user.id === team.userId : false;

  return (
    <>
      <tr
        key={team.team_id}
        ref={team.isUserTeam ? userTeamRef : null}
        data-user-team={team.isUserTeam}
        className={`
          cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800
          ${getRowBackground(team.rank, index, team.isUserTeam)}
        `}
        onClick={() => handleTeamClick(team)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTeamClick(team);
            e.preventDefault();
          }
        }}
        tabIndex={0}
        aria-label={`View ${team.teamName} details`}
      >
        <td className="py-4 px-4 whitespace-nowrap">
          <div className="flex items-center">
            <span
              className={`font-semibold w-5 text-center ${
                team.rank === 1
                  ? "text-yellow-500 dark:text-yellow-400"
                  : team.rank === 2
                  ? "text-gray-400 dark:text-gray-200"
                  : team.rank === 3
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {team.rank}
            </span>
            <span className="w-4 flex justify-center">
              {getRankChange(team.rank, team.lastRank)}
            </span>
          </div>
        </td>
        <td className="py-4 px-4">
          <div className="flex flex-col">
            <div
              className={`font-medium ${
                team.isUserTeam
                  ? "text-primary-600 dark:text-primary-400"
                  : "dark:text-gray-100"
              }`}
            >
              {team.teamName} {team.isUserTeam && "(You)"}
            </div>
            <div className="flex flex-col gap-0.5 mt-1">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {team.managerName}
              </div>
              {getTeamLabel(team.rank)}
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-right font-bold text-primary-600 dark:text-primary-400 relative pr-10">
          {team.overall_score.toFixed(1)}
          <span className="absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronRight className="text-gray-400" />
          </span>
        </td>
      </tr>
    </>
  );
}

type EditButtonProps = {
  team: RankedFantasyTeam;
  league: IFantasyLeague;
};

function EditTeamButton({ team, league }: EditButtonProps) {
  const navigate = useNavigate();
  const isLocked = isLeagueLocked(league.join_deadline);

  const handleClick = () => {
    const uri = `/my-team/${team.team_id}`;
    navigate(uri, {
      state: { teamWithRank: team, league: league },
    });
  };

  if (isLocked) {
    return (
      <div className="w-full cursor-not-allowed z-50 flex flex-col items-center justify-center absolute mb-20 h-12 bottom-0 left-0">
        <button
          onClick={handleClick}
          className="flex font-medium h-full rounded-xl text-white flex-row items-center w-[90%] lg:w-1/3 gap-2 bg-primary-700 justify-center"
        >
          View Team
        </button>
      </div>
    );
  }

  return (
    <div className="w-full z-50 flex flex-col items-center justify-center fixed mb-20 h-12 bottom-0 left-0">
      <button
        onClick={handleClick}
        className="flex font-medium h-full rounded-xl text-white flex-row items-center w-[90%] lg:w-1/3 gap-2 bg-gradient-to-br from-primary-700 to-primary-700 via-primary-800 hover:from-primary-800 hover:to-primary-900 hover:via-primary-900 justify-center"
      >
        Edit Team
      </button>
    </div>
  );
}

const getRowBackground = (
  rank: number,
  index: number,
  isUserTeam?: boolean
) => {
  if (isUserTeam === true) {
    return "bg-primary-50/50 dark:bg-primary-800/40 border-l-4 border-primary-500";
  }

  switch (rank) {
    case 1:
      return "bg-yellow-50/80 dark:bg-yellow-900/20 ";
    case 2:
      return "";
    case 3:
      return " ";
    default:
      return index % 2 === 0
        ? " border-l-4 border-transparent"
        : "border-l-4 border-transparent";
  }
};

const getTeamLabel = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
          🏆 Champion
        </span>
      );
    case 2:
      return (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          🥈 Runner-up
        </span>
      );
    case 3:
      return (
        <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">
          🥉 Top Contender
        </span>
      );
    default:
      return null;
  }
};

const getRankChange = (currentRank: number, lastRank: number) => {
  if (currentRank < lastRank) {
    return <span className="text-green-500">↑</span>;
  } else if (currentRank > lastRank) {
    return <span className="text-red-500">↓</span>;
  }
  return null;
};
