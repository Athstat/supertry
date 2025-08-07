import { useState, useEffect } from 'react';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import { useTeamCreation } from '../../hooks/useTeamCreation';
import { leagueService } from '../../services/leagueService';
import { athleteService } from '../../services/athletes/athleteService';
import { TeamCreationPositionSlot } from '../../types/position';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { MAX_TEAM_BUDGET } from '../../types/constants';

export const useTeamCreationState = (officialLeagueId: string | undefined) => {
  // League and players data states
  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(null);
  const [allPlayers, setAllPlayers] = useState<RugbyPlayer[]>([]);
  const [positionList, setPositionList] = useState<any[]>([]);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<TeamCreationPositionSlot | null>(null);
  const [captainId, setCaptainId] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Get the useTeamCreation hook
  const teamCreationHook = useTeamCreation(
    leagueConfig?.team_budget || MAX_TEAM_BUDGET,
    (players, teamName, isFavorite) => {
      console.log('Team creation complete', players, teamName, isFavorite);
      // Navigation is handled in the parent component
    }
  );

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
  } = teamCreationHook;

  // Function to show toast message
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  // Function to hide toast message
  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Setup positions from config
  const setupPositionsFromConfig = (config: any) => {
    if (!config || !config.positions) {
      // Fallback to create some default positions if config is missing
      const defaultPositions = [
        { name: 'Front Row', position_class: 'front-row' },
        { name: 'Second Row', position_class: 'second-row' },
        { name: 'Back Row', position_class: 'back-row' },
        { name: 'Halfback', position_class: 'half-back' },
        { name: 'Back', position_class: 'back' },
        { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
      ];

      const positions = defaultPositions.map((pos, index) => ({
        id: String(index),
        name: pos.name,
        shortName: pos.name.substring(0, 3),
        x: '0',
        y: '0',
        positionClass: pos.position_class,
        isSpecial: pos.isSpecial || false,
        player: undefined,
      }));

      setPositionList(positions);
      console.log('Using default positions:', positions);
      return;
    }

    // Map the positions from config and add super sub
    const configPositions = config.positions.map((pos: any, index: number) => ({
      id: String(index),
      name: pos.name,
      shortName: pos.name.substring(0, 3),
      x: '0',
      y: '0',
      positionClass: pos.position_class,
      isSpecial: false,
      player: undefined,
    }));

    // Add Super Sub as an additional position
    const superSubPosition = {
      id: String(configPositions.length),
      name: 'Super Sub',
      shortName: 'Sub',
      x: '0',
      y: '0',
      positionClass: 'super-sub',
      isSpecial: true,
      player: undefined,
    };

    const positions = [...configPositions, superSubPosition];

    console.log('Setting up positions from config:', positions);
    setPositionList(positions);
  };

  // Handle position selection
  const handlePositionSelect = (position: TeamCreationPositionSlot) => {
    // Set the position in the hook first
    handlePositionClick(position);

    // Then set the local state
    setSelectedPosition(position);
    setShowPlayerSelection(true);
  };

  // Override handleAddPlayer to also close the modal
  const enhancedHandleAddPlayer = (player: RugbyPlayer) => {
    handleAddPlayer(player);
    setShowPlayerSelection(false); // Close the modal after player is added
  };

  // Fetch all required data in a single effect
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      console.log('fetching data for league: ', officialLeagueId);
      
      if (!officialLeagueId) {
        if (isMounted) {
          setError('League ID is missing');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setLoadingPlayers(true);
        
        // Fetch both data in parallel
        const [players, config] = await Promise.all([
          athleteService.getRugbyAthletesByCompetition(officialLeagueId),
          leagueService.getLeagueConfig(officialLeagueId)
        ]);

        if (!isMounted) return;

        console.log('Fetched players data:', players);
        setAllPlayers(players);

        if (config) {
          setLeagueConfig(config);
          setupPositionsFromConfig(config);
          setError(null);
        } else {
          setError('Failed to load league configuration');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) {
          setError('An error occurred while loading data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setLoadingPlayers(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
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
        player: selectedPlayer || undefined,
      };
    });

    setPositionList(updatedPositions);
  }, [selectedPlayers, positionList.length]);

  // Force setup of positions on initial load if they're not set from config
  useEffect(() => {
    if (positionList.length === 0 && !isLoading && !loadingPlayers) {
      console.log('No positions found, setting up default positions');
      setupPositionsFromConfig(null);
    }
  }, [isLoading, loadingPlayers, positionList.length]);

  // Calculate team budget and remaining budget
  const teamBudget = leagueConfig?.team_budget || 1000;
  const remainingBudget = currentBudget;
  const selectedPlayersCount = Object.keys(selectedPlayers).length;
  // Always require 6 players regardless of league configuration
  const requiredPlayersCount = 6;
  const isTeamComplete = selectedPlayersCount === requiredPlayersCount;

  return {
    // Data
    leagueConfig,
    allPlayers,
    positionList,

    // UI states
    isLoading: isLoading || loadingPlayers,
    error,
    showPlayerSelection,
    setShowPlayerSelection,
    selectedPosition,

    // Team creation hook values
    teamName,
    setTeamName,
    selectedPlayers,
    handlePositionSelect,
    handleAddPlayer: enhancedHandleAddPlayer, // Use enhanced version that closes modal
    handlePlayerSelect,
    handleRemovePlayer,
    handleReset,

    // Budget info
    teamBudget,
    remainingBudget,
    selectedPlayersCount,
    requiredPlayersCount,
    isTeamComplete,

    // Captain selection
    captainId,
    setCaptainId,

    // Toast
    toast,
    showToast,
    hideToast,
  };
};

export default useTeamCreationState;
