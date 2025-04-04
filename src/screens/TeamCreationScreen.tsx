import React, { useEffect, useState } from "react";
import {
  Zap,
  AlertCircle,
  ChevronRight,
  X,
  Users,
  Wallet,
  Star,
  ChevronLeft,
} from "lucide-react";
import { TeamHeader } from "../components/team-creation/TeamHeader";
import { TeamStats } from "../components/team-creation/TeamStats";
import { PositionGroup } from "../components/team-creation/PositionGroup";
import { useTeamCreation } from "../hooks/useTeamCreation";
import { positionGroups } from "../data/positionGroups";
import { Player } from "../types/player";
import { PlayerListModal } from "../components/team-creation/PlayerListModal";
import { PlayerDetailsModal } from "../components/team-creation/PlayerDetailsModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Position } from "../types/position";
import { leagueService } from "../services/leagueService";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { athleteService } from "../services/athleteService";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { Toast } from "../components/ui/Toast";
import { ReviewTeamModal } from "../components/team-creation/ReviewTeamModal";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Info } from "lucide-react";

interface PositionGroup {
  name: string;
  positions: Array<{
    id: string;
    name: string;
    shortName: string;
    x: number;
    y: number;
  }>;
}

// Default competition ID - this could come from a context or route param
const DEFAULT_COMPETITION_ID = "d313fbf5-c721-569b-975d-d9ec242a6f19";

