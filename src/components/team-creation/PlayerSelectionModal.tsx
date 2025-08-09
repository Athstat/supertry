import React, { useState } from 'react';
import { BasePositionType, Position } from '../../types/position';

// Import components
import ModalHeader from './player-selection-components/ModalHeader';
import SearchBar from './player-selection-components/SearchBar';
import TeamFilter from './TeamFilter';
import TableHeader from './TableHeader';
import PlayerList from './player-selection-components/PlayerList';

// Import hooks
import { useFetch } from '../../hooks/useFetch';
import { gamesService } from '../../services/gamesService';
import { LoadingState } from '../ui/LoadingState';
import usePlayersFilter from './player-selection-components/usePlayersFilter';
import useAvailableTeams from './player-selection-components/useAvailableTeams';
import useModalEffects from './player-selection-components/useModalEffects';
import AvailableFilter from './AvailableFilter';
import { AthleteWithTrackingId } from '../../types/fantasyTeamAthlete';
import { RugbyPlayer } from '../../types/rugbyPlayer';

interface PlayerSelectionModalProps {
  visible: boolean;
  selectedPosition: BasePositionType;
  players: RugbyPlayer[];
  remainingBudget: number;
  selectedPlayers: AthleteWithTrackingId[];
  handlePlayerSelect: (player: RugbyPlayer) => void;
  onClose: () => void;
  roundId: number;
  roundStart?: number;
  roundEnd?: number;
  leagueId?: string;
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
  roundStart,
  roundEnd,
  leagueId,
}) => {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'attack' | 'defense' | 'kicking'>(
    'rating'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterAvailable, setFilterAvailable] = useState(false);

  // Only fetch fixtures if leagueId is provided (TeamCreationScreen)
  const { data: fixtureData, isLoading: loadingFixtures } = leagueId
    ? useFetch('games', leagueId, gamesService.getGamesByLeagueId)
    : { data: null, isLoading: false };

  console.log('Players: ', players);

  // Get available teams for filter
  const allTeams = useAvailableTeams(players);

  // Get filtered and sorted players
  const { sortedPlayers } = usePlayersFilter({
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

  // Disable body scrolling when modal is open
  useModalEffects(visible);

  // Helper function to toggle team filter
  const toggleTeamFilter = (teamId: string) => {
    if (teamFilter.includes(teamId)) {
      setTeamFilter(teamFilter.filter(id => id !== teamId));
    } else {
      setTeamFilter([...teamFilter, teamId]);
    }
  };

  // Skip fixture loading for MyTeamScreen
  if (loadingFixtures) return <LoadingState />;

  // For MyTeamScreen, use all available teams
  // For TeamCreationScreen, filter teams by fixtures
  let availableTeams = allTeams;

  console.log('PlayerSelectionModal - sortedPlayers count:', sortedPlayers.length);
  console.log('PlayerSelectionModal - availableTeams count:', availableTeams.length);

  if (fixtureData) {
    const fixtures = fixtureData ?? [];
    const roundFixtures = fixtures.filter(f => {
      // Only filter by round if we have start/end values
      if (roundStart !== undefined && roundEnd !== undefined) {
        const start = Math.min(roundStart, roundEnd);
        const end = Math.max(roundStart, roundEnd);
        return f.round >= start && f.round <= end;
      }

      return true;
    });

    console.log('All fixtures ', fixtures.length);
    console.log('Round fixtures ', roundFixtures.length);

    const participatingTeamsId = new Set<string>();

    roundFixtures.forEach(rf => {
      if (!participatingTeamsId.has(rf.team.athstat_id)) {
        participatingTeamsId.add(rf.team.athstat_id);
      }

      if (!participatingTeamsId.has(rf.opposition_team.athstat_id)) {
        participatingTeamsId.add(rf.opposition_team.athstat_id);
      }
    });

    console.log('Participating Teams', participatingTeamsId);
    console.log(
      'All teams from players:',
      allTeams.map(t => ({ id: t.id, name: t.name }))
    );

    // Only filter teams if there are participating teams
    if (participatingTeamsId.size > 0) {
      availableTeams = allTeams.filter(t => participatingTeamsId.has(t.id));
      console.log(
        'Filtered available teams:',
        availableTeams.map(t => ({ id: t.id, name: t.name }))
      );
    } else {
      console.log('No participating teams found, using all teams');
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex sm:items-center sm:justify-center overflow-y-auto">
      <div className="bg-white dark:bg-dark-800 w-full max-w-4xl sm:mx-auto sm:my-4 shadow-xl h-full sm:h-auto sm:max-h-[calc(100vh-2rem)] flex flex-col rounded-none sm:rounded-lg">
        {/* Modal header */}
        <ModalHeader selectedPosition={selectedPosition} onClose={onClose} />

        {/* Search bar */}
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <AvailableFilter
          filterAvailable={filterAvailable}
          toogle={() => setFilterAvailable(!filterAvailable)}
          remainingBudget={remainingBudget}
          totalBudget={240} // Default budget value
          selectedPlayersCount={selectedPlayers.length}
          requiredPlayersCount={6} // Default required players value
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
          onSort={field => {
            if (sortBy === field) {
              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            } else {
              setSortBy(field);
              setSortOrder('desc');
            }
          }}
        />

        {/* Player list */}
        <div className="flex-1 overflow-y-auto">
          <PlayerList
            players={sortedPlayers}
            isLoading={false}
            selectedPosition={selectedPosition}
            handlePlayerSelect={handlePlayerSelect}
            onClose={onClose}
            roundId={roundId}
            availableTeams={availableTeams}
            remainingBudget={remainingBudget}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionModal;
