import React, { useState } from "react";
import { X, ChevronLeft, Trophy, Dot, Lock } from "lucide-react";
import { RankedFantasyTeam } from "../../types/league";
import { PointsBreakdownItem } from "../../services/athleteService";
import { formatAction } from "../../utils/athleteUtils";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import TeamAthletesModalPitchView from "./TeamAthletesModalPitchView";
import { twMerge } from "tailwind-merge";
import { isEmail } from "../../utils/stringUtils";
import { useAtomValue } from "jotai";
import { fantasyLeagueLockedAtom } from "../../state/fantasyLeague.atoms";
import { authService } from "../../services/authService";
import PlayerMugshot from "../shared/PlayerMugshot";

interface TeamAthletesModalProps {
  team: RankedFantasyTeam;
  athletes: RugbyPlayer[];
  onClose: () => void;
  isLoading?: boolean;
}

export function TeamAthletesModal({
  team,
  athletes,
  onClose,
  isLoading = false,
}: TeamAthletesModalProps) {

  const isLeagueLocked = useAtomValue(fantasyLeagueLockedAtom);
  const user = authService.getUserInfo();

  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(
    null
  );
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdownItem[]>(
    []
  );

  const selectedAthlete = athletes.find(
    (athlete) => athlete.id === selectedAthleteId
  );

  const handleViewBreakdown = async (
    athleteId: string,
    pointsBreakdown: PointsBreakdownItem[]
  ) => {
    if (athleteId === selectedAthleteId) return;

    setSelectedAthleteId(athleteId);
    setPointsBreakdown(pointsBreakdown);
  };

  const handleBackToList = () => {
    setSelectedAthleteId(null);
    setPointsBreakdown([]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    athleteId: string,
    pointsBreakDown: PointsBreakdownItem[]
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleViewBreakdown(athleteId, pointsBreakDown);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalScore = pointsBreakdown.reduce((acc, item) => acc + item.score, 0);
  const userNameIsEmail = isEmail(team.managerName);

  const isUsersTeam = user ? user.id === team.userId : false;
  const canPeek = isLeagueLocked || isUsersTeam;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex flex-col items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className={twMerge(
        "bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-xl w-[95%] lg:w-[50%] h-[90vh] lg:h-[70vh] overflow-clip flex flex-col",
      )}>

        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">

          <div className="flex-1">
            {selectedAthleteId && selectedAthlete ? (
              <div className="flex items-center">
                <button
                  onClick={handleBackToList}
                  className="mr-3 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Back to team list"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleBackToList();
                    }
                  }}
                >
                  <ChevronLeft
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>

                {selectedAthlete.image_url && <div className="mr-2" >
                  <PlayerMugshot
                    url={selectedAthlete.image_url} 
                    className="w-12 h-12 lg:w-14 lg:h-14"
                    playerPr={selectedAthlete.power_rank_rating}
                    showPrBackground={selectedAthlete.power_rank_rating !== undefined}
                  />
                </div>}
                <div>

                  <h2 className="text-md truncate font-semibold dark:text-white">
                    {selectedAthlete.player_name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedAthlete.position
                      ? selectedAthlete.position
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")
                      : "Athlete"}{" "}
                    • {team.teamName}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-lg flex flex-row items-center gap-1 font-semibold dark:text-white">
                  <p>{team.teamName}</p>
                </div> 
                <div className="flex flex-row items-center text-sm text-gray-500 dark:text-gray-400" >

                  {team.rank &&
                    <>
                      <Trophy className="w-3.5 h-3.5 mr-1" />
                      <p>Rank <strong>{team.rank}</strong> </p>
                      <Dot />
                    </>
                  }

                  <p className="">
                    {userNameIsEmail ? team.teamName : `Managed by ${team.managerName}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Fixed Total Score Header - Only visible when viewing athlete breakdown */}
        {selectedAthleteId && pointsBreakdown && (
          <div className="sticky top-0 z-10 p-3 pl-7 pr-7 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold dark:text-white">
                Total Score
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalScore?.toFixed(1) ?? 0} pts
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-32 p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : selectedAthleteId ? (
          // Points breakdown view
          <div className="overflow-y-auto min-h-[60vh]">
            {pointsBreakdown.length === 0 && (
              <p className="text-center m-4 bg-slate-100 dark:bg-slate-700 rounded-xl p-4 text-gray-500 dark:text-gray-400">
                No points breakdown data available
              </p>
            )}
            {pointsBreakdown.length > 0 && (
              <PointsBreakdownView points={pointsBreakdown} />
            )}
          </div>
        ) : (
          // Main list view
          <div className="w-full h-full" >
            {canPeek ?

              <TeamAthletesModalPitchView
                athletes={athletes}
                handleKeyDown={handleKeyDown}
                handleViewBreakdown={handleViewBreakdown}
              />

              : <NoPeekingView />
            }


          </div>
        )}
      </div>
    </div>
  );
}


type PointsBreakdownListItemProps = {
  item: PointsBreakdownItem;
};

function PointsBreakdownListItem({ item }: PointsBreakdownListItemProps) {
  // Format the action name by adding spaces before capitals and capitalizing first letter

  const displayName = formatAction(item.action ?? "");

  // Determine if score is positive or negative for styling
  const isPositive = item.score > 0;
  const isNegative = item.score < 0;

  return (
    <li className="flex flex-col border-b pb-3 dark:border-gray-600 last:border-0">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {displayName}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-400 italic sm:ml-1">
              ({item.action_count})
            </span>
          </div>
        </div>
        <span
          className={`font-bold ${isPositive
            ? "text-green-600 dark:text-green-400"
            : isNegative
              ? "text-red-600 dark:text-red-400"
              : "dark:text-white"
            }`}
        >
          {item?.score.toFixed(1) ?? 0} pts
        </span>
      </div>
    </li>
  );
}

type PointsBreakDownViewProps = {
  points: PointsBreakdownItem[];
};

function PointsBreakdownView({ points }: PointsBreakDownViewProps) {
  const pointsBreakdown = points;

  return (
    <div className=" flex-1 p-4">
      <div className="bg-gray-50 dark:bg-gray-700/50 border border-slate-100 dark:border-slate-600 rounded-lg p-4">
        {pointsBreakdown.length > 0 ? (
          <ul className="space-y-3">
            {pointsBreakdown.map((item, index) => {
              return <PointsBreakdownListItem item={item} key={index} />;
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No breakdown data available
          </p>
        )}
      </div>
    </div>
  );
}

function NoPeekingView() {
  return (
    <div className="w-full h-full flex flex-col items-center text-center gap-4 justify-center text-slate-700 dark:text-slate-400 px-5" >
      <Lock className="w-14 h-14" />
      <p className="font text-md" >No peeking! You'll be able to see this team once join dealine has passed.</p>
    </div>
  )
}