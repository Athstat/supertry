import { RugbyPlayer } from "../types/rugbyPlayer";
import { Player } from "../types/player";

export const getPlayersByUIPosition = (
  players: RugbyPlayer[],
  uiPosition: string,
  selectedPlayers: Record<string, Player>
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
