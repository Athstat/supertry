import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, AlertCircle } from "lucide-react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { useNavigate } from "react-router-dom";
import { athleteService } from "../services/athleteService";

type SortTab = "all" | "trending" | "top" | "new";
type SortOption = "points" | "name" | "position" | "club";

// Default competition ID - this could come from a context or route param
const DEFAULT_COMPETITION_ID = "7f6ac8a5-1723-5325-96bd-44b8b36cfb9e"; // Replace with actual default ID

export const PlayersScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SortTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("points");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<RugbyPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<RugbyPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await athleteService.getAthletesByCompetition(
          DEFAULT_COMPETITION_ID
        );
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load players");
        console.error("Error fetching players:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Handle player selection
  const handlePlayerClick = (playerId: string) => {
    navigate(`/players/${playerId}`);
  };

  // Handle search filtering
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPlayers(players);
      return;
    }

    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(query.toLowerCase()) ||
        player.club.toLowerCase().includes(query.toLowerCase()) ||
        player.position.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlayers(filtered);
  };

  // Handle sorting
  const handleSort = (option: SortOption) => {
    setSortBy(option);
    const sorted = [...filteredPlayers].sort((a, b) => {
      switch (option) {
        case "points":
          return b.fantasyPoints - a.fantasyPoints;
        case "name":
          return a.name.localeCompare(b.name);
        case "position":
          return a.position.localeCompare(b.position);
        case "club":
          return a.club.localeCompare(b.club);
        default:
          return 0;
      }
    });
    setFilteredPlayers(sorted);
  };

  // Handle tab changes
  const handleTabChange = (tab: SortTab) => {
    setActiveTab(tab);

    // Apply different filters based on tab
    switch (tab) {
      case "all":
        setFilteredPlayers(players);
        break;
      case "trending":
        // Example: Players with recent point increases
        setFilteredPlayers(players.filter((p) => p.trending));
        break;
      case "top":
        // Top performers by fantasy points
        setFilteredPlayers(
          [...players]
            .sort((a, b) => b.fantasyPoints - a.fantasyPoints)
            .slice(0, 20)
        );
        break;
      case "new":
        // Example: Recently added players
        setFilteredPlayers(players.filter((p) => p.isNew));
        break;
    }
  };

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Search and Filter Header */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800/40 border dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
          />
        </div>

        {/* Sorting Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleTabChange("all")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300"
            }`}
          >
            All Players
          </button>
          <button
            onClick={() => handleTabChange("trending")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "trending"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => handleTabChange("top")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "top"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Top Fantasy Performers
          </button>
          <button
            onClick={() => handleTabChange("new")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "new"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800/40 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            New Players
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800/40 rounded-lg text-gray-600 dark:text-gray-300 font-medium"
        >
          <Filter size={20} />
          Filters
          <ChevronDown
            size={20}
            className={`transform transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading players...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg flex items-center gap-3 my-6">
          <AlertCircle className="h-6 w-6 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Failed to load players</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No players found</p>
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="mt-2 text-primary-600 dark:text-primary-400 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Player Grid */}
      {!isLoading && !error && filteredPlayers.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              onClick={() => handlePlayerClick(player.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

interface PlayerCardProps {
  player: RugbyPlayer;
  onClick: () => void;
}

const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  const getStatPercentage = (value: number, max: number) => (value / max) * 100;

  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-dark-800/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if player image fails to load
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/300x225?text=Player";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg text-left">{player.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90">{player.position}</span>
            <span className="text-sm opacity-90">{player.club}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium dark:text-gray-300">
            Fantasy Points
          </span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {player.fantasyPoints}
          </span>
        </div>

        {/* Stat Bars */}
        <div className="space-y-2">
          <StatBar
            label="Tries"
            value={getStatPercentage(player.stats.tries, 5)}
            color="bg-green-500"
          />
          <StatBar
            label="Tackles"
            value={getStatPercentage(player.stats.tackles, 40)}
            color="bg-blue-500"
          />
          <StatBar
            label="Meters"
            value={getStatPercentage(player.stats.carryMeters, 180)}
            color="bg-yellow-500"
          />
        </div>
      </div>
    </button>
  );
};

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

const StatBar = ({ label, value, color }: StatBarProps) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-xs dark:text-gray-400">
      <span>{label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);
