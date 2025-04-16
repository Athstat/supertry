import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Components
import { StickyHeader } from "../components/team-creation/StickyHeader";
import { CoachTip } from "../components/team-creation/CoachTip";
import { TeamCreationHeader } from "../components/team-creation/TeamCreationHeader";
import { TeamStatCard } from "../components/team-creation/TeamStatCard";
import { PositionGroup } from "../components/team-creation/PositionGroup";
import { ResetButton } from "../components/team-creation/ResetButton";
import { TeamNameInput } from "../components/team-creation/TeamNameInput";
import { SubmitSection } from "../components/team-creation/SubmitSection";
import { PlayerListModal } from "../components/team-creation/PlayerListModal";
import { PlayerDetailsModal } from "../components/team-creation/PlayerDetailsModal";
import { ReviewTeamModal } from "../components/team-creation/ReviewTeamModal";
import { Toast } from "../components/ui/Toast";
import { LoadingState } from "../components/team-creation/LoadingState";
import { ErrorState } from "../components/team-creation/ErrorState";

// Hooks, services and utils
import { useTeamCreation } from "../hooks/useTeamCreation";
import { leagueService } from "../services/leagueService";
import { athleteService } from "../services/athleteService";
import { getPlayersByUIPosition } from "../utils/playerUtils";

// Types and data
import { positionGroups } from "../data/positionGroups";
import { Position } from "../types/position";
import { Player } from "../types/player";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { IGamesLeagueConfig } from "../types/leagueConfig";

// Default competition ID - this could come from a context or route param
const DEFAULT_COMPETITION_ID = "d313fbf5-c721-569b-975d-d9ec242a6f19";

export function TeamCreationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league;

  // League and players data states
  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(
    null
  );
  const [allPlayers, setAllPlayers] = useState<RugbyPlayer[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCoachTip, setShowCoachTip] = useState(true);
  const [coachTipMessage] = useState(
    "Select players for each position to build your dream team. Keep an eye on your budget!"
  );

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // Get team creation state and methods from custom hook
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

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        const data = await athleteService.getRugbyAthletesByCompetition(
          DEFAULT_COMPETITION_ID
        );
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

  // Update available players when allPlayers changes
  useEffect(() => {
    if (allPlayers.length > 0) {
      setAvailablePlayers(allPlayers);
    }
  }, [allPlayers, setAvailablePlayers]);

  // Function to handle team completion
  async function handleComplete(
    players: Record<string, Player>,
    teamName: string,
    isFavorite: boolean
  ) {
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
  }

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

  // Function to handle the review button click
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

    // Show the review modal
    setShowReviewModal(true);
  };

  // Function to handle auto-generate button click
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
    // Only close the details modal, player list should remain open
    setShowPlayerModal(false);
  };

  // Show loading state while fetching initial data
  if (isLoading || loadingPlayers) {
    return <LoadingState />;
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState error={error} />;
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
        {/* Header Section */}
        <TeamCreationHeader title={league?.title || "Create Your Team"} />

        {/* Coach's Tip */}
        <AnimatePresence>
          {showCoachTip && (
            <CoachTip
              message={coachTipMessage}
              onDismiss={() => setShowCoachTip(false)}
            />
          )}
        </AnimatePresence>

        {/* Team Stats Card */}
        <TeamStatCard
          league={league}
          leagueConfig={{
            team_budget: leagueConfig?.team_budget || 1000,
            team_size: leagueConfig?.team_size || 5,
            lineup_size: leagueConfig?.lineup_size || 5,
          }}
          currentBudget={currentBudget}
          selectedPlayersCount={Object.keys(selectedPlayers).length}
          totalPositions={5}
          onAutoGenerate={handleAutoGenerateClick}
        />

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
        <ResetButton onReset={handleReset} />

        {/* Team Name and Submit Section */}
        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-6">
          <div className="flex flex-col space-y-6">
            {/* Team Name Input */}
            <TeamNameInput
              teamName={teamName}
              setTeamName={setTeamName}
              isFavorite={isFavorite}
              setIsFavorite={setIsFavorite}
            />

            {/* Warning and Submit Button */}
            <SubmitSection
              selectedPlayersCount={Object.keys(selectedPlayers).length}
              totalPositions={5}
              teamName={teamName}
              currentBudget={currentBudget}
              onReview={handleReview}
            />
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
            players={getPlayersByUIPosition(
              allPlayers,
              selectedPosition.name,
              selectedPlayers
            )}
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

        {showReviewModal && (
          <ReviewTeamModal
            teamName={teamName}
            isFavorite={isFavorite}
            players={selectedPlayers}
            league={league}
            onClose={() => setShowReviewModal(false)}
          />
        )}

        {/* Toast component */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </main>
  );
}
