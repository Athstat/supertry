import React, { useEffect, useState } from "react";
import { Zap, AlertCircle, ChevronRight, X, Users, Wallet } from "lucide-react";
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
const DEFAULT_COMPETITION_ID = "b5cae2ff-d123-5f12-a771-5faa6d40e967";

// Update the StickyHeader component with a border-top that matches the background
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
    <div className="fixed top-[61px] left-0 right-0 bg-white/80 dark:bg-dark-850/80 backdrop-blur-sm z-40 flex items-center px-4">
      <div className="container mx-auto max-w-[1024px] flex justify-between items-center py-3">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5">
          <Users size={16} className="text-primary-600 dark:text-primary-400" />
          <span className="text-gray-800 dark:text-white font-medium text-sm">
            {selectedCount}/{totalCount} players
          </span>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${
            isNegativeBudget
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              : "bg-green-100 text-green-700 dark:bg-gray-800 dark:text-green-400"
          }`}
        >
          <Wallet size={16} />
          <span className="font-medium text-sm">
            {budget.toLocaleString()} pts
          </span>
        </div>
      </div>
    </div>
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
      if (selectedPlayerIds.includes(player.id)) {
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
        player.position === uiPosition
      );
    });
  };

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        const data = await athleteService.getAthletesByCompetition(
          DEFAULT_COMPETITION_ID
        );
        console.log("Fetched players:", data);
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
    // if (Object.keys(selectedPlayers).length !== 5) {
    //   showToast("Please select all 5 players", "error");
    //   return;
    // }
    // if (currentBudget < 0) {
    //   showToast("You have exceeded the budget", "error");
    //   return;
    // }

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
        <div className="dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
            Create Your Team
          </h1>

          <TeamHeader
            teamName={teamName}
            setTeamName={setTeamName}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
          />

          <TeamStats
            league={league}
            leagueConfig={
              leagueConfig || {
                team_budget: 1000,
                team_size: 5,
                lineup_size: 5,
              }
            }
            currentBudget={currentBudget}
            selectedPlayersCount={Object.keys(selectedPlayers).length}
            totalPositions={5}
          />

          <button
            onClick={handleAutoGenerateClick}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mt-5"
          >
            <Zap size={20} />
            Auto Pick Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positionGroups.map((group) => (
            <PositionGroup
              key={group.name}
              name={group.name}
              positions={group.positions}
              selectedPlayers={selectedPlayers}
              onPositionClick={handlePositionClick}
              onRemovePlayer={handleRemovePlayer}
            />
          ))}
        </div>

        <div className="space-y-3 mb-6 mt-6">
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reset Selection
          </button>
        </div>

        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertCircle size={20} />
              <span className="text-sm">
                Select all 5 players to complete your team
              </span>
            </div>
            <button
              onClick={handleReview}
              disabled={false}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review & Submit Team
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {showPlayerList && selectedPosition && (
          <PlayerListModal
            position={selectedPosition}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowPlayerList(false)}
            onSelectPlayer={handlePlayerSelect}
            players={getPlayersByUIPosition(allPlayers, selectedPosition.name)}
            selectedPlayers={selectedPlayers}
          />
        )}

        {showPlayerModal && selectedPlayerForModal && (
          <PlayerDetailsModal
            player={selectedPlayerForModal}
            onClose={() => setShowPlayerModal(false)}
            onAdd={handleAddPlayer}
          />
        )}

        {/* Add Toast component */}
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
