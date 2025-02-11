import { useState } from "react";
import { Player } from "../types/player";
import { Position } from "../types/position";
import { availablePlayers } from "../data/availablePlayers";
import { positions } from "../data/positions";

export function useTeamCreation(
  maxBudget: number,
  onComplete: (
    players: Record<string, Player>,
    teamName: string,
    isFavorite: boolean
  ) => void
) {
  const [selectedPlayers, setSelectedPlayers] = useState<
    Record<string, Player>
  >({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [selectedPlayerForModal, setSelectedPlayerForModal] =
    useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentBudget =
    maxBudget -
    Object.values(selectedPlayers).reduce(
      (acc, player) => acc + player.cost,
      0
    );

  const handlePositionClick = (position: Position) => {
    setSelectedPosition(position);
    setShowPlayerList(true);
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayerForModal(player);
    setShowPlayerModal(true);
  };

  const handleAddPlayer = () => {
    if (selectedPosition && selectedPlayerForModal) {
      setSelectedPlayers({
        ...selectedPlayers,
        [selectedPosition.id]: selectedPlayerForModal,
      });
      setShowPlayerModal(false);
      setShowPlayerList(false);
      setSelectedPosition(null);
      setSelectedPlayerForModal(null);
    }
  };

  const handleRemovePlayer = (positionId: string) => {
    const newSelectedPlayers = { ...selectedPlayers };
    delete newSelectedPlayers[positionId];
    setSelectedPlayers(newSelectedPlayers);
  };

  const handleReset = () => {
    setSelectedPlayers({});
    setTeamName("");
    setIsFavorite(false);
  };

  const handleAutoGenerate = () => {
    const newSelectedPlayers: Record<string, Player> = {};
    let remainingBudget = maxBudget;

    // Helper function to get available players for a position
    const getAvailablePlayersForPosition = (positionName: string) => {
      return availablePlayers
        .filter((p) => p.position === positionName)
        .sort((a, b) => b.pr - a.pr); // Sort by performance rating
    };

    // Try to fill each position
    for (const position of positions) {
      const availableForPosition = getAvailablePlayersForPosition(
        position.name
      );

      // Find the best player we can afford
      const affordablePlayer = availableForPosition.find((player) => {
        const isNotSelected = !Object.values(newSelectedPlayers).some(
          (p) => p.id === player.id
        );
        return player.cost <= remainingBudget && isNotSelected;
      });

      if (affordablePlayer) {
        newSelectedPlayers[position.id] = affordablePlayer;
        remainingBudget -= affordablePlayer.cost;
      }
    }

    // Only update if we could fill all positions
    if (Object.keys(newSelectedPlayers).length === 5) {
      setSelectedPlayers(newSelectedPlayers);
      if (!teamName) {
        setTeamName("Auto Generated Team");
      }
    } else {
      alert(
        "Could not auto-generate a valid team within the budget. Please try manual selection."
      );
    }
  };

  return {
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
  };
}
