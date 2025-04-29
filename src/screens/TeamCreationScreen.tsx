import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Components
import { TeamCreationHeader } from "../components/team-creation/TeamCreationHeader";
import { LoadingState } from "../components/team-creation/LoadingState";
import { ErrorState } from "../components/team-creation/ErrorState";

// Hooks, services and utils
import { useTeamCreation } from "../hooks/useTeamCreation";
import { leagueService } from "../services/leagueService";
import { athleteService } from "../services/athleteService";
import { teamService } from "../services/teamService";
import { getPlayersByUIPosition } from "../utils/playerUtils";

// Types and data
import { positionGroups } from "../data/positionGroups";
import { Position } from "../types/position";
import { Player } from "../types/player";
import { IGamesLeagueConfig } from "../types/leagueConfig";

// Import required components
import PositionCard from "../components/team-creation/PositionCard";
import TeamActions from "../components/team-creation/TeamActions";
import PlayerSelectionModal from "../components/team-creation/PlayerSelectionModal";
import TableHeader from "../components/team-creation/TableHeader";
import TeamFilter from "../components/team-creation/TeamFilter";

export function TeamCreationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { officialLeagueId } = useParams<{ officialLeagueId: string }>();
  const league = location.state?.league;

  // League and players data states
  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(null);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [positionList, setPositionList] = useState<any[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Sort and filter states for player selection
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'attack' | 'defense' | 'kicking'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [showTopPerformers, setShowTopPerformers] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  // The useTeamCreation hook provides team management functionality
  const {
    selectedPlayers,
    teamName,
    setTeamName,
    handlePositionClick,
    handleAddPlayer,
    handlePlayerSelect,
    handleRemovePlayer,
    handleReset,
    currentBudget,
  } = useTeamCreation(
    leagueConfig?.team_budget || 1000, 
    (players: Record<string, Player>, teamName: string, isFavorite: boolean) => {
      // This function will be called when team creation is complete
      console.log("Team creation complete", players, teamName, isFavorite);
      navigate('/my-teams');
    }
  );

  // Function to show toast message
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  // Function to hide toast message
  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Setup positions from config
  const setupPositionsFromConfig = (config: any) => {
    if (!config || !config.positions) {
      // Fallback to create some default positions if config is missing
      const defaultPositions = [
        { name: "Front Row", position_class: "front-row" },
        { name: "Second Row", position_class: "second-row" },
        { name: "Back Row", position_class: "back-row" },
        { name: "Halfback", position_class: "half-back" },
        { name: "Back", position_class: "back" }
      ];
      
      const positions = defaultPositions.map((pos, index) => ({
        id: String(index),
        name: pos.name,
        shortName: pos.name.substring(0, 3),
        x: "0",
        y: "0",
        positionClass: pos.position_class,
        player: undefined
      }));
      
      setPositionList(positions);
      console.log("Using default positions:", positions);
      return;
    }
    
    const positions = config.positions.map((pos: any, index: number) => ({
      id: String(index),
      name: pos.name,
      shortName: pos.name.substring(0, 3),
      x: "0",
      y: "0",
      positionClass: pos.position_class,
      player: undefined
    }));
    
    console.log("Setting up positions from config:", positions);
    setPositionList(positions);
  };

  // Handle position selection
  const handlePositionSelect = (position: Position) => {
    // Set the position in the hook first
    handlePositionClick(position);
    
    // Then set the local state
    setSelectedPosition(position);
    setShowPlayerSelection(true);
  };

  // Check if team is complete
  const isTeamComplete = useMemo(() => {
    return positionList.every(pos => pos.player !== undefined);
  }, [positionList]);

  // Fetch players from API
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!officialLeagueId) {
        setError("League ID is missing");
        setIsLoading(false);
        return;
      }
      try {
        setLoadingPlayers(true);
        const data = await athleteService.getRugbyAthletesByCompetition(officialLeagueId);
        setAllPlayers(data);
      } catch (err) {
        console.error("Error fetching players:", err);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [officialLeagueId]);

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
          setupPositionsFromConfig(config);
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

  // Update position list when players are selected
  useEffect(() => {
    if (positionList.length === 0) return;
    
    const updatedPositions = positionList.map(position => {
      const selectedPlayer = Object.values(selectedPlayers).find(
        player => player.position === position.name
      );
      return {
        ...position,
        player: selectedPlayer || undefined
      };
    });
    
    console.log("Updated positions with players:", updatedPositions);
    setPositionList(updatedPositions);
  }, [selectedPlayers, positionList.length]);
  
  // Force setup of positions on initial load if they're not set from config
  useEffect(() => {
    if (positionList.length === 0 && !isLoading && !loadingPlayers) {
      console.log("No positions found, setting up default positions");
      setupPositionsFromConfig(null);
    }
  }, [isLoading, loadingPlayers, positionList.length]);

  // Show loading state while fetching initial data
  if (isLoading || loadingPlayers) {
    return <LoadingState />;
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState error={error} />;
  }

  // Calculate team budget and remaining budget
  const teamBudget = leagueConfig?.team_budget || 1000;
  const remainingBudget = currentBudget;
  const selectedPlayersCount = Object.keys(selectedPlayers).length;
  const requiredPlayersCount = leagueConfig?.lineup_size || positionList.length;

  return (
    <div className="container mx-auto px-4 max-w-[1024px] pb-4 bg-gray-50 dark:bg-dark-850 min-h-screen">
      {/* Header with league information */}
      <TeamCreationHeader 
        title={league?.title || "Create Your Team"}
        currentBudget={remainingBudget}
        totalBudget={teamBudget}
        selectedPlayersCount={selectedPlayersCount}
        totalPositions={requiredPlayersCount}
      />
      
      {/* Position selection grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-6">
          {positionList.map(position => (
            <PositionCard
              key={position.id}
              position={position}
              selected={selectedPosition?.id === position.id}
              onPress={() => handlePositionSelect(position)}
              onRemove={handleRemovePlayer}
            />
          ))}
        </div>
        
        {/* Team name input */}
        <div className="mt-8 mb-6">
          <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team Name
          </label>
          <input
            type="text"
            id="team-name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-dark-700 dark:text-gray-100"
            placeholder="Enter your team name"
          />
        </div>
        
        {/* Team action buttons */}
        <TeamActions
          isTeamComplete={isTeamComplete}
          onReset={handleReset}
          onSave={async () => {
            // Validate team
            if (teamName.trim() === "") {
              showToast("Please enter a team name", "error");
              return;
            }
            if (selectedPlayersCount !== requiredPlayersCount) {
              showToast(`Please select all ${requiredPlayersCount} players`, "error");
              return;
            }
            if (remainingBudget < 0) {
              showToast("You have exceeded the budget", "error");
              return;
            }
            
            try {
              // Convert selected players to the required format for API (IFantasyTeamAthlete)
              const teamAthletes = Object.values(selectedPlayers).map((player, index) => ({
                athlete_id: player.id,
                purchase_price: player.price,
                purchase_date: new Date(),
                is_starting: true,
                slot: index + 1,
                score: player.points || 0
              }));
              
              // Submit the team using the team service
              setIsLoading(true);
              await teamService.submitTeam(
                teamName,
                teamAthletes,
                officialLeagueId || ''
              );
              
              showToast("Team saved successfully!", "success");
              navigate('/my-teams');
            } catch (error) {
              console.error("Error saving team:", error);
              showToast(
                error instanceof Error ? error.message : "Failed to save team. Please try again.",
                "error"
              );
            } finally {
              setIsLoading(false);
            }
          }}
        />
      </div>
      
      {/* Player selection modal */}
      {showPlayerSelection && selectedPosition && (
        <PlayerSelectionModal
          visible={showPlayerSelection}
          selectedPosition={selectedPosition}
          players={allPlayers}
          remainingBudget={remainingBudget}
          selectedPlayers={Object.values(selectedPlayers)}
          handlePlayerSelect={(player: Player) => {
            // Use handleAddPlayer from the useTeamCreation hook to properly update the budget
            handleAddPlayer(player);
            setShowPlayerSelection(false);
          }}
          onClose={() => setShowPlayerSelection(false)}
          roundId={parseInt(officialLeagueId || '0')}
        />
      )}
      
      {/* Toast component - simplified for this implementation */}
      {toast.isVisible && (
        <div 
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 
            toast.type === 'error' ? 'bg-red-600 text-white' : 
            'bg-blue-600 text-white'
          }`}
        >
          <p>{toast.message}</p>
          <button 
            onClick={hideToast}
            className="absolute top-1 right-1 text-white opacity-70 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamCreationScreen;
