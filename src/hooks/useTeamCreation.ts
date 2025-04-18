import { useState, useCallback, useEffect } from "react";
import { Player } from "../types/player";
import { Position } from "../types/position";
import { RugbyPlayer } from "../types/rugbyPlayer";

export function useTeamCreation(
  budget: number,
  onComplete: (
    players: Record<string, Player>,
    teamName: string,
    isFavorite: boolean
  ) => void,
  serverPlayers: RugbyPlayer[] = []
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
  const [availablePlayers, setAvailablePlayers] =
    useState<RugbyPlayer[]>(serverPlayers);
  const [currentBudget, setCurrentBudget] = useState(budget);

  // Update current budget whenever selected players change
  useEffect(() => {
    const usedBudget = Object.values(selectedPlayers).reduce(
      (total, player) => total + (player.price || 0),
      0
    );
    setCurrentBudget(budget - usedBudget);
  }, [selectedPlayers, budget]);

  const handlePositionClick = useCallback((position: Position) => {
    setSelectedPosition(position);
    setShowPlayerList(true);
    setSearchQuery("");
  }, []);

  const handlePlayerSelect = useCallback((player: Player) => {
    setSelectedPlayerForModal(player);
    //setShowPlayerList(false);
    setShowPlayerModal(true);
  }, []);

  const handleAddPlayer = useCallback(
    (player: Player) => {
      if (selectedPosition) {
        setSelectedPlayers((prev) => ({
          ...prev,
          [selectedPosition.id]: player,
        }));
        setShowPlayerModal(false);
        setSelectedPosition(null);
      }
    },
    [selectedPosition]
  );

  const handleRemovePlayer = useCallback((positionId: string) => {
    setSelectedPlayers((prev) => {
      const newPlayers = { ...prev };
      delete newPlayers[positionId];
      return newPlayers;
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelectedPlayers({});
  }, []);

  const handleAutoGenerate = useCallback(() => {
    // Auto-generate team logic here
    // This is a placeholder
    alert("Auto-generate team feature coming soon!");
  }, []);

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
    setAvailablePlayers,
  };
}
