import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Components
import { LoadingState } from "../components/team-creation/LoadingState";
import { ErrorState } from "../components/team-creation/ErrorState";
import PlayerSelectionModal from "../components/team-creation/PlayerSelectionModal";
import TeamActions from "../components/team-creation/TeamActions";
import { teamService } from "../services/teamService";

// Refactored team creation components
import TeamCreationContainer from "./team-creation-components/TeamCreationContainer";
import PositionsGrid from "./team-creation-components/PositionsGrid";
import TeamNameInput from "./team-creation-components/TeamNameInput";
import TeamToast from "./team-creation-components/TeamToast";
import useTeamCreationState from "./team-creation-components/useTeamCreationState";
import { leagueService } from "../services/leagueService";

export function TeamCreationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league;

  // Use our centralized team creation state hook
  const {
    // Data
    allPlayers,
    positionList,

    // UI states
    isLoading,
    error,
    showPlayerSelection,
    setShowPlayerSelection,
    selectedPosition,

    // Team creation values
    teamName,
    setTeamName,
    selectedPlayers,
    handlePositionSelect,
    handlePlayerSelect,
    handleAddPlayer,
    handleRemovePlayer,
    handleReset,

    // Budget info
    teamBudget,
    remainingBudget,
    selectedPlayersCount,
    requiredPlayersCount,
    isTeamComplete,

    // Toast
    toast,
    showToast,
    hideToast,
  } = useTeamCreationState(officialLeagueId);

  // Handle team submission
  const handleSaveTeam = async () => {
    // Validate team
    if (teamName.trim() === "") {
      showToast("Please enter a team name", "error");
      return;
    }
    if (selectedPlayersCount !== requiredPlayersCount) {
      showToast(`Please select all ${requiredPlayersCount} players`, "error");
      return;
    }
    if (remainingBudget < 0) {
      showToast("You have exceeded the budget", "error");
      return;
    }
    if (!officialLeagueId) {
      showToast("League ID is required", "error");
      return;
    }

    try {
      // Convert selected players to the required format for API (IFantasyTeamAthlete)
      const teamAthletes = Object.values(selectedPlayers).map(
        (player, index) => {
          // Check if this player is in the Super Sub position
          const position = positionList.find(
            (pos) => pos.player && pos.player.id === player.id
          );
          const isSuperSub = position?.isSpecial || false;

          return {
            athlete_id: player.id,
            purchase_price: player.price,
            purchase_date: new Date(),
            is_starting: !isSuperSub, // Super Sub is not a starting player
            slot: index + 1,
            score: player.points || 0,
            is_super_sub: isSuperSub,
          };
        }
      );

      // Submit the team using the team service
      await teamService.submitTeam(teamName, teamAthletes, officialLeagueId);

      // Step 2: Join the league using the recently submitted team
      await leagueService.joinLeague(league);

      showToast("Team saved successfully!", "success");
      navigate("/my-teams");
    } catch (error) {
      console.error("Error saving team:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to save team. Please try again.",
        "error"
      );
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <TeamCreationContainer
      league={league}
      currentBudget={remainingBudget}
      totalBudget={teamBudget}
      selectedPlayersCount={selectedPlayersCount}
      requiredPlayersCount={requiredPlayersCount}
    >
      {/* Position selection grid */}
      <PositionsGrid
        positions={positionList}
        selectedPosition={selectedPosition}
        onPositionSelect={handlePositionSelect}
        onPlayerRemove={handleRemovePlayer}
      />

      {/* Team name input */}
      <TeamNameInput teamName={teamName} onTeamNameChange={setTeamName} />

      {/* Team action buttons */}
      <TeamActions
        isTeamComplete={isTeamComplete}
        onReset={handleReset}
        onSave={handleSaveTeam}
      />

      {/* Player selection modal */}
      {showPlayerSelection && selectedPosition && (
        <PlayerSelectionModal
          visible={showPlayerSelection}
          selectedPosition={selectedPosition}
          players={allPlayers}
          remainingBudget={remainingBudget}
          selectedPlayers={Object.values(selectedPlayers)}
          handlePlayerSelect={handleAddPlayer}
          onClose={() => setShowPlayerSelection(false)}
          roundId={parseInt(officialLeagueId || "0")}
        />
      )}

      {/* Toast component for notifications */}
      <TeamToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </TeamCreationContainer>
  );
}

export default TeamCreationScreen;
