import React, { useState, useEffect, useRef } from "react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import {
  motion,
  useScroll,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";
import { PlayerDetailsModal } from "./PlayerDetailsModal";
import { ModalHeader } from "./player-list/ModalHeader";
import { SearchFilterPanel } from "./player-list/SearchFilterPanel";
import { PlayerList } from "./player-list/PlayerList";
import { ViewToggle, ViewMode } from "./player-list/ViewToggle";
import { createPlayerFromRugbyPlayer } from "../../utils/playerRatings";

type SortField =
  | "power_rank_rating"
  | "player_name"
  | "price"
  | "attack"
  | "defense"
  | "kicking";
type SortDirection = "asc" | "desc";

interface PlayerListModalProps {
  position: Position;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  players?: RugbyPlayer[]; // Add this prop to accept players from parent
  selectedPlayers: Record<string, Player>; // New prop to accept selected players
  // Making all sort/filter props optional
  sortField?: string;
  setSortField?: (field: string) => void;
  sortDirection?: string;
  setSortDirection?: (direction: string) => void;
  positionFilter?: string;
  setPositionFilter?: (position: string) => void;
  teamFilter?: string;
  setTeamFilter?: (team: string) => void;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
  showSort?: boolean;
  setShowSort?: (show: boolean) => void;
  // New props for budget and player counts
  budget?: number;
  maxBudget?: number;
  maxPlayers?: number;
}

