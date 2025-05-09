import React, { useState, createContext, useContext } from "react";
import { Loader } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Player } from "../../types/team";
import { Position } from "../../types/position";
import { PlayerActionModal } from "../team/PlayerActionModal";
import { SwapConfirmationModal } from "../team/SwapConfirmationModal";
import PlayerSelectionModal from "../team-creation/PlayerSelectionModal";
import { usePlayerProfile } from "../../hooks/usePlayerProfile";
import { useTeamData } from "./TeamDataProvider";
import { teamService } from "../../services/teamService";
import { athleteService } from "../../services/athleteService";

// Define the context type
interface TeamActionsContextType {
  handlePlayerClick: (player: Player) => void;
  handlePositionSelect: (position: Position) => void;
  handleViewStats: (player: Player) => void;
  handleSwapPlayer: (player: Player) => void;
  fetchingMarketPlayers: boolean;
}

// Create the context
const TeamActionsContext = createContext<TeamActionsContextType | null>(null);

// Create a hook to use the context
export const useTeamActions = () => {
  const context = useContext(TeamActionsContext);
  if (!context) {
    throw new Error("useTeamActions must be used within a TeamActionsProvider");
  }
  return context;
};

interface TeamActionsProps {
  teamId: string;
  children?: React.ReactNode;
}

