import React, { useState, useEffect, useRef } from "react";
import { X, Search, Users, Coins, Star, StarHalf } from "lucide-react";
import { Position } from "../../types/position";
import { Player } from "../../types/player";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import { PlayerSearchBar } from "./player-list/PlayerSearchBar";
import { FilterSortControls } from "./player-list/FilterSortControls";
import { FilterPanel } from "./player-list/FilterPanel";
import { SortPanel } from "./player-list/SortPanel";
import { PlayerCard } from "./player-list/PlayerCard";
import { LoadingSpinner } from "./player-list/LoadingSpinner";
import { EmptyState } from "./player-list/EmptyState";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from "framer-motion";

type SortField = "power_rank_rating" | "player_name" | "price";
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

// Add new helper functions at the top of the file (before the type definitions)
const calculateAttackRating = (player: RugbyPlayer | Player): number => {
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

const calculateDefenseRating = (player: RugbyPlayer | Player): number => {
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

const calculateKickingRating = (player: RugbyPlayer | Player): number => {
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

// Create a reusable star rating component
const StarRating: React.FC<{ rating: number; maxRating: number }> = ({
  rating,
  maxRating = 5,
}) => {
  // Convert the rating to a 0-5 scale
  const scaledRating = (rating / 10) * maxRating;

  return (
    <div className="flex">
      {Array.from({ length: maxRating }).map((_, i) => {
        if (i < Math.floor(scaledRating)) {
          // Full star
          return (
            <Star
              key={i}
              size={12}
              className="text-primary-500 dark:text-primary-400 fill-current"
            />
          );
        } else if (i < Math.floor(scaledRating + 0.5)) {
          // Half star
          return (
            <StarHalf
              key={i}
              size={12}
              className="text-primary-500 dark:text-primary-400 fill-current"
            />
          );
        } else {
          // Empty star
          return (
            <Star
              key={i}
              size={12}
              className="text-gray-300 dark:text-gray-600"
            />
          );
        }
      })}
    </div>
  );
};

// New component for the Budget Indicator
const BudgetIndicator: React.FC<{ budget?: number; maxBudget?: number }> = ({
  budget = 0,
  maxBudget = 200,
}) => {
  const [lastBudget, setLastBudget] = useState(budget);
  const isDangerouslyLow = budget < 50;
  const hasChanged = budget !== lastBudget;

  // Update lastBudget when budget changes
  useEffect(() => {
    setLastBudget(budget);
  }, [budget]);

  return (
    <motion.div
      className={`flex items-center gap-1 px-3 py-2 rounded-full shadow-sm ${
        isDangerouslyLow
          ? "bg-red-50/90 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-red-500/20"
          : "bg-gray-100/80 dark:bg-slate-700/30 text-gray-700 dark:text-gray-200 backdrop-blur-md"
      }`}
      animate={{
        boxShadow: isDangerouslyLow
          ? [
              "0 0 0 rgba(239, 68, 68, 0.2)",
              "0 0 12px rgba(239, 68, 68, 0.4)",
              "0 0 5px rgba(239, 68, 68, 0.2)",
            ]
          : "0 1px 3px rgba(0, 0, 0, 0.1)",
        scale: hasChanged ? [1, 1.05, 1] : 1,
      }}
      transition={{
        boxShadow: {
          repeat: isDangerouslyLow ? Infinity : 0,
          duration: 1.5,
          repeatType: "reverse",
        },
        scale: {
          duration: 0.3,
        },
      }}
    >
      <Coins size={14} className="text-yellow-500 dark:text-yellow-400" />
      <span className="text-xs font-medium whitespace-nowrap">
        {budget} / {maxBudget}
      </span>
    </motion.div>
  );
};

// New component for the Player Count Indicator
const PlayerCountIndicator: React.FC<{
  selectedCount: number;
  maxPlayers?: number;
  animate?: boolean;
}> = ({ selectedCount, maxPlayers = 15, animate = false }) => {
  return (
    <motion.div
      className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-100/80 dark:bg-slate-800/30 text-gray-700 dark:text-gray-200 backdrop-blur-md shadow-sm"
      initial={animate ? { scale: 1 } : false}
      animate={
        animate
          ? {
              scale: [1, 1.1, 1],
            }
          : {}
      }
      transition={{ duration: 0.6 }}
    >
      <Users size={14} className="text-indigo-500 dark:text-indigo-400" />
      <span className="text-xs font-medium whitespace-nowrap">
        {selectedCount} / {maxPlayers}
      </span>
    </motion.div>
  );
};

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

  // Calculate header effects based on scroll position
  const headerShadow = useTransform(
    scrollY,
    [0, 20],
    ["none", "0 4px 10px rgba(0, 0, 0, 0.1)"]
  );

  // Subtle scale effect for header on scroll
  const headerScale = useTransform(scrollY, [0, 30], [1, 0.99]);

  // Track scroll direction
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const prevScrollY = useRef<number>(0);

  // REMOVE the scroll-triggered search expansion behavior
  // We'll keep a simplified version just to track scroll direction for UI effects
  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    const direction = currentScrollY > prevScrollY.current ? "down" : "up";

    // Only update if direction has changed to avoid excessive re-renders
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }

    prevScrollY.current = currentScrollY;
  });

  // Shared background style for both header sections - theme aware
  const headerBackgroundStyle = {
    backdropFilter: "blur(12px)",
  };

  // State to track if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  // State to track if search and filters should be visible - START COLLAPSED
  const [showSearchAndFilters, setShowSearchAndFilters] = useState(false);

  // Ref for player cards
  const playerCardRef = useRef<HTMLDivElement>(null);

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
      }
      return 0;
    });

    //console.log("Filtered players:", result);
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

  // Convert RugbyPlayer to Player for the onSelectPlayer callback
  const handleSelectPlayer = (rugbyPlayer: RugbyPlayer) => {
    const player: Player = {
      id: rugbyPlayer.id || rugbyPlayer.tracking_id || String(Math.random()),
      name: rugbyPlayer.player_name || "Unknown Player",
      team: rugbyPlayer.team_name || "Unknown Team",
      position: position.name,
      price: rugbyPlayer.price || 0,
      points: rugbyPlayer.power_rank_rating || 0,
      image_url: rugbyPlayer.image_url || "",
      power_rank_rating: rugbyPlayer.power_rank_rating || 0,

      // Database stats (directly from schema)
      points_kicking:
        rugbyPlayer.points_kicking ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      tackling:
        rugbyPlayer.tackling || Number((Math.random() * 2 + 3).toFixed(1)),
      infield_kicking:
        rugbyPlayer.infield_kicking ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      strength:
        rugbyPlayer.strength || Number((Math.random() * 2 + 3).toFixed(1)),
      playmaking:
        rugbyPlayer.playmaking || Number((Math.random() * 2 + 3).toFixed(1)),
      ball_carrying:
        rugbyPlayer.ball_carrying || Number((Math.random() * 2 + 3).toFixed(1)),

      // UI display stats (generated if not available)
      tries: rugbyPlayer.tries || Math.floor(Math.random() * 15),
      assists: rugbyPlayer.assists || Math.floor(Math.random() * 10),
      tackles: rugbyPlayer.tackles || Math.floor(Math.random() * 150 + 50),

      // Derived stats for UI display
      try_scoring:
        rugbyPlayer.try_scoring || Number((Math.random() * 2 + 3).toFixed(1)),
      offloading:
        rugbyPlayer.offloading || Number((Math.random() * 2 + 3).toFixed(1)),
      breakdown_work:
        rugbyPlayer.breakdown_work ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      defensive_positioning:
        rugbyPlayer.defensive_positioning ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      goal_kicking:
        rugbyPlayer.goal_kicking || Number((Math.random() * 2 + 3).toFixed(1)),
      tactical_kicking:
        rugbyPlayer.tactical_kicking ||
        Number((Math.random() * 2 + 3).toFixed(1)),
      penalties_conceded:
        rugbyPlayer.penalties_conceded ||
        Number((Math.random() * 2 + 1).toFixed(1)),
      discipline:
        rugbyPlayer.discipline || Number((Math.random() * 2 + 3).toFixed(1)),
      cards: rugbyPlayer.cards || Number((Math.random() * 2).toFixed(1)),
    };
    onSelectPlayer(player);
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
[--gradient-shadow-color:rgba(0,0,0,0.08)] 
dark:[--gradient-shadow-color:rgba(0,0,0,0.25)]"
      >
        {/* Header section - sticky top row with permanent controls */}
        <div className="sticky top-0 inset-x-0 z-30">
          {/* Always visible top row with title, close button, and indicators */}
          <motion.div
            ref={headerRef}
            className="w-full border-b border-gray-200/40 dark:border-gray-800/40 relative"
            style={{
              background: "var(--header-gradient)",
              backdropFilter: "blur(12px)",
              boxShadow: useTransform(
                scrollY,
                [0, 20],
                [
                  "var(--header-shadow-default)",
                  "var(--header-shadow-scrolled)",
                ]
              ),
            }}
          >
            {/* Title and indicators section */}
            <div className="relative flex flex-wrap md:flex-nowrap justify-between items-center p-4 pr-12">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mr-2 transition-colors duration-300">
                Select {position.name}
              </h2>

              {/* Close button positioned at the absolute top-right */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 bg-gray-200/70 hover:bg-gray-300/70 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white p-1.5 rounded-lg transition-colors"
                aria-label="Close"
                tabIndex={0}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mt-1 md:mt-0">
                <motion.button
                  onClick={handleToggleSearch}
                  className={`bg-gray-200/70 hover:bg-gray-300/70 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white p-1.5 rounded-lg transition-colors ${
                    showSearchAndFilters
                      ? "bg-gray-300/90 dark:bg-white/20 ring-2 ring-primary-300 dark:ring-primary-700"
                      : ""
                  }`}
                  aria-label={
                    showSearchAndFilters ? "Hide search" : "Show search"
                  }
                  aria-expanded={showSearchAndFilters}
                  tabIndex={0}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    showSearchAndFilters
                      ? {
                          rotate: [0, -10, 0],
                          boxShadow: [
                            "0 0 0 rgba(37, 99, 235, 0)",
                            "0 0 0 2px rgba(37, 99, 235, 0.3)",
                            "0 0 0 rgba(37, 99, 235, 0)",
                          ],
                          transition: { duration: 0.3, times: [0, 0.5, 1] },
                        }
                      : {}
                  }
                >
                  <Search size={18} />
                </motion.button>
                <PlayerCountIndicator
                  selectedCount={selectedPlayerCount}
                  maxPlayers={maxPlayers}
                  animate={shouldAnimatePlayerCount}
                />
                <BudgetIndicator
                  budget={remainingBudget}
                  maxBudget={maxBudget}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and filter panel - Absolutely positioned overlay */}
        <AnimatePresence initial={false}>
          {showSearchAndFilters && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="absolute top-[var(--header-height)] left-0 right-0 z-40"
              style={{
                background: "var(--header-gradient)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 6px 12px -6px var(--gradient-shadow-color)",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <div className="px-4 py-3 relative">
                {loading ? (
                  <div className="py-1">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <PlayerSearchBar
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />

                    {/* Filter controls */}
                    <FilterSortControls
                      showFilters={showFilters}
                      setShowFilters={setShowFilters}
                      showSort={showSort}
                      setShowSort={setShowSort}
                      positionFilter={positionFilter}
                      teamFilter={teamFilter}
                      clearFilters={clearFilters}
                    />
                  </div>
                )}

                {/* Filter and sort panels overlays */}
                <AnimatePresence>
                  {/* Backdrop for filter and sort panels */}
                  {(showFilters || showSort) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-0 bg-black/10 dark:bg-black/20 z-40"
                      onClick={() => {
                        setShowFilters(false);
                        setShowSort(false);
                      }}
                    />
                  )}

                  {/* Filter panel */}
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-1 px-4 z-50"
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="bg-white dark:bg-dark-800 shadow-xl dark:shadow-black/40 rounded-lg border border-gray-200/50 dark:border-gray-700/30 overflow-auto max-h-[60vh]">
                        <FilterPanel
                          setShowFilters={setShowFilters}
                          availablePositions={availablePositions}
                          positionFilter={positionFilter}
                          handlePositionFilter={handlePositionFilter}
                          availableTeams={availableTeams}
                          teamFilter={teamFilter}
                          handleTeamFilter={handleTeamFilter}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Sort panel */}
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: -5, scaleY: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 right-0 top-full mt-1 px-4 z-50"
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="bg-white dark:bg-dark-800 shadow-xl dark:shadow-black/40 rounded-lg border border-gray-200/50 dark:border-gray-700/30 overflow-auto max-h-[60vh]">
                        <SortPanel
                          setShowSort={setShowSort}
                          sortField={sortField}
                          sortDirection={sortDirection}
                          handleSort={handleSort}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient fade for depth effect - appears after header */}
        <motion.div
          className="h-[3px] z-10 pointer-events-none relative w-full"
          style={{
            background:
              "linear-gradient(to bottom, var(--gradient-shadow-color), transparent)",
            opacity: useTransform(scrollY, [0, 30], [1, 0.4]),
          }}
        />

        {/* Scrollable content area with cards */}
        <div
          ref={containerRef}
          className="overflow-y-auto flex-1 px-2 pt-2 pb-3 scroll-smooth"
        >
          {filteredPlayers.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPlayers.map((player, index) => {
                // Calculate ratings
                const attackRating = calculateAttackRating(player);
                const defenseRating = calculateDefenseRating(player);
                const kickingRating = calculateKickingRating(player);

                return (
                  <PlayerCard
                    key={player.id || player.tracking_id || Math.random()}
                    player={player}
                    handleSelectPlayer={handleSelectPlayer}
                    isFirstCard={index === 0} // First card in the list should always glint
                  />
                );
              })}
            </div>
          )}
          {/* Add some empty space at the bottom for better scrolling experience */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
