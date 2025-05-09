import React, { useState } from "react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";

// Import components
import ModalHeader from "./player-selection-components/ModalHeader";
import SearchBar from "./player-selection-components/SearchBar";
import TeamFilter from "./TeamFilter";
import TableHeader from "./TableHeader";
import PlayerList from "./player-selection-components/PlayerList";

// Import hooks
import usePlayersFilter from "./player-selection-components/usePlayersFilter";
import useAvailableTeams from "./player-selection-components/useAvailableTeams";
import useModalEffects from "./player-selection-components/useModalEffects";
import AvailableFilter from "./AvailableFilter";

interface PlayerSelectionModalProps {
  visible: boolean;
  selectedPosition: Position;
  players: any[];
  remainingBudget: number;
  selectedPlayers: Player[];
  handlePlayerSelect: (player: Player) => void;
  onClose: () => void;
  roundId: number;
}

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  visible,
  selectedPosition,
  players,
  remainingBudget,
  selectedPlayers,
  handlePlayerSelect,
  onClose,
  roundId,
}) => {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<
    "price" | "rating" | "attack" | "defense" | "kicking"
  >("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);
  const [filterAvailable, setFilterAvailable] = useState(false);

  // Get filtered and sorted players
  const { sortedPlayers, filteredCount } = usePlayersFilter({
    players,
    selectedPosition,
    searchQuery,
    teamFilter,
    remainingBudget,
    selectedPlayers,
    sortBy,
    sortOrder,
    filterAvailable,
  });

  // Get available teams for filter
  const availableTeams = useAvailableTeams(players);

  // Disable body scrolling when modal is open
  useModalEffects(visible);

  // Helper function to toggle team filter
  const toggleTeamFilter = (teamId: string) => {
    if (teamFilter.includes(teamId)) {
      setTeamFilter(teamFilter.filter((id) => id !== teamId));
    } else {
      setTeamFilter([...teamFilter, teamId]);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex sm:items-center sm:justify-center overflow-y-auto">
      <div className="bg-white dark:bg-dark-800 w-full max-w-4xl sm:mx-auto sm:my-4 sm:rounded-lg shadow-xl h-full sm:h-auto sm:max-h-[calc(100vh-2rem)] flex flex-col rounded-none sm:rounded-lg">
        {/* Modal header */}
        <ModalHeader selectedPosition={selectedPosition} onClose={onClose} />

        {/* Search bar */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <AvailableFilter
          filterAvailable={filterAvailable}
          toogle={() => setFilterAvailable(!filterAvailable)}
        />

        {/* Filters section */}
        <TeamFilter
          availableTeams={availableTeams}
          teamFilter={teamFilter}
          toggleTeamFilter={toggleTeamFilter}
        />

        {/* Table header */}
        <TableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(field) => {
            if (sortBy === field) {
              setSortOrder(sortOrder === "desc" ? "asc" : "desc");
            } else {
              setSortBy(field);
              setSortOrder("desc");
            }
          }}
        />

        {/* Player list */}
        <div className="flex-1 overflow-y-auto">
          <PlayerList
            players={sortedPlayers}
            isLoading={loading}
            selectedPosition={selectedPosition}
            handlePlayerSelect={handlePlayerSelect}
            onClose={onClose}
            roundId={roundId}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;
