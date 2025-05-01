import React, { useState, useEffect } from "react";
import { X, User, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { TeamStats } from "../../types/league";
import { athleteService, PointsBreakdown } from "../../services/athleteService";

interface Athlete {
  id: string;
  athlete_id?: string;
  name: string;
  position: string;
  player_name?: string;
  team_name?: string;
  power_rank_rating?: number;
  price?: number;
  image_url?: string;
  score?: number;
}

interface PointsBreakdownItem {
  action: string;
  action_count: number;
  score: number;
  game_id: string;
  athlete_id: string;
  category?: string;
  points?: number;
}

interface TeamAthletesModalProps {
  team: TeamStats;
  athletes: Athlete[];
  onClose: () => void;
  isLoading?: boolean;
}

// Add a new interface for athlete scores map
interface AthleteScoresMap {
  [key: string]: number;
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
  const [isBreakdownLoading, setIsBreakdownLoading] = useState(false);
  const [athleteScores, setAthleteScores] = useState<AthleteScoresMap>({});
  const [isLoadingScores, setIsLoadingScores] = useState(false);

  // Load scores for all athletes when modal opens
  useEffect(() => {
    const loadAllScores = async () => {
      setIsLoadingScores(true);
      const scoresMap: AthleteScoresMap = {};

      try {
        // Process athletes in sequence to avoid overwhelming the API
        for (const athlete of athletes) {
          const athleteId = athlete.athlete_id || athlete.id;
          try {
            const data = await athleteService.getAthletePointsBreakdown(
              athleteId
            );
            const totalScore = data.reduce((acc, item) => acc + item.score, 0);
            scoresMap[athleteId] = totalScore;
          } catch (error) {
            console.error(
              `Error fetching score for athlete ${athleteId}:`,
              error
            );
            scoresMap[athleteId] = 0; // Default to 0 if there's an error
          }
        }
        setAthleteScores(scoresMap);
      } catch (error) {
        console.error("Error loading athlete scores:", error);
      } finally {
        setIsLoadingScores(false);
      }
    };

    if (athletes.length > 0) {
      loadAllScores();
    }
  }, [athletes]);

  const selectedAthlete = athletes.find(
    (athlete) => (athlete.athlete_id || athlete.id) === selectedAthleteId
  );

  const handleViewBreakdown = async (athleteId: string) => {
    console.log("athleteId", athleteId);
    if (athleteId === selectedAthleteId) return;

    setSelectedAthleteId(athleteId);
    setIsBreakdownLoading(true);

    try {
      const data = await athleteService.getAthletePointsBreakdown(athleteId);
      console.log("data", data);
      setPointsBreakdown(data);
    } catch (error) {
      console.error("Error fetching points breakdown:", error);
      setPointsBreakdown(null);
    } finally {
      setIsBreakdownLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedAthleteId(null);
    setPointsBreakdown(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, athleteId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleViewBreakdown(athleteId);
    }
  };

  // Add this function to group actions by type and calculate totals
  const getGroupedActions = (breakdown: any[]) => {
    if (!breakdown || !breakdown.length) return [];

    const groupedActions = breakdown.reduce((result: any, item) => {
      const action = item.action || item.category || "";

      if (!result[action]) {
        result[action] = {
          action: action,
          action_count: 0,
          score: 0,
          instances: [],
        };
      }

      result[action].action_count += item.action_count || 1;
      result[action].score += item.score || item.points || 0;
      result[action].instances.push(item);

      return result;
    }, {});

    return Object.values(groupedActions);
  };

  console.log("Points breakdown", pointsBreakdown);

  // Handle click on the modal overlay (background)
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if the click is directly on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
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
                    {selectedAthlete.name || selectedAthlete.player_name}
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
                <h2 className="text-lg font-semibold dark:text-white">
                  {team.teamName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Managed by {team.managerName}
                </p>
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
        {selectedAthleteId && !isBreakdownLoading && pointsBreakdown && (
          <div className="sticky top-0 z-10 p-3 pl-7 pr-7 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold dark:text-white">
                Total Score
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {pointsBreakdown
                  .reduce((acc, item) => acc + item.score, 0)
                  .toFixed(2)}{" "}
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
          <div className="overflow-y-auto flex-1 p-4">
            {isBreakdownLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : pointsBreakdown ? (
              <div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  {pointsBreakdown.length > 0 ? (
                    <ul className="space-y-3">
                      {getGroupedActions(pointsBreakdown).map((item, index) => {
                        // Format the action name by adding spaces before capitals and capitalizing first letter
                        const formattedAction = item.action || "";
                        const displayName = formattedAction
                          .replace(/([A-Z])/g, " $1")
                          .trim();
                        const capitalizedName =
                          displayName.charAt(0).toUpperCase() +
                          displayName.slice(1);

                        // Determine if score is positive or negative for styling
                        const isPositive = item.score > 0;
                        const isNegative = item.score < 0;

                        return (
                          <li
                            key={index}
                            className="flex flex-col border-b pb-3 dark:border-gray-600 last:border-0"
                          >
                            <div className="flex justify-between items-center w-full">
                              <div className="flex flex-col">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                  {capitalizedName}
                                </span>
                              </div>
                              <span
                                className={`font-bold ${
                                  isPositive
                                    ? "text-green-600 dark:text-green-400"
                                    : isNegative
                                    ? "text-red-600 dark:text-red-400"
                                    : "dark:text-white"
                                }`}
                              >
                                {item.score.toFixed(2)}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No breakdown data available
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                Failed to load points breakdown
              </div>
            )}
          </div>
        ) : (
          // Main list view
          <div className="overflow-y-auto flex-1">
            {athletes.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No athletes found
              </div>
            ) : (
              <ul className="divide-y dark:divide-gray-700">
                {athletes.map((athlete) => {
                  const athleteId = athlete.athlete_id || athlete.id;
                  return (
                    <li key={athlete.athlete_id || athlete.id}>
                      <div
                        onClick={() => handleViewBreakdown(athleteId)}
                        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {/* Athlete Image */}
                        <div className="flex-shrink-0">
                          {athlete.image_url ? (
                            <img
                              src={athlete.image_url}
                              alt={
                                athlete.name || athlete.player_name || "Athlete"
                              }
                              className="w-12 h-12 rounded-full object-cover object-top bg-gray-100 dark:bg-gray-700"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src =
                                  "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <User size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Athlete Info */}
                        <div className="flex-1">
                          <div className="font-medium dark:text-white">
                            {athlete.name || athlete.player_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {athlete.position
                              ? athlete.position
                                  .split("-")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1)
                                  )
                                  .join(" ")
                              : "Unknown Position"}
                          </div>
                        </div>

                        {/* Athlete Stats with View Details Button */}
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {isLoadingScores
                              ? "Loading..."
                              : `${
                                  athleteScores[athleteId]?.toFixed(2) || "0.00"
                                } pts`}
                          </div>
                          <button
                            onKeyDown={(e) => handleKeyDown(e, athleteId)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={`View points breakdown for ${
                              athlete.name || athlete.player_name
                            }`}
                            tabIndex={0}
                          >
                            <ChevronRight
                              size={20}
                              className="text-gray-500 dark:text-gray-400"
                            />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
