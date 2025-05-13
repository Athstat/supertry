import React, { useState, useEffect } from "react";
import {
  Star,
  Zap,
  ChevronLeft,
  Edit2,
  AlertCircle,
  LayoutGrid,
  List,
  CheckCircle,
  Trophy,
  Users,
} from "lucide-react";
import { Position } from "../types/position";
import { Player } from "../types/player";
import { positionGroups } from "../data/positionGroups";
import { useNavigate, useLocation } from "react-router-dom";
import { fantasyTeamService } from "../services/teamService";

interface ReviewTeamScreenProps {
  teamName: string;
  isFavorite: boolean;
  selectedPlayers: Record<string, Player>;
  onEdit: () => void;
  onSubmit: () => void;
  onToggleFavorite: () => void;
}

type ViewMode = "list" | "grid";

export function ReviewTeamScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { players, teamName, isFavorite, league } = location.state || {};

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const totalCost = Object.values(players as Record<string, Player>).reduce(
    (acc, player) => acc + (player.price ?? 0),
    0
  );
  console.log("players: ", players);
  const averagePR =
    Object.values(players as Record<string, Player>).reduce(
      (acc, player) => acc + (player.power_rank_rating ?? 0),
      0
    ) / 15;

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = () => {
    navigate(-1); // Go back to team creation
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setShowConfirmModal(false);

      // Submit the team to the server
      if (league && league.official_league_id) {
        await fantasyTeamService.submitTeam(
          teamName,
          players,
          league.official_league_id
        );

        // Show success modal after successful submission
        setShowSuccessModal(true);
      } else {
        setSubmitError("League information is missing");
      }
    } catch (error) {
      console.error("Failed to save team:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit team"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSuccess = () => {
    handleSubmit();
  };

  const handleGoToLeague = () => {
    setShowSuccessModal(false);
    navigate("/league/1", {
      state: {
        league,
        teamName,
        players,
      },
    });
  };

  const handleViewTeam = () => {
    setShowSuccessModal(false);
    // Generate a temporary team ID (in a real app, this would come from the backend)
    const teamId = Date.now().toString();
    navigate(`/my-team/${teamId}`, {
      state: {
        team: {
          id: teamId,
          name: teamName,
          players: Object.values(players as Record<string, Player>).map(
            (player) => ({
              ...player,
              isSubstitute: false, // Set initial substitute status
            })
          ),
          league: league,
          isFavorite: isFavorite,
          totalPoints: 0, // Initial points
          rank: null, // Initial rank
        },
      },
    });
  };

  // Add useEffect to scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 px-2 sm:py-6 sm:px-4">
      <div className="container mx-auto max-w-[1400px]">
        {/* Header Card */}
        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4 sm:p-6 mb-4 sm:mb-6 ">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleEdit}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-2 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Edit Team</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
              <button
                onClick={() => {}}
                className={`${
                  isFavorite
                    ? "text-yellow-500"
                    : "text-gray-400 dark:text-gray-500"
                } hover:text-yellow-500 p-2 rounded-lg transition-colors`}
              >
                <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-gray-100">
            {teamName}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3 sm:p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Cost
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-500">
                {totalCost.toString()} pts
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3 sm:p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average PR
              </div>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                {averagePR.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Position Groups */}
        <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
          {positionGroups.map((group) => (
            <div
              key={group.name}
              className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold dark:text-gray-100">
                  {group.name}
                </h2>
              </div>

              {viewMode === "list" ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-dark-800/40">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                          <div className="w-40">Player</div>
                        </th>
                        <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Position
                        </th>
                        <th className="py-3 px-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Team
                        </th>
                        <th className="py-3 px-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          PR
                        </th>
                        <th className="py-3 px-2 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          Cost
                        </th>
                        <th className="py-3 px-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {group.positions.map((position) => {
                        const player = players[position.id];
                        if (!player) return null;

                        return (
                          <tr
                            key={position.id}
                            className="hover:bg-gray-50 dark:hover:bg-dark-800"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={player.image_url}
                                  alt={player.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.src =
                                      "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                                  }}
                                />
                                <span className="font-medium truncate dark:text-gray-100">
                                  {player.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {position.name}
                            </td>
                            <td className="py-3 px-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              {player.team}
                            </td>
                            <td className="py-3 px-2 text-right font-medium text-yellow-600 dark:text-yellow-500 whitespace-nowrap">
                              {player.power_rank_rating}
                            </td>
                            <td className="py-3 px-2 text-right font-medium text-green-600 dark:text-green-500 whitespace-nowrap">
                              {player.price} pts
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex justify-center">
                                <button
                                  onClick={handleEdit}
                                  className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                  {group.positions.map((position) => {
                    const player = players[position.id];
                    if (!player) return null;

                    return (
                      <div key={position.id} className="relative">
                        <div className="bg-white dark:bg-dark-800/40 rounded-lg shadow-sm dark:shadow-dark-sm p-3">
                          <button
                            onClick={handleEdit}
                            className="absolute -top-2 -right-2 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-full p-1.5 hover:bg-gray-200 dark:hover:bg-dark-600 z-10 transition-colors"
                            aria-label="Edit player"
                          >
                            <Edit2 size={14} />
                          </button>
                          <div className="w-full h-20 relative">
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-full h-full object-cover rounded absolute inset-0"
                            />
                          </div>
                          <div className="text-sm font-semibold truncate mt-2 dark:text-gray-100">
                            {player.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {position.name}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Zap size={14} className="text-yellow-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                PR: {player.pr}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-green-600 dark:text-green-500">
                              {player.cost} pts
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Section */}
        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4 sm:p-6 max-w-2xl mx-auto mt-10">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">
                Please review your team carefully before submitting
              </span>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all active:transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                  Submitting...
                </span>
              ) : (
                "Submit Team"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up ">
            <h2 className="text-2xl font-bold mb-4 dark:text-gray-100">
              Confirm Submission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to submit your team? You won't be able to
              make changes after submission.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold  hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors order-2 sm:order-1 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSuccess}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors order-1 sm:order-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up ">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">
                Team Submitted!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Congratulations! Your team has been successfully submitted to
                Premier Weekly League.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToLeague}
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                  <Trophy size={20} />
                  Go to League
                </button>
                <button
                  onClick={handleViewTeam}
                  className="w-full bg-white dark:bg-dark-850 text-primary-600 dark:text-primary-400 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  View Your Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        </div>
      )}
    </main>
  );
}
