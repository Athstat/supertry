import { useMemo } from 'react';
import { IProAthlete } from '../types/athletes';
import { IProTeam } from '../types/team';
import { SortTab, SortField, SortDirection } from '../types/playerSorting';
import { PlayerForm } from '../types/rugbyPlayer';

interface UsePlayerFilteringProps {
  athletes: IProAthlete[];
  searchQuery: string;
  positionFilter: string;
  selectedTeam: IProTeam | undefined;
  activeTab: SortTab;
  sortField: SortField;
  sortDirection: SortDirection;
}

const formBias = (powerRanking: number, form?: PlayerForm) => {
  switch (form) {
    case "UP":
      return 3 + powerRanking;
    case "NEUTRAL":
      return 2;
    case "DOWN":
      return -5;
    default:
      return 1;
  }
};

export const usePlayerFiltering = ({
  athletes,
  searchQuery,
  positionFilter,
  selectedTeam,
  activeTab,
  sortField,
  sortDirection,
}: UsePlayerFilteringProps) => {
  
  // Memoize search terms for better performance
  const searchTerms = useMemo(() => {
    if (!searchQuery) return null;
    return searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
  }, [searchQuery]);

  // Memoize filtered players
  const filteredPlayers = useMemo(() => {
    if (athletes.length === 0) return [];

    let result = [...athletes];

    // Apply search filter with optimized matching
    if (searchTerms && searchTerms.length > 0) {
      result = result.filter((player) => {
        const searchableText = [
          player.player_name?.toLowerCase() || '',
          player.team.athstat_name?.toLowerCase() || '',
          player.position_class?.toLowerCase() || ''
        ].join(' ');

        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Apply position filter
    if (positionFilter) {
      result = result.filter((player) => {
        const position = player.position_class || "";
        return (
          position.charAt(0).toUpperCase() + position.slice(1) === positionFilter
        );
      });
    }

    // Apply team filter
    if (selectedTeam) {
      result = result.filter((player) => 
        player.team.athstat_id === selectedTeam.athstat_id
      );
    }

    // Apply tab-specific filtering
    switch (activeTab) {
      case "trending":
        result = result.filter(p => p.form === "UP");
        break;
      case "top":
        result = result
          .sort((a, b) => (b.power_rank_rating || 0) - (a.power_rank_rating || 0))
          .slice(0, 20);
        break;
      case "new":
        // Keep all for now - can add isNew logic later
        break;
    }

    return result;
  }, [athletes, searchTerms, positionFilter, selectedTeam, activeTab]);

  // Memoize sorted players
  const sortedPlayers = useMemo(() => {
    if (filteredPlayers.length === 0) return [];

    return [...filteredPlayers].sort((a, b) => {
      if (sortField === "power_rank_rating") {
        const valueA = a.power_rank_rating || 0;
        const valueB = b.power_rank_rating || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      else if (sortField === "form") {
        const biasA = formBias(a.power_rank_rating ?? 0, a.form);
        const biasB = formBias(b.power_rank_rating ?? 0, b.form);
        return sortDirection === "desc" ? biasB - biasA : biasA - biasB;
      } 
      else if (sortField === "player_name") {
        const valueA = a.player_name || "";
        const valueB = b.player_name || "";
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });
  }, [filteredPlayers, sortField, sortDirection]);

  // Memoize filter state for debugging
  const filterState = useMemo(() => ({
    hasSearch: !!searchQuery,
    hasPositionFilter: !!positionFilter,
    hasTeamFilter: !!selectedTeam,
    activeTab,
    totalResults: sortedPlayers.length,
    originalCount: athletes.length
  }), [searchQuery, positionFilter, selectedTeam, activeTab, sortedPlayers.length, athletes.length]);

  return {
    filteredPlayers: sortedPlayers,
    filterState,
    isEmpty: sortedPlayers.length === 0 && athletes.length > 0
  };
};
