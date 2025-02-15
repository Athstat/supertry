import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { rugbyPlayersWithPoints } from "../data/rugbyPlayers";
import { useNavigate } from "react-router-dom";

type SortTab = "all" | "trending" | "top" | "new";
type SortOption = "points" | "name" | "position" | "club";

export const PlayersScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SortTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("points");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [players, setPlayers] = useState<RugbyPlayer[]>(rugbyPlayersWithPoints);

  const handlePlayerClick = (playerId: string) => {
    navigate(`/players/${playerId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = rugbyPlayersWithPoints.filter(
      (player) =>
        player.name.toLowerCase().includes(query.toLowerCase()) ||
        player.club.toLowerCase().includes(query.toLowerCase()) ||
        player.position.toLowerCase().includes(query.toLowerCase())
    );
    setPlayers(filtered);
  };

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    const sorted = [...players].sort((a, b) => {
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
    setPlayers(sorted);
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
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
          />
        </div>

        {/* Sorting Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            All Players
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "trending"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab("top")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "top"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            Top Fantasy Performers
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "new"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            New Players
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800 rounded-lg text-gray-600 dark:text-gray-300 font-medium"
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

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onClick={() => handlePlayerClick(player.id)}
          />
        ))}
      </div>
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
      className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={player.image}
          alt={player.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg">{player.name}</h3>
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