// Update the StickyHeader component with improved styling
const StickyHeader = ({
  selectedCount,
  totalCount,
  budget,
  isNegativeBudget,
}: {
  selectedCount: number;
  totalCount: number;
  budget: number;
  isNegativeBudget: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-[61px] left-0 right-0 bg-white/90 dark:bg-dark-850/90  z-40 shadow-md"
    >
      <div className="container mx-auto max-w-[1024px] flex justify-between items-center py-4 px-4">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <Users size={18} className="text-primary-600 dark:text-primary-400" />
          <span className="text-gray-800 dark:text-white font-medium">
            {selectedCount}/{totalCount} players
          </span>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            isNegativeBudget
              ? "bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-300"
              : "bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-300"
          }`}
        >
          <Wallet size={18} />
          <span className="font-medium">{budget.toLocaleString()} pts</span>
        </div>
      </div>
    </motion.div>
  );
};

// Add a new component for Coach's Tips
const CoachTip = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start gap-3"
    >
      <Lightbulb
        size={20}
        className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
      />
      <div className="flex-1">
        <p className="text-blue-800 dark:text-blue-300 text-sm">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        aria-label="Dismiss tip"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

export function TeamCreationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league;

  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for players
  const [allPlayers, setAllPlayers] = useState<RugbyPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // Add toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Add state to track scrolling
  const [isScrolled, setIsScrolled] = useState(false);

  // Add this state in the TeamCreationScreen component
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Add state for coach's tips
  const [showCoachTip, setShowCoachTip] = useState(true);
  const [coachTipMessage, setCoachTipMessage] = useState(
    "Select players for each position to build your dream team. Keep an eye on your budget!"
  );

  // Function to get players by UI position
  const getPlayersByUIPosition = (
    players: RugbyPlayer[],
    uiPosition: string
  ): RugbyPlayer[] => {
    if (!players || players.length === 0) return [];

    // Get already selected player IDs to filter them out
    const selectedPlayerIds = Object.values(selectedPlayers).map(
      (player) => player.id
    );

    return players.filter((player) => {
      // Skip already selected players
      if (selectedPlayerIds.includes(player.id || "")) {
        return false;
      }

      const positionClass = (player.position_class || "").toLowerCase();

      // Map UI positions to position classes
      if (uiPosition === "Front Row") {
        return positionClass === "front-row";
      } else if (uiPosition === "Second Row") {
        return positionClass === "second-row";
      } else if (uiPosition === "Back Row") {
        return positionClass === "back-row";
      } else if (uiPosition === "Halfback") {
        return positionClass === "half-back";
      } else if (uiPosition === "Back") {
        return positionClass === "back";
      }

      // Fallback for any other positions - match exact position or position class
      return (
        positionClass === uiPosition.toLowerCase() ||
        player.position_class === uiPosition
      );
    });
  };

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        const data = await athleteService.getRugbyAthletesByCompetition(
          DEFAULT_COMPETITION_ID
        );
        //console.log("Fetched players:", data);
        setAllPlayers(data);
      } catch (err) {
        console.error("Error fetching players:", err);
        // Don't set error state here to avoid blocking the UI
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  // Fetch league config on mount
  useEffect(() => {
    const fetchLeagueConfig = async () => {
      if (!officialLeagueId) {
        setError("League ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const config = await leagueService.getLeagueConfig(officialLeagueId);
        if (config) {
          setLeagueConfig(config);
          setError(null);
        } else {
          setError("Failed to load league configuration");
        }
      } catch (err) {
        console.error("Error fetching league config:", err);
        setError("An error occurred while loading league configuration");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueConfig();
  }, [officialLeagueId]);

  // Add useEffect to scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Update the scroll event listener
  useEffect(() => {
    // Set initial scroll state
    setIsScrolled(window.scrollY > 50);

    const handleScroll = () => {
      // Show sticky header after scrolling down 50px (reduced from 100px)
      setIsScrolled(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleComplete = async (
    players: Record<string, Player>,
    teamName: string,
    isFavorite: boolean
  ) => {
    try {
      // Navigate on success
      navigate("/my-teams", {
        state: {
          teamCreated: true,
          teamName,
          players,
          isFavorite,
        },
      });
    } catch (error) {
      console.error("Failed to save team:", error);
    }
  };

  // Function to show toast
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  // Function to hide toast
  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Replace the handleReview function with this updated version
  const handleReview = () => {
    if (teamName.trim() === "") {
      showToast("Please enter a team name", "error");
      return;
    }
    if (Object.keys(selectedPlayers).length !== 5) {
      showToast("Please select all 5 players", "error");
      return;
    }
    if (currentBudget < 0) {
      showToast("You have exceeded the budget", "error");
      return;
    }

    // Show the review modal instead of navigating
    setShowReviewModal(true);
  };

  const {
    selectedPlayers,
    isFavorite,
    setIsFavorite,
    teamName,
    setTeamName,
    selectedPosition,
    showPlayerList,
    setShowPlayerList,
    showPlayerModal,
    setShowPlayerModal,
    selectedPlayerForModal,
    searchQuery,
    setSearchQuery,
    currentBudget,
    handlePositionClick,
    handlePlayerSelect,
    handleAddPlayer,
    handleRemovePlayer,
    handleReset,
    handleAutoGenerate,
    setAvailablePlayers,
  } = useTeamCreation(
    leagueConfig?.team_budget || 1000,
    handleComplete,
    allPlayers
  );

  // Update available players when allPlayers changes
  useEffect(() => {
    if (allPlayers.length > 0) {
      setAvailablePlayers(allPlayers);
    }
  }, [allPlayers, setAvailablePlayers]);

  // Add this function to handle the auto-generate button click
  const handleAutoGenerateClick = () => {
    showToast("Feature coming soon", "info");
  };

  // Function to handle player selection with animation feedback
  const handlePlayerSelectWithFeedback = (player: Player) => {
    handlePlayerSelect(player);
  };

  // Function to handle player addition with animation feedback
  const handleAddPlayerWithFeedback = (player: Player) => {
    handleAddPlayer(player);

    // Remove the success toast when a player is added to the team
    // showToast(`${player.name} added to your team!`, "success");

    // Only close the details modal, player list should remain open
    setShowPlayerModal(false);
  };

  if (isLoading || loadingPlayers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/leagues")}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Leagues
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4">
      {/* Always render the header but control visibility with CSS */}
      <div className={`${isScrolled ? "block" : "hidden"}`}>
        <StickyHeader
          selectedCount={Object.keys(selectedPlayers).length}
          totalCount={5}
          budget={currentBudget}
          isNegativeBudget={currentBudget < 0}
        />
      </div>

      <div className="container mx-auto px-4 max-w-[1024px]">
        {/* Back Button */}
        <button
          onClick={() => navigate("/leagues")}
          className="flex items-center mb-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          aria-label="Back to leagues"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back to Leagues</span>
        </button>

        {/* League Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">
            {league?.title || "Create Your Team"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select 5 players to build your dream rugby team
          </p>
        </div>

        {/* Coach's Tip */}
        {/* <AnimatePresence>
          {showCoachTip && (
            <CoachTip
              message={coachTipMessage}
              onDismiss={() => setShowCoachTip(false)}
            />
          )}
        </AnimatePresence> */}

        {/* Team Stats Card */}
        <div className="dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
          <TeamStats
            league={league}
            leagueConfig={{
              team_budget: leagueConfig?.team_budget || 1000,
              team_size: leagueConfig?.team_size || 5,
              lineup_size: leagueConfig?.lineup_size || 5,
            }}
            currentBudget={currentBudget}
            selectedPlayersCount={Object.keys(selectedPlayers).length}
            totalPositions={5}
          />

          <button
            onClick={handleAutoGenerateClick}
            disabled={true}
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-5 cursor-not-allowed opacity-50"
          >
            <Zap size={20} />
            Auto Pick Team
          </button>
        </div>

        {/* Position Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {positionGroups.map((group) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PositionGroup
                name={group.name}
                positions={group.positions as Position[]}
                selectedPlayers={selectedPlayers}
                onPositionClick={handlePositionClick}
                onRemovePlayer={handleRemovePlayer}
              />
            </motion.div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="mb-8">
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reset Selection
          </button>
        </div>

        {/* Team Name and Submit Section */}
        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-6">
          <div className="flex flex-col space-y-6">
            {/* Team Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="teamName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Team Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter a catchy team name..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-800/40 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:text-white"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                    aria-label={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Star
                      size={20}
                      className={`${
                        isFavorite
                          ? "text-yellow-500 fill-current"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Warning and Submit Button */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <AlertCircle size={20} />
                <span className="text-sm">
                  {Object.keys(selectedPlayers).length < 5
                    ? `Select ${
                        5 - Object.keys(selectedPlayers).length
                      } more player${
                        5 - Object.keys(selectedPlayers).length !== 1 ? "s" : ""
                      } to complete your team`
                    : "Your team is ready for review!"}
                </span>
              </div>
              <button
                onClick={handleReview}
                disabled={
                  Object.keys(selectedPlayers).length !== 5 ||
                  teamName.trim() === "" ||
                  currentBudget < 0
                }
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review & Submit Team
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showPlayerList && selectedPosition && (
          <PlayerListModal
            position={selectedPosition}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowPlayerList(false)}
            onSelectPlayer={handlePlayerSelectWithFeedback}
            players={getPlayersByUIPosition(allPlayers, selectedPosition.name)}
            selectedPlayers={selectedPlayers}
          />
        )}

        {showPlayerModal && selectedPlayerForModal && (
          <PlayerDetailsModal
            player={selectedPlayerForModal}
            onClose={() => setShowPlayerModal(false)}
            onAdd={handleAddPlayerWithFeedback}
          />
        )}

        {/* Toast component */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />

        {showReviewModal && (
          <ReviewTeamModal
            teamName={teamName}
            isFavorite={isFavorite}
            players={selectedPlayers}
            league={league}
            onClose={() => setShowReviewModal(false)}
          />
        )}
      </div>
    </main>
  );
}
