import { useLocation, useNavigate, useParams } from "react-router-dom";
import { requestPushPermissions } from "../utils/bridgeUtils";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Components
import { LoadingState } from "../components/team-creation/LoadingState";
import { ErrorState } from "../components/team-creation/ErrorState";
import PlayerSelectionModal from "../components/team-creation/PlayerSelectionModal";
import TeamActions from "../components/team-creation/TeamActions";
import { fantasyTeamService } from "../services/teamService";
import { ArrowRight, Check, Trophy, Users } from "lucide-react";

// Refactored team creation components
import TeamCreationContainer from "./team-creation-components/TeamCreationContainer";
import PositionsGrid from "./team-creation-components/PositionsGrid";
import TeamNameInput from "./team-creation-components/TeamNameInput";
import TeamToast from "./team-creation-components/TeamToast";
import useTeamCreationState from "./team-creation-components/useTeamCreationState";
import { leagueService } from "../services/leagueService";
import { URC_COMPETIION_ID } from "../types/constants";
import { IFantasyLeague } from "../types/fantasyLeague";
import { useTeamCreationGuard } from "../hooks/useTeamCreationGuard";
import PrimaryButton from "../components/shared/buttons/PrimaryButton";

// Success Modal Component
interface SuccessModalProps {
  isVisible: boolean;
  teamName: string;
  leagueName: string;
  onClose: () => void;
  onGoToLeague: () => void;
  onViewTeam: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  teamName,
  leagueName,
  // onClose,
  onGoToLeague,
  onViewTeam,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6 transform transition-all animate-fade-scale-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">
            Team Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Congratulations! Your team "{teamName}" has been successfully
            submitted to the {leagueName} league.
          </p>
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={onGoToLeague}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Trophy size={20} />
              Go to League
            </motion.button>
            <motion.button
              onClick={onViewTeam}
              className="w-full dark:bg-transparent text-primary-600 dark:text-primary-400 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-primary-200 dark:border-primary-800"
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Users size={20} />
              View Your Team
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function TeamCreationScreen() {

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league ? location.state?.league as IFantasyLeague : undefined;
  const { isTeamCreationLocked, hasCreatedTeam, rankedUserTeam, userTeam } = useTeamCreationGuard(league);

  // Check if coming from welcome screen
  const isFromWelcome = location.state?.from === "welcome";
  const isLocked = isTeamCreationLocked;


  useEffect(() => {
    // Request user notification permissions
    requestPushPermissions();
  }, []);

  // .....

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
    setIsSaving(true);
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
      const result = await fantasyTeamService.submitTeam(
        teamName,
        teamAthletes,
        officialLeagueId
      );

      // Store the created team ID for navigation
      console.log("Result from team screation ", result);
      setCreatedTeamId(result.id);
      
      // Step 2: Join the league using the recently submitted team
      const joinLeagueRes = await leagueService.joinLeague(league);
      console.log("Result from join res ", joinLeagueRes);

      // Step 3: Request push notification permissions after successful team creation
      // requestPushPermissions(); Used to be here

      // Show success modal instead of navigating away
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving team:", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Failed to save team. Please try again.",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state while fetching initial data
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState error={error} isFromWelcome={isFromWelcome} />;
  }

  if (userTeam && hasCreatedTeam) {

    const handleViewTeam = () => {

      const uri = `/my-team/${userTeam.team_id}`;
      navigate(uri, {
        state: { teamWithRank: rankedUserTeam, leagueInfo: league, team: userTeam}
      });
    }

    return (
      <div className="w-full h-[70vh] flex flex-col gap-4 items-center justify-center px-10 lg:px-[30%]" >
        <p className="text-center text-slate-700 dark:text-slate-300" >You have already created a team for {league?.title || " this league"}. You can only create one team for each fantasy league!</p>
        <PrimaryButton onClick={handleViewTeam} className="flex flex-row items-center gap-1" >
          View Team
          <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    )
  }

  return (
    <TeamCreationContainer
      league={league}
      currentBudget={remainingBudget}
      totalBudget={teamBudget}
      selectedPlayersCount={selectedPlayersCount}
      requiredPlayersCount={requiredPlayersCount}
      isFromWelcome={isFromWelcome}
      isLocked={isLocked}
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
        isLoading={isSaving}
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
          roundStart={league?.start_round ?? 0}
          roundEnd={league?.end_round ?? 0}
          competitionId={officialLeagueId ?? URC_COMPETIION_ID}
        />
      )}

      {/* Toast component for notifications */}
      <TeamToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Success Modal */}
      <SuccessModal
        isVisible={showSuccessModal}
        teamName={teamName}
        leagueName={league?.title ?? "League"}
        onClose={() => setShowSuccessModal(false)}
        onGoToLeague={() => {
          setShowSuccessModal(false);
          // Navigate to the specific league with the league object as state
          navigate(`/league/${officialLeagueId}`, {
            state: {
              league,
              from: "team-creation",
            },
          });
        }}
        onViewTeam={() => {
          setShowSuccessModal(false);
            navigate("/my-teams");
        }}
      />
    </TeamCreationContainer>
  );
}

export default TeamCreationScreen;
