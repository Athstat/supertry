import { useMemo } from 'react';
import { Player } from '../../../types/player';
import { Position } from '../../../types/position';

interface UsePlayersFilterProps {
  players: any[];
  selectedPosition: Position;
  searchQuery: string;
  teamFilter: string[];
  remainingBudget: number;
  selectedPlayers: Player[];
  sortBy: 'price' | 'rating' | 'attack' | 'defense' | 'kicking';
  sortOrder: 'asc' | 'desc';
}

export const usePlayersFilter = ({
  players,
  selectedPosition,
  searchQuery,
  teamFilter,
  remainingBudget,
  selectedPlayers,
  sortBy,
  sortOrder
}: UsePlayersFilterProps) => {
  // Filter players based on criteria
  const filteredPlayers = useMemo(() => {
    if (!players || !selectedPosition) return [];
    
    console.log("Filtering players for position:", selectedPosition.name);
    console.log("Total players available:", players.length);
    
    return players.filter(player => {
      // First filter by position - use our utility function to get the correct matches
      // Checking both ways: custom filtering and using utility
      const matchesPosition = 
        // Standard position matching options
        player.position === selectedPosition.name ||
        player.position_class === (selectedPosition as any).positionClass ||

        // Handle hyphenated position classes
        player.position_class === (selectedPosition as any).positionClass?.replace('-', '') ||
        player.position_class === (selectedPosition as any).positionClass?.replace('_', '-') ||

        // For specific rugby positions
        ((selectedPosition.name === "Front Row" && player.position_class === "front-row") ||
         (selectedPosition.name === "Second Row" && player.position_class === "second-row") ||
         (selectedPosition.name === "Back Row" && player.position_class === "back-row") ||
         (selectedPosition.name === "Halfback" && player.position_class === "half-back") ||
         (selectedPosition.name === "Back" && player.position_class === "back"));
      
      // If we're not matching the position, skip this player
      if (!matchesPosition) return false;
      
      // Search query matching
      const matchesSearch = searchQuery === '' ||
        player.player_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team_name?.toLowerCase().includes(searchQuery.toLowerCase());
        
      // Team filter matching
      const matchesTeam = teamFilter.length === 0 || teamFilter.includes(player.team_id);
      
      // Already selected check - don't show already selected players
      const isAlreadySelected = selectedPlayers.some(p => p.id === player.id || p.id === player.tracking_id);
      
      // Budget check
      const isAffordable = player.price <= remainingBudget;
      
      // Apply all filters
      return matchesPosition && matchesSearch && matchesTeam && !isAlreadySelected && isAffordable;
    });
  }, [players, selectedPosition, searchQuery, teamFilter, selectedPlayers, remainingBudget]);

  // Sort players
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      switch (sortBy) {
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'rating':
          aValue = a.power_rank_rating || 0;
          bValue = b.power_rank_rating || 0;
          break;
        case 'attack':
          aValue = a.ball_carrying || 0;
          bValue = b.ball_carrying || 0;
          break;
        case 'defense':
          aValue = a.tackling || 0;
          bValue = b.tackling || 0;
          break;
        case 'kicking':
          aValue = a.points_kicking || 0;
          bValue = b.points_kicking || 0;
          break;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [filteredPlayers, sortBy, sortOrder]);

  return {
    filteredPlayers,
    sortedPlayers,
    filteredCount: filteredPlayers.length
  };
};

export default usePlayersFilter;
