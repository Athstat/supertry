import React, { useState } from "react";
import {
  Star,
  Zap,
  X,
  AlertCircle,
  CheckCircle,
  Trophy,
  Users,
  User,
} from "lucide-react";
import { Player } from "../../types/player";
import { positionGroups } from "../../data/positionGroups";
import { teamService } from "../../services/teamService";
import { leagueService } from "../../services/leagueService";
import { useNavigate } from "react-router-dom";

interface ReviewTeamModalProps {
  teamName: string;
  isFavorite: boolean;
  players: Record<string, Player>;
  league: any;
  onClose: () => void;
}

export function ReviewTeamModal({
  teamName,
  isFavorite,
  players,
  league,
  onClose,
}: ReviewTeamModalProps) {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCost = Object.values(players).reduce(
    (acc, player) => acc + (player.price ?? 0),
    0
  );

  const averagePR =
    Object.values(players).reduce(
      (acc, player) => acc + (player.power_rank_rating ?? 0),
      0
    ) / Object.values(players).length;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setShowConfirmModal(false);

      console.log("League: ", league, "League ID: ", league.official_league_id);

      // Submit the team to the server
      if (league && league.official_league_id) {
        // Step 1: Submit the team
        await teamService.submitTeam(
          teamName,
          players,
          league.official_league_id
        );
        // Step 2: Join the league using the recently submitted team
        await leagueService.joinLeague(league);

        // Show success modal after successful submission and joining
        setShowSuccessModal(true);
      } else {
        setSubmitError("League information is missing");
      }
    } catch (error) {
      console.error("Failed to save team or join league:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit team or join league"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLeague = () => {
    setShowSuccessModal(false);
    onClose();

    // Use the league's official ID from the league object
    const leagueId = league?.official_league_id || "1";

    navigate(`/league/${leagueId}`, {
      state: {
        league,
        teamName,
        players,
      },
    });
  };

  const handleViewTeams = () => {
    setShowSuccessModal(false);
    onClose();
    navigate("/my-teams", {
      state: {
        teamCreated: true,
        teamName,
        leagueId: league?.official_league_id,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-dark-850 border-b dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold dark:text-gray-100">Review Team</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Team Name and Favorite */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold dark:text-gray-100">{teamName}</h1>
            <div className="flex items-center">
              <Star
                size={20}
                className={`${
                  isFavorite
                    ? "text-yellow-500 fill-current"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Cost
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-500">
                {totalCost.toString()} pts
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Average PR
              </div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-500">
                {averagePR.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Players List - Compact Format */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Selected Players ({Object.keys(players).length})
            </h3>
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <ul className="divide-y dark:divide-gray-700">
                {Object.values(players).map((player) => (
                  <li key={player.id}>
                    <div className="p-3 flex items-center gap-3">
                      {/* Player Image */}
                      <div className="flex-shrink-0">
                        {player.image_url ? (
                          <img
                            src={player.image_url}
                            alt={player.name}
                            className="w-10 h-10 rounded-full object-cover object-top bg-gray-100 dark:bg-gray-700"
                            onError={(e) => {
                              // Fallback if image fails to load
                              e.currentTarget.src =
                                "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium dark:text-white truncate">
                          {player.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {player.team} • {player.position}
                        </div>
                      </div>

                      {/* Player Stats */}
                      <div className="flex flex-col items-end">
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {player.price || player.cost || 0} pts
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          PR: {player.power_rank_rating || player.pr || 0}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4 border dark:border-gray-700">
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

          {/* Error Message */}
          {submitError && (
            <div className="mt-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up">
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
                className="flex-1 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors order-2 sm:order-1 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors order-1 sm:order-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up">
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
                  onClick={handleViewTeams}
                  className="w-full dark:bg-transparent text-primary-600 dark:text-primary-400 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-primary-200 dark:border-primary-800"
                >
                  <Users size={20} />
                  View Your Teams
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
