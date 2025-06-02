import React, { useState } from "react";
import { X, ChevronLeft, Trophy, Dot } from "lucide-react";
import { RankedFantasyTeam } from "../../types/league";
import { PointsBreakdownItem } from "../../services/athleteService";
import { formatAction } from "../../utils/athleteUtils";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import TeamAthletesModalListView from "./TeamAthletesModalListView";
import Experimental from "../shared/ab_testing/Experimental";
import TeamAthletesModalPitchView from "./TeamAthletesModalPitchView";
import { getEnvironment } from "../../utils/envUtils";
import { twMerge } from "tailwind-merge";
import { isEmail } from "../../utils/stringUtils";

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
  //console.log("Points Breakdown", pointsBreakdown);
  const isStable = getEnvironment() === "production";
  const userNameIsEmail = isEmail(team.managerName);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className={twMerge(
        "bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-xl w-[90%] lg:w-[50%] max-h-[75vh] lg:max-h-[90vh] overflow-clip flex flex-col",
        !isStable && "max-h-none h-[90vh] lg:h-[90vh]"
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
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">
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
                   { userNameIsEmail ? team.teamName : `Managed by ${team.managerName}`}
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

            <Experimental
              placeholder={
                <TeamAthletesModalListView
                  athletes={athletes}
                  handleKeyDown={handleKeyDown}
                  handleViewBreakdown={handleViewBreakdown}
                />
              }
            >
              <TeamAthletesModalPitchView
                athletes={athletes}
                handleKeyDown={handleKeyDown}
                handleViewBreakdown={handleViewBreakdown}
              />
            </Experimental>



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
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
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