export function PlayerListModal({
  position,
  searchQuery,
  setSearchQuery,
  onClose,
  onSelectPlayer,
  players = [], // Default to empty array
  selectedPlayers, // Accept selected players
  // All props now optional with defaults
  sortField: externalSortField,
  setSortField: externalSetSortField,
  sortDirection: externalSortDirection,
  setSortDirection: externalSetSortDirection,
  positionFilter: externalPositionFilter,
  setPositionFilter: externalSetPositionFilter,
  teamFilter: externalTeamFilter,
  setTeamFilter: externalSetTeamFilter,
  showFilters: externalShowFilters,
  setShowFilters: externalSetShowFilters,
  showSort: externalShowSort,
  setShowSort: externalSetShowSort,
  // New props with defaults
  budget = 100,
  maxBudget = 200,
  maxPlayers = 15,
}: PlayerListModalProps) {
  // Local state for when external state is not provided
  const [localSortField, setLocalSortField] =
    useState<string>("power_rank_rating");
  const [localSortDirection, setLocalSortDirection] =
    useState<SortDirection>("desc");
  const [localPositionFilter, setLocalPositionFilter] = useState<string>("");
  const [localTeamFilter, setLocalTeamFilter] = useState<string>("");
  const [localShowFilters, setLocalShowFilters] = useState<boolean>(false);
  const [localShowSort, setLocalShowSort] = useState<boolean>(false);
  const [lastPlayerCount, setLastPlayerCount] = useState<number>(0);
  const [shouldAnimatePlayerCount, setShouldAnimatePlayerCount] =
    useState<boolean>(false);

  // Use external state if available, otherwise use local state
  const sortField = externalSortField ?? localSortField;
  const setSortField = externalSetSortField ?? setLocalSortField;
  const sortDirection = externalSortDirection ?? localSortDirection;
  const setSortDirection = externalSetSortDirection ?? setLocalSortDirection;
  const positionFilter = externalPositionFilter ?? localPositionFilter;
  const setPositionFilter = externalSetPositionFilter ?? setLocalPositionFilter;
  const teamFilter = externalTeamFilter ?? localTeamFilter;
  const setTeamFilter = externalSetTeamFilter ?? setLocalTeamFilter;
  const showFilters = externalShowFilters ?? localShowFilters;
  const setShowFilters = externalSetShowFilters ?? setLocalShowFilters;
  const showSort = externalShowSort ?? localShowSort;
  const setShowSort = externalSetShowSort ?? setLocalShowSort;

  // Refs for scroll behavior
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    container: containerRef,
  });

  // Track scroll direction
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const prevScrollY = useRef<number>(0);

  // Track scroll direction for UI effects
  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    const direction = currentScrollY > prevScrollY.current ? "down" : "up";

    // Only update if direction has changed to avoid excessive re-renders
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }

    prevScrollY.current = currentScrollY;
  });

  // State to track if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  // State to track if search and filters should be visible - START COLLAPSED
  const [showSearchAndFilters, setShowSearchAndFilters] = useState(false);

  // Filtered players state
  const [filteredPlayers, setFilteredPlayers] = useState<RugbyPlayer[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Check for player count changes to animate the indicator
  useEffect(() => {
    const currentPlayerCount = Object.keys(selectedPlayers).length;
    if (currentPlayerCount > lastPlayerCount) {
      setShouldAnimatePlayerCount(true);
      // Reset animation flag after animation completes
      setTimeout(() => setShouldAnimatePlayerCount(false), 600);
    }
    setLastPlayerCount(currentPlayerCount);
  }, [selectedPlayers, lastPlayerCount]);

  // Extract unique positions and teams for filters
  useEffect(() => {
    if (players.length > 0) {
      const positions = [
        ...new Set(
          players.map((player) => {
            const position = player.position_class || "";
            return position.charAt(0).toUpperCase() + position.slice(1);
          })
        ),
      ]
        .filter((pos): pos is string => Boolean(pos))
        .sort();

      const teams = [...new Set(players.map((player) => player.team_name))]
        .filter((team): team is string => Boolean(team))
        .sort();

      setAvailablePositions(positions);
      setAvailableTeams(teams);
    }
  }, [players]);

  // Apply all filters and sorting
  useEffect(() => {
    if (players.length === 0) {
      // Set loading to false even when there are no players
      setLoading(false);
      return;
    }

    let result = [...players];

    // Get already selected player IDs to filter them out
    const selectedPlayerIds = Object.values(selectedPlayers).map(
      (player) => player.id
    );

    // Apply search filter
    if (searchQuery.trim()) {
      result = result.filter(
        (player) =>
          player.player_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          player.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.position_class
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter out already selected players
    result = result.filter((player) => {
      const playerId = player.tracking_id || "";
      return !selectedPlayerIds.includes(playerId);
    });

    // Apply position filter
    if (positionFilter) {
      result = result.filter((player) => {
        const position = player.position_class || "";
        const capitalizedPosition =
          position.charAt(0).toUpperCase() + position.slice(1);
        return capitalizedPosition === positionFilter;
      });
    }

    // Apply team filter
    if (teamFilter) {
      result = result.filter((player) => player.team_name === teamFilter);
    }

    // Helper functions for calculating composite ratings
    const calculateAttackRating = (player: RugbyPlayer): number => {
      const stats = [
        player.ball_carrying || 0,
        player.try_scoring || 0,
        player.offloading || 0,
        player.playmaking || 0,
        player.strength || 0,
      ];
      const sum = stats.reduce((acc, val) => acc + val, 0);
      return stats.filter(Boolean).length > 0
        ? sum / stats.filter(Boolean).length
        : 0;
    };

    const calculateDefenseRating = (player: RugbyPlayer): number => {
      const stats = [
        player.tackling || 0,
        player.defensive_positioning || 0,
        player.breakdown_work || 0,
        player.discipline || 0,
      ];
      const sum = stats.reduce((acc, val) => acc + val, 0);
      return stats.filter(Boolean).length > 0
        ? sum / stats.filter(Boolean).length
        : 0;
    };

    const calculateKickingRating = (player: RugbyPlayer): number => {
      const stats = [
        player.points_kicking || 0,
        player.infield_kicking || 0,
        player.tactical_kicking || 0,
        player.goal_kicking || 0,
      ];
      const sum = stats.reduce((acc, val) => acc + val, 0);
      return stats.filter(Boolean).length > 0
        ? sum / stats.filter(Boolean).length
        : 0;
    };

    // Apply sorting
    result = result.sort((a, b) => {
      if (sortField === "power_rank_rating") {
        const valueA = a.power_rank_rating || 0;
        const valueB = b.power_rank_rating || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else if (sortField === "player_name") {
        const valueA = a.player_name || "";
        const valueB = b.player_name || "";
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (sortField === "price") {
        const valueA = a.price || 0;
        const valueB = b.price || 0;
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else if (sortField === "attack") {
        const valueA = calculateAttackRating(a);
        const valueB = calculateAttackRating(b);
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else if (sortField === "defense") {
        const valueA = calculateDefenseRating(a);
        const valueB = calculateDefenseRating(b);
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else if (sortField === "kicking") {
        const valueA = calculateKickingRating(a);
        const valueB = calculateKickingRating(b);
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });

    setFilteredPlayers(result);
    setLoading(false);
  }, [
    players,
    searchQuery,
    positionFilter,
    teamFilter,
    sortField,
    sortDirection,
    selectedPlayers,
  ]);

  // Add this useEffect to ensure loading state is cleared after a timeout
  useEffect(() => {
    // Set a timeout to ensure loading state is cleared after 3 seconds
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading]);

  // Add state for selected player and its layout ID
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);

  // Update the handleSelectPlayer function to store the player temporarily for the modal
  const handleSelectPlayer = (rugbyPlayer: RugbyPlayer) => {
    const player = createPlayerFromRugbyPlayer(rugbyPlayer, position.name);

    // Store the selected player for the modal
    setSelectedPlayer(player);

    // Generate a unique layout ID for the shared element transition
    const layoutId = `player-card-${player.id}`;
    setSelectedLayoutId(layoutId);
  };

  // Function to handle adding the player to the team from the modal
  const handleAddPlayer = (player: Player) => {
    onSelectPlayer(player);
    setSelectedPlayer(null);
    setSelectedLayoutId(null);
  };

  // Function to handle closing the player details modal
  const handleClosePlayerDetails = () => {
    setSelectedPlayer(null);
    setSelectedLayoutId(null);
  };

  // Handle position filter change
  const handlePositionFilter = (position: string) => {
    setPositionFilter(positionFilter === position ? "" : position);
  };

  // Handle team filter change
  const handleTeamFilter = (team: string) => {
    setTeamFilter(teamFilter === team ? "" : team);
  };

  // Clear all filters
  const clearFilters = () => {
    setPositionFilter("");
    setTeamFilter("");
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Function to toggle search visibility
  const handleToggleSearch = () => {
    // Toggle search bar visibility without affecting scroll
    setShowSearchAndFilters((prev) => !prev);

    // Focus on search input after a short delay when opening
    if (!showSearchAndFilters) {
      requestAnimationFrame(() => {
        const searchInput = document.querySelector(
          ".search-input"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      });
    }
  };

  // Handle escape key to close search panel and ESC behavior for sort/filter panels
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Close search panel if it's open
        if (showSearchAndFilters) {
          e.stopPropagation(); // Prevent default ESC behavior
          setShowSearchAndFilters(false);
          return;
        }

        // Otherwise close filters or sort if they're open
        if (showFilters) {
          setShowFilters(false);
        }
        if (showSort) {
          setShowSort(false);
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [
    showSearchAndFilters,
    showFilters,
    showSort,
    setShowFilters,
    setShowSort,
  ]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate remaining budget based on selected players
  const calculateRemainingBudget = () => {
    const usedBudget = Object.values(selectedPlayers).reduce(
      (total, player) => total + (player.price || 0),
      0
    );
    return maxBudget - usedBudget;
  };

  // Get the current player count and remaining budget
  const selectedPlayerCount = Object.keys(selectedPlayers).length;
  const remainingBudget = calculateRemainingBudget();

  // Add effect to set header height CSS variable
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      }
    };

    // Initial measurement
    updateHeaderHeight();

    // Re-measure on window resize and after 100ms for safety
    window.addEventListener("resize", updateHeaderHeight);
    const timeout = setTimeout(updateHeaderHeight, 100);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      clearTimeout(timeout);
    };
  }, []);

  // Add view mode state
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  // Add a wrapper function for setSortDirection to handle type conversion
  const handleSetSortDirection = (direction: string) => {
    if (direction === "asc" || direction === "desc") {
      setSortDirection(direction as SortDirection);
    }
  };

  // Add a wrapper function for setSortField to handle type conversion
  const handleSetSortField = (field: string) => {
    const validFields: SortField[] = [
      "power_rank_rating",
      "player_name",
      "price",
      "attack",
      "defense",
      "kicking",
    ];
    if (validFields.includes(field as SortField)) {
      setSortField(field as SortField);
    }
  };

  return (
    <div className="fixed inset-0 dark:bg-dark-850/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-200">
      <div
        className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl border border-gray-200/80 dark:border-gray-800 overflow-hidden relative
[--header-gradient:linear-gradient(to_bottom,rgba(248,250,252,1),rgba(255,255,255,1),rgba(255,255,255,0.98))] 
dark:[--header-gradient:linear-gradient(to_bottom,rgba(10,10,10,1),rgba(15,15,15,1),rgba(18,18,18,0.98))] 
[--header-shadow-default:0_1px_3px_rgba(0,0,0,0.06)] 
dark:[--header-shadow-default:0_1px_4px_rgba(0,0,0,0.3)] 
[--header-shadow-scrolled:0_8px_16px_-6px_rgba(0,0,0,0.15),0_3px_6px_-4px_rgba(0,0,0,0.1)] 
dark:[--header-shadow-scrolled:0_12px_24px_-8px_rgba(0,0,0,0.6),0_4px_10px_-4px_rgba(0,0,0,0.4)] 
[--gradient-shadow-color:rgba(0,0,0,0.05)]
dark:[--gradient-shadow-color:rgba(0,0,0,0.3)]"
      >
        {/* Header Component */}
        <ModalHeader
          title={`Select ${position.name}`}
          onClose={onClose}
          showSearchAndFilters={showSearchAndFilters}
          handleToggleSearch={handleToggleSearch}
          selectedPlayerCount={selectedPlayerCount}
          maxPlayers={maxPlayers}
          remainingBudget={remainingBudget}
          maxBudget={maxBudget}
          shouldAnimatePlayerCount={shouldAnimatePlayerCount}
          headerRef={headerRef}
          scrollY={scrollY}
        />

        {/* Search and Filter Panel Component */}
        <SearchFilterPanel
          showSearchAndFilters={showSearchAndFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          showSort={showSort}
          setShowSort={setShowSort}
          positionFilter={positionFilter}
          teamFilter={teamFilter}
          clearFilters={clearFilters}
          loading={loading}
          availablePositions={availablePositions}
          handlePositionFilter={handlePositionFilter}
          availableTeams={availableTeams}
          handleTeamFilter={handleTeamFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />

        {/* View Toggle Component */}
        <div className="px-3 pt-1 pb-2 flex justify-end items-center z-10">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Player List Component */}
        <PlayerList
          filteredPlayers={filteredPlayers}
          loading={loading}
          containerRef={containerRef}
          scrollY={scrollY}
          handleSelectPlayer={handleSelectPlayer}
          onSelectPlayer={onSelectPlayer}
          positionName={position.name}
          viewMode={viewMode}
          sortField={sortField}
          setSortField={handleSetSortField}
          sortDirection={sortDirection}
          setSortDirection={handleSetSortDirection}
        />
      </div>

      {/* Player Details Modal with shared element transition */}
      <AnimatePresence>
        {selectedPlayer && (
          <PlayerDetailsModal
            player={selectedPlayer}
            onClose={handleClosePlayerDetails}
            onBack={handleClosePlayerDetails}
            onAdd={handleAddPlayer}
            layoutId={selectedLayoutId || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
