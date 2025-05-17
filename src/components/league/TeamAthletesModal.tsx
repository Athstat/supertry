import React, { useState } from "react";
import { X, User, ChevronRight, ChevronLeft } from "lucide-react";
import { RankedFantasyTeam } from "../../types/league";
import { PointsBreakdownItem } from "../../services/athleteService";
import { formatAction, formatPosition } from "../../utils/athleteUtils";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import { useAthletePointsBreakdown } from "../../hooks/useAthletePointsBreakdown";
import { twMerge } from "tailwind-merge";

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

interface TeamAthletesModalProps {
  team: RankedFantasyTeam;
  athletes: Athlete[];
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

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
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
          <div className="overflow-y-auto">
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
          <div className="overflow-y-auto flex-1">
            {athletes.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No athletes found
              </div>
            ) : (
              <ul className="divide-y dark:divide-gray-700">
                {athletes.map((athlete, index) => {
                  return (
                    <TeamAthleteListItem
                      athlete={athlete}
                      key={index}
                      handleKeyDown={handleKeyDown}
                      handleViewBreakdown={handleViewBreakdown}
                    />
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

type ListItemProps = {
  athlete: RugbyPlayer;
  handleViewBreakdown: (
    athleteId: string,
    pointsBreakDown: PointsBreakdownItem[]
  ) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLButtonElement>,
    athleteId: string,
    pointsBreakDown: PointsBreakdownItem[]
  ) => void;
};

function TeamAthleteListItem({
  athlete,
  handleViewBreakdown,
  handleKeyDown,
}: ListItemProps) {
  const athleteId = athlete.id ?? "fall-back-id";

  const { data: points, isLoading } = useAthletePointsBreakdown(
    athlete.tracking_id ?? "default-tracking-id"
  );

  const totalScore: number = points
    ? points.reduce((currTotal, action) => {
        return currTotal + action.score;
      }, 0)
    : 0;

  const isSub = !athlete.is_starting;

  console.log("Points Breakdown 2.0", athlete.player_name, points);

  return (
    <li>
      <div
        onClick={() => handleViewBreakdown(athleteId, points ?? [])}
        aria-disabled={isLoading}
        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {/* Athlete Image */}
        <div className="flex-shrink-0">
          {athlete.image_url ? (
            <img
              src={athlete.image_url}
              alt={athlete.player_name || "Athlete"}
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
            {athlete.player_name}
          </div>
          <div
            className={twMerge(
              "text-sm text-gray-500 dark:text-gray-400 w-fit rounded-xl",
              isSub &&
                "bg-orange-600 w-fit font-bold px-2 text-white dark:text-white"
            )}
          >
            {formatPosition(athlete.position ?? "")}{" "}
            {isSub ? "· Super Sub 🌟" : ""}
          </div>
        </div>

        {/* Athlete Stats with View Details Button */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading && (
              <p className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse"></p>
            )}
            {!isLoading && <p>{totalScore?.toFixed(1)}</p>}
          </div>
          <button
            onKeyDown={(e) => handleKeyDown(e, athleteId, points ?? [])}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`View points breakdown for ${athlete.player_name}`}
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
          className={`font-bold ${
            isPositive
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
