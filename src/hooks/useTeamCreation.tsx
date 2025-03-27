const handlePlayerSelect = (player: Player) => {
  setSelectedPlayerForModal(player);
  setShowPlayerModal(true);
  // This line is causing the issue - we're closing the player list when opening the details
  // setShowPlayerList(false);
};

const handleAddPlayer = (player: Player) => {
  if (selectedPosition) {
    const newSelectedPlayers = { ...selectedPlayers };
    newSelectedPlayers[selectedPosition.id] = player;
    setSelectedPlayers(newSelectedPlayers);

    // Close only the details modal, not the list modal
    setShowPlayerModal(false);
    // Don't close the player list modal here
    // setShowPlayerList(false);

    // Update the current budget
    const newBudget = initialBudget - getTotalCost(newSelectedPlayers);
    setCurrentBudget(newBudget);
  }
};
