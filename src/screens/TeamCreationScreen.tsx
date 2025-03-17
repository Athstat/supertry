import React, { useEffect, useState } from "react";
import { Zap, AlertCircle, ChevronRight, X } from "lucide-react";
import { TeamHeader } from "../components/team-creation/TeamHeader";
import { TeamStats } from "../components/team-creation/TeamStats";
import { PositionGroup } from "../components/team-creation/PositionGroup";
import { useTeamCreation } from "../hooks/useTeamCreation";
import { positionGroups } from "../data/positionGroups";
import { Player } from "../types/player";
import { PlayerListModal } from "../components/team-creation/PlayerListModal";
import { PlayerDetailsModal } from "../components/team-creation/PlayerDetailsModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Position } from "../types/position";
import { leagueService } from "../services/leagueService";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { athleteService } from "../services/athleteService";
import { RugbyPlayer } from "../types/rugbyPlayer";

interface PositionGroup {
  name: string;
  positions: Array<{
    id: string;
    name: string;
    shortName: string;
    x: number;
    y: number;
  }>;
}

// Default competition ID - this could come from a context or route param
const DEFAULT_COMPETITION_ID = "7f6ac8a5-1723-5325-96bd-44b8b36cfb9e";

export function TeamCreationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league;

  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for players
  const [allPlayers, setAllPlayers] = useState<RugbyPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // Function to map position_class to UI position
  const mapPositionClassToUIPosition = (positionClass: string): string => {
    if (!positionClass) return "";

    const lowerCasePosition = positionClass.toLowerCase();

    if (lowerCasePosition === "forward") {
      // Randomly assign forwards to either First Row or Second Row
      return Math.random() > 0.5 ? "Front Row" : "Second Row";
    } else if (lowerCasePosition === "back") {
      // Randomly distribute backs among Back Row, Half Back, and Backs
      const random = Math.random();
      if (random < 0.33) return "Back Row";
      if (random < 0.66) return "Halfback";
      return "Backs";
    }

    return positionClass; // Fallback to original position if not forward/back
  };

  // Function to get players by UI position
  const getPlayersByUIPosition = (
    players: RugbyPlayer[],
    uiPosition: string
  ): RugbyPlayer[] => {
    if (!players || players.length === 0) return [];

    return players.filter((player) => {
      const mappedPosition = mapPositionClassToUIPosition(
        player.position_class
      );
      return mappedPosition === uiPosition;
    });
  };

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        const data = await athleteService.getAthletesByCompetition(
          DEFAULT_COMPETITION_ID
        );
        console.log("Fetched players:", data.length);
        setAllPlayers(data);
      } catch (err) {
        console.error("Error fetching players:", err);
        // Don't set error state here to avoid blocking the UI
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, []);

  // Fetch league config on mount
  useEffect(() => {
    const fetchLeagueConfig = async () => {
      if (!officialLeagueId) {
        setError("League ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        const config = await leagueService.getLeagueConfig(officialLeagueId);
        if (config) {
          setLeagueConfig(config);
          setError(null);
        } else {
          setError("Failed to load league configuration");
        }
      } catch (err) {
        console.error("Error fetching league config:", err);
        setError("An error occurred while loading league configuration");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeagueConfig();
  }, [officialLeagueId]);

  // Add useEffect to scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleComplete = async (
    players: Record<string, Player>,
    teamName: string,
    isFavorite: boolean
  ) => {
    try {
      // Navigate on success
      navigate("/my-teams", {
        state: {
          teamCreated: true,
          teamName,
          players,
          isFavorite,
        },
      });
    } catch (error) {
      console.error("Failed to save team:", error);
    }
  };

  const handleReview = () => {
    if (teamName.trim() === "") {
      alert("Please enter a team name");
      return;
    }
    if (Object.keys(selectedPlayers).length !== 5) {
      alert("Please select all 5 players");
      return;
    }
    if (currentBudget < 0) {
      alert("You have exceeded the budget");
      return;
    }

    navigate("/review-team", {
      state: {
        players: selectedPlayers,
        teamName,
        isFavorite,
        league,
      },
    });
  };

  const {
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
  } = useTeamCreation(
    leagueConfig?.team_budget || 1000,
    handleComplete,
    allPlayers
  );

  // Update available players when allPlayers changes
  useEffect(() => {
    if (allPlayers.length > 0) {
      setAvailablePlayers(allPlayers);
    }
  }, [allPlayers, setAvailablePlayers]);

  if (isLoading || loadingPlayers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 flex items-center justify-center">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/leagues")}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Leagues
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4">
      <div className="container mx-auto px-4 max-w-[1024px]">
        <div className="dark:bg-gray-800/40 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
            Create Your Team
          </h1>

          <TeamHeader
            teamName={teamName}
            setTeamName={setTeamName}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
          />

          <TeamStats
            league={league}
            leagueConfig={leagueConfig}
            currentBudget={currentBudget}
            selectedPlayersCount={Object.keys(selectedPlayers).length}
            totalPositions={5}
          />

          <button
            onClick={handleAutoGenerate}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mt-5"
          >
            <Zap size={20} />
            Auto Pick Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {positionGroups.map((group) => (
            <PositionGroup
              key={group.name}
              name={group.name}
              positions={group.positions}
              selectedPlayers={selectedPlayers}
              onPositionClick={handlePositionClick}
              onRemovePlayer={handleRemovePlayer}
            />
          ))}
        </div>

        <div className="space-y-3 mb-6 mt-6">
          <button
            onClick={handleReset}
            className="w-full bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Reset Selection
          </button>
        </div>

        <div className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm dark:shadow-dark-sm p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
              <AlertCircle size={20} />
              <span className="text-sm">
                Select all 5 players to complete your team
              </span>
            </div>
            <button
              onClick={handleReview}
              disabled={currentBudget < 0}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review & Submit Team
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {showPlayerList && selectedPosition && (
          <PlayerListModal
            position={selectedPosition}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowPlayerList(false)}
            onSelectPlayer={handlePlayerSelect}
            players={getPlayersByUIPosition(allPlayers, selectedPosition.name)}
          />
        )}

        {showPlayerModal && selectedPlayerForModal && (
          <PlayerDetailsModal
            player={selectedPlayerForModal}
            onClose={() => setShowPlayerModal(false)}
            onAdd={handleAddPlayer}
          />
        )}
      </div>
    </main>
  );
}