export const TeamActions: React.FC<TeamActionsProps> = ({
  teamId,
  children,
}) => {
  const { team, teamBudget, athletes, players, setAthletes } = useTeamData();
  const [showActionModal, setShowActionModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Player | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [positionToSwap, setPositionToSwap] = useState<string>("");
  const [teamUpdating, setTeamUpdating] = useState(false);
  const [marketPlayers, setMarketPlayers] = useState<any[]>([]);
  const [fetchingMarketPlayers, setFetchingMarketPlayers] = useState(false);

  // Get the player profile hook
  const { showPlayerProfile } = usePlayerProfile();

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowActionModal(true);
  };

  const handleViewStats = (player: Player) => {
    // Open the player profile modal
    console.log("View stats for player:", player);
    setShowActionModal(false);
    // Convert to the format expected by the profile modal
    const playerForProfile = {
      tracking_id: player.id,
      player_name: player.name,
      team_name: player.team,
      position_class: player.position,
      price: player.price,
      power_rank_rating: player.form,
      image_url: player.image,
      ball_carrying: 7,
      tackling: 6,
      points_kicking: 5,
    };

    showPlayerProfile(playerForProfile);
  };

  const handleSwapPlayer = async (player: Player) => {
    // When swapping a player, set the position based on whether it's a super sub
    let newPositionToSwap = player.is_super_sub ? "any" : player.position_class;

    // Map positions to the exact required format for position matching
    if (!player.is_super_sub) {
      // Convert to exact formats required by the filter: front-row, second-row, back-row, half-back, back
      if (player.position.toLowerCase().includes("front-row")) {
        newPositionToSwap = "front-row";
      } else if (player.position.toLowerCase().includes("second-row")) {
        newPositionToSwap = "second-row";
      } else if (player.position.toLowerCase().includes("back-row")) {
        newPositionToSwap = "back-row";
      } else if (player.position.toLowerCase().includes("half-back")) {
        newPositionToSwap = "half-back";
      } else if (player.position.toLowerCase().includes("back")) {
        newPositionToSwap = "back";
      }
    }

    setPositionToSwap(newPositionToSwap);
    console.log(
      "Position to swap set to:",
      newPositionToSwap,
      "Is super sub?",
      player.is_super_sub
    );

    // Fetch market players when initiating a swap
    try {
      setFetchingMarketPlayers(true);

      // Use the league ID from the team object or fallback to a default
      console.log(
        "Fetching market players for league:",
        team?.official_league_id
      );

      // First try with official_league_id
      const players = await athleteService.getRugbyAthletesByCompetition(
        team?.official_league_id || ""
      );

      // If we didn't get any players, try with the fallback mock data
      if (!players || players.length === 0) {
        console.log(
          "No players found with official_league_id, using mock data"
        );
        return;
      }

      setMarketPlayers(players);
    } catch (error) {
      console.error("Failed to fetch market players:", error);
    } finally {
      setFetchingMarketPlayers(false);
    }

    setIsSwapping(true);
    setSelectedPlayer(player); // Ensure selected player is set
    setShowActionModal(false);
  };

  const handlePlayerSelect = (player: Player) => {
    setNewPlayer(player);
    setShowSwapModal(true);
  };

  const handleConfirmSwap = async () => {
    if (!selectedPlayer || !newPlayer || !teamId) return;

    try {
      setTeamUpdating(true);

      // Find the player to replace in athletes
      const updatedAthletes = [...athletes];
      const playerIndex = updatedAthletes.findIndex(
        (a: any) =>
          a.athlete_id === selectedPlayer.id || a.id === selectedPlayer.id
      );

      if (playerIndex === -1) {
        console.error("Player not found in team");
        return;
      }

      // Create an updated athlete object for the new player
      const replacementAthlete = {
        ...updatedAthletes[playerIndex],
        athlete_id: newPlayer.id,
        player_name: newPlayer.name,
        position_class: selectedPlayer.is_super_sub
          ? selectedPlayer.position
          : newPlayer.position,
        team_name: newPlayer.team,
        price: newPlayer.price,
        power_rank_rating: newPlayer.form,
        image_url: newPlayer.image,
        is_super_sub: selectedPlayer.is_super_sub,
        is_starting: !selectedPlayer.is_super_sub, // Super Sub is not a starting player
      };

      // Replace the old athlete with the new one
      updatedAthletes[playerIndex] = replacementAthlete;

      // Send the update to the server
      await teamService.updateTeamAthletes(updatedAthletes, teamId);

      // Update local state
      setAthletes(updatedAthletes);

      // Reset UI state
      setShowSwapModal(false);
      setSelectedPlayer(null);
      setNewPlayer(null);
      setIsSwapping(false);
    } catch (error) {
      console.error("Failed to swap player:", error);
      // Here you might want to show an error notification
    } finally {
      setTeamUpdating(false);
    }
  };

  const cancelSwap = () => {
    setShowSwapModal(false);
    setNewPlayer(null);
  };

  const closeAllModals = () => {
    setShowActionModal(false);
    setShowSwapModal(false);
    setShowStatsModal(false);
    setIsSwapping(false);
    setSelectedPlayer(null);
    setNewPlayer(null);
  };

  // Handle position selection from the Edit Team view
  const handlePositionSelect = (position: Position) => {
    // Convert position to player format for the PlayerActionModal
    const playerForPosition: Player = {
      id: position.player?.id || "",
      name: position.player?.name || "",
      position: position.player?.position || "",
      position_class: position.player?.position || "",
      team: position.player?.team || "",
      points: position.player?.points || 0,
      form: position.player?.power_rank_rating || 0,
      price: position.player?.price || 0,
      is_super_sub: position.isSpecial || false,
      is_starting: !position.isSpecial,
      image: position.player?.image_url || "",
      nextFixture: "",
    };

    handlePlayerClick(playerForPosition);
  };

  // Create the context value
  const contextValue: TeamActionsContextType = {
    handlePlayerClick,
    handlePositionSelect,
    handleViewStats,
    handleSwapPlayer,
    fetchingMarketPlayers,
  };

  return (
    <TeamActionsContext.Provider value={contextValue}>
      {/* Render children components that can access the context */}
      {children}

      {/* Player Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedPlayer && (
          <PlayerActionModal
            player={selectedPlayer}
            onClose={() => setShowActionModal(false)}
            onViewStats={handleViewStats}
            onSwapPlayer={handleSwapPlayer}
          />
        )}
      </AnimatePresence>

      {/* Loading indicator when fetching market players but not yet showing modal */}
      {fetchingMarketPlayers && !isSwapping && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader size={32} className="text-primary-500 animate-spin mb-4" />
            <p className="text-gray-800 dark:text-gray-200">
              Loading players...
            </p>
          </div>
        </div>
      )}

      {/* Player Selection Modal for Swapping */}
      {isSwapping && selectedPlayer && (
        <PlayerSelectionModal
          visible={isSwapping}
          selectedPosition={{
            id: positionToSwap === "any" ? "any" : positionToSwap,
            name: positionToSwap === "any" ? "Any Position" : positionToSwap,
            shortName:
              positionToSwap === "any"
                ? "ANY"
                : positionToSwap.substring(0, 2).toUpperCase(),
            x: "0",
            y: "0",
            // Using ID "any" to identify the super sub position instead of isSpecial flag
          }}
          players={marketPlayers}
          remainingBudget={
            selectedPlayer ? teamBudget + selectedPlayer.price : teamBudget
          }
          // Filter out the currently selected player to allow selecting new players
          selectedPlayers={players
            .filter((p) => p.id !== selectedPlayer?.id)
            .map((p) => ({
              id: p.id,
              name: p.name,
              team: p.team,
              position: p.position,
              price: p.price,
              points: p.points,
              image_url: p.image,
              power_rank_rating: p.form,
            }))}
          handlePlayerSelect={(p: any) => {
            // Convert from player.ts Player type to team.ts Player type
            const convertedPlayer: Player = {
              id: p.id,
              name: p.name,
              team: p.team,
              position: p.position,
              position_class: p.position,
              points: p.points,
              price: p.price,
              form: p.power_rank_rating || 0,
              image: p.image_url || "",
              is_starting: true,
              is_super_sub: false,
              nextFixture: "",
            };
            handlePlayerSelect(convertedPlayer);
          }}
          onClose={() => setIsSwapping(false)}
          roundId={1}
        />
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showSwapModal && selectedPlayer && newPlayer && (
          <SwapConfirmationModal
            currentPlayer={selectedPlayer}
            newPlayer={newPlayer}
            onClose={cancelSwap}
            onConfirm={handleConfirmSwap}
          />
        )}
      </AnimatePresence>
    </TeamActionsContext.Provider>
  );
};
