import { useMemo } from "react";
import { Player } from "../../../types/player";
import { Position } from "../../../types/position";

interface UsePlayersFilterProps {
  players: any[];
  selectedPosition: Position;
  searchQuery: string;
  teamFilter: string[];
  remainingBudget: number;
  selectedPlayers: Player[];
  sortBy: "price" | "rating" | "attack" | "defense" | "kicking";
  sortOrder: "asc" | "desc";
}

export const usePlayersFilter = ({
  players,
  selectedPosition,
  searchQuery,
  teamFilter,
  remainingBudget,
  selectedPlayers,
  sortBy,
  sortOrder,
}: UsePlayersFilterProps) => {
  // Filter players based on criteria
  const filteredPlayers = useMemo(() => {
    if (!players || !selectedPosition) return [];

    console.log("Filtering players for position:", selectedPosition);
    console.log("Total players available:", players.length);
    console.log(
      "Selected Position ID:",
      selectedPosition.id,
      "Is 'any' position?",
      selectedPosition.id === "any" ? "YES" : "NO"
    );
    console.log(
      "Sample player structure:",
      players.length > 0 ? JSON.stringify(players[0]) : "No players"
    );

    return players.filter((player) => {
      // Check for position matching
      let matchesPosition = false;

      // Determine if we're in the Team Creation Screen or My Team Screen context
      // Team Creation Screen uses position names like "Front Row", "Second Row", etc.
      // MyTeamScreen uses position names that match the position class values directly ("front-row", "second-row", etc.)

      // Better detection using position name format:
      // - If name contains a space: Team Creation Screen (e.g., "Front Row")
      // - If name contains a dash: My Team Screen (e.g., "front-row")
      // - Special case for "any" which is used in MyTeamScreen
      const isMyTeamScreen =
        selectedPosition.name.includes("-") ||
        selectedPosition.name === "any" ||
        selectedPosition.name === "Any Position";

      console.log(
        "Context detection:",
        isMyTeamScreen ? "MyTeamScreen" : "TeamCreationScreen",
        "Position name:",
        selectedPosition.name,
        "Position ID:",
        selectedPosition.id
      );

      // Check for Super Sub position in both screens - allow any player for Super Sub
      if (
        selectedPosition.id === "any" ||
        selectedPosition.name === "Super Sub" ||
        (selectedPosition as any).positionClass === "super-sub" ||
        (selectedPosition as any).isSpecial === true
      ) {
        // For super sub position, allow any player regardless of position
        console.log("Super Sub position detected - allowing all players");
        matchesPosition = true;
      } else if (isMyTeamScreen) {
        // MyTeamScreen path - stricter position matching
        // Extract player position values - use either position or position_class field
        const playerPosition = player.position || "";
        const playerPositionClass = player.position_class || "";

        // Check if player's position_class matches one of the 5 rugby positions exactly
        // Only match the specific formats: front-row, second-row, back-row, half-back, back
        switch (selectedPosition.name) {
          case "front-row":
            matchesPosition = playerPositionClass === "front-row";
            break;
          case "second-row":
            matchesPosition = playerPositionClass === "second-row";
            break;
          case "back-row":
            matchesPosition = playerPositionClass === "back-row";
            break;
          case "half-back":
            matchesPosition = playerPositionClass === "half-back";
            break;
          case "back":
            matchesPosition = playerPositionClass === "back";
            break;
          default:
            // Direct match with the position string as fallback
            matchesPosition = playerPositionClass === selectedPosition.name;
        }
      } else {
        // TeamCreationScreen path - original less strict position matching
        // The Team Creation Screen position.name value is like "Front Row" but we need to match with
        // player position_class which may be "front-row"
        const playerPosition = player.position || "";
        const playerPositionClass = player.position_class || "";

        // For TeamCreationScreen, map position names to position classes for more accurate matching
        let positionClassToMatch = "";
        if (selectedPosition.name === "Front Row")
          positionClassToMatch = "front-row";
        else if (selectedPosition.name === "Second Row")
          positionClassToMatch = "second-row";
        else if (selectedPosition.name === "Back Row")
          positionClassToMatch = "back-row";
        else if (
          selectedPosition.name === "Halfback" ||
          selectedPosition.name === "Half Back"
        )
          positionClassToMatch = "half-back";
        else if (selectedPosition.name === "Back")
          positionClassToMatch = "back";
        else if (selectedPosition.name === "Super Sub")
          positionClassToMatch = "super-sub";
        else if (selectedPosition.name === "Any Position")
          positionClassToMatch = "any";

        console.log(
          "TeamCreationScreen matching",
          selectedPosition.name,
          "->",
          positionClassToMatch,
          "against player position:",
          playerPositionClass
        );

        // Match using direct position class comparison for more accurate results
        // Or fallback to the original substring method if no mapping is found
        matchesPosition =
          selectedPosition.name === "Any Position" || // Always match for Any Position
          (positionClassToMatch &&
            playerPositionClass === positionClassToMatch) || // Direct match by position class
          (!positionClassToMatch && // Fallback to substring matching only if no mapping exists
            ((playerPosition &&
              playerPosition
                .toLowerCase()
                .includes(selectedPosition.name.toLowerCase())) ||
              (playerPositionClass &&
                playerPositionClass
                  .toLowerCase()
                  .includes(selectedPosition.name.toLowerCase()))));
      }

      // If we're not matching the position, skip this player
      if (!matchesPosition) return false;

      // Search query matching
      const matchesSearch =
        searchQuery === "" ||
        player.player_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team_name?.toLowerCase().includes(searchQuery.toLowerCase());

      // Team filter matching
      const matchesTeam =
        teamFilter.length === 0 || teamFilter.includes(player.team_id);

      // Already selected check - don't show already selected players
      const isAlreadySelected = selectedPlayers.some(
        (p) => p.id === player.id || p.id === player.tracking_id
      );

      // Budget check
      const isAffordable = player.price <= remainingBudget;

      // Apply all filters
      return (
        matchesPosition &&
        matchesSearch &&
        matchesTeam &&
        !isAlreadySelected &&
        isAffordable
      );
    });
  }, [
    players,
    selectedPosition,
    searchQuery,
    teamFilter,
    selectedPlayers,
    remainingBudget,
  ]);

  // Sort players
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      switch (sortBy) {
        case "price":
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case "rating":
          aValue = a.power_rank_rating || 0;
          bValue = b.power_rank_rating || 0;
          break;
        case "attack":
          aValue = a.ball_carrying || 0;
          bValue = b.ball_carrying || 0;
          break;
        case "defense":
          aValue = a.tackling || 0;
          bValue = b.tackling || 0;
          break;
        case "kicking":
          aValue = a.points_kicking || 0;
          bValue = b.points_kicking || 0;
          break;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [filteredPlayers, sortBy, sortOrder]);

  return {
    filteredPlayers,
    sortedPlayers,
    filteredCount: filteredPlayers.length,
  };
};

export default usePlayersFilter;
