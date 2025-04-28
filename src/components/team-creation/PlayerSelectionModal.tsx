import React, { useState, useMemo, useEffect } from 'react';
import { Position } from '../../types/position';
import { Player } from '../../types/player';
import TableHeader from './TableHeader';
import TeamFilter from './TeamFilter';
import { usePlayerProfile } from '../../hooks/usePlayerProfile';

interface PlayerSelectionModalProps {
  visible: boolean;
  selectedPosition: Position;
  players: any[];
  remainingBudget: number;
  selectedPlayers: Player[];
  handlePlayerSelect: (player: Player) => void;
  onClose: () => void;
  roundId: number;
}

const PlayerSelectionModal: React.FC<PlayerSelectionModalProps> = ({
  visible,
  selectedPosition,
  players,
  remainingBudget,
  selectedPlayers,
  handlePlayerSelect,
  onClose,
  roundId
}) => {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'attack' | 'defense' | 'kicking'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);

  // Filter players based on criteria
  const filteredPlayers = useMemo(() => {
    if (!players || !selectedPosition) return [];
    
    console.log("Filtering players for position:", selectedPosition.name);
    console.log("Total players available:", players.length);
    
    setLoading(true);
    
    const filtered = players.filter(player => {
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
    
    setLoading(false);
    console.log("Filtered players count:", filtered.length);
    return filtered;
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

  // Function to convert Rugby player to our Player type
  const convertToPlayer = (rugbyPlayer: any): Player => {
    return {
      id: rugbyPlayer.tracking_id || rugbyPlayer.id || String(Math.random()),
      name: rugbyPlayer.player_name || 'Unknown Player',
      team: rugbyPlayer.team_name || 'Unknown Team',
      position: selectedPosition.name,
      price: rugbyPlayer.price || 0,
      points: rugbyPlayer.power_rank_rating || 0,
      image_url: rugbyPlayer.image_url || '',
      power_rank_rating: rugbyPlayer.power_rank_rating || 0,
      points_kicking: rugbyPlayer.points_kicking || 0,
      tackling: rugbyPlayer.tackling || 0,
      infield_kicking: rugbyPlayer.infield_kicking || 0,
      strength: rugbyPlayer.strength || 0,
      playmaking: rugbyPlayer.playmaking || 0,
      ball_carrying: rugbyPlayer.ball_carrying || 0,
    };
  };

  // Get available teams for filter - from all players regardless of filters
  const availableTeams = useMemo(() => {
    // Use all players to ensure all teams are always visible
    const teams = players
      ? [...new Set(players.map(p => p.team_id))]
        .filter(Boolean)
        .map(teamId => {
          const player = players.find(p => p.team_id === teamId);
          return {
            id: teamId,
            name: player?.team_name || 'Unknown Team',
            logo: player?.team_logo || ''
          };
        })
      : [];
    console.log("Available teams:", teams.length);
    return teams;
  }, [players]);

  // Get the player profile hook
  const { showPlayerProfile } = usePlayerProfile();
  
  // Function to handle viewing player profile
  const handleViewPlayerProfile = (player: any) => {
    showPlayerProfile(player, { roundId: roundId?.toString() });
  };
  
  // Helper function to toggle team filter
  const toggleTeamFilter = (teamId: string) => {
    if (teamFilter.includes(teamId)) {
      setTeamFilter(teamFilter.filter(id => id !== teamId));
    } else {
      setTeamFilter([...teamFilter, teamId]);
    }
  };

  // Disable scrolling on the main page when modal is open
  useEffect(() => {
    if (visible) {
      // Save current scroll position and disable scrolling on body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
      
      // Cleanup function to re-enable scrolling when modal is closed
      return () => {
        // Restore scroll position and enable scrolling
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center overflow-y-auto">
      <div className="bg-white dark:bg-dark-800 w-full max-w-4xl mx-auto my-4 rounded-lg shadow-xl max-h-[calc(100vh-2rem)] flex flex-col">
        {/* Modal header */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Select {selectedPosition?.name}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Search bar */}
        <div className="px-6 py-4 border-b dark:border-gray-700">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-dark-700 dark:text-gray-100"
            />
          </div>
        </div>
        
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
          onSort={(field) => {
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
          {loading && (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              <p className="ml-3 text-gray-600 dark:text-gray-300">Loading players...</p>
            </div>
          )}
        
          {!loading && sortedPlayers.length > 0 ? (
            sortedPlayers.map(player => (
              <div 
                key={player.tracking_id || player.id || Math.random()}
                onClick={() => handlePlayerSelect(convertToPlayer(player))}
                className="flex items-center px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition"
              >
                {/* Player image/initials */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {player.image_url ? (
                    <img 
                      src={player.image_url} 
                      alt={player.player_name}
                      className="w-10 h-10 rounded-full object-cover" 
                    />
                  ) : (
                    <span className="text-white text-xs font-semibold">
                      {(player.player_name?.charAt(0) || '?')}
                    </span>
                  )}
                </div>
                
                {/* Player info */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate dark:text-gray-100">{player.player_name}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row selection
                        handleViewPlayerProfile(player);
                      }}
                      className="ml-1 text-blue-500 dark:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label="View player profile"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{player.team_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{player.position || selectedPosition.name}</p>
                </div>
                
                {/* Price */}
                <div className="w-12 text-center">
                  <p className="font-bold text-sm dark:text-gray-200">{player.price}</p>
                </div>
                
                {/* Rating */}
                <div className="w-12 text-center">
                  <p className="text-sm dark:text-gray-200">{(player.power_rank_rating || 0).toFixed(1)}</p>
                </div>
                
                {/* Attack stat */}
                <div className="w-16 flex justify-center px-2">
                  {renderStatDots(player.ball_carrying || 0, 'bg-red-500')}
                </div>
                
                {/* Defense stat */}
                <div className="w-16 flex justify-center px-2">
                  {renderStatDots(player.tackling || 0, 'bg-blue-500')}
                </div>
                
                {/* Kicking stat */}
                <div className="w-16 flex justify-center px-2">
                  {renderStatDots(player.points_kicking || 0, 'bg-green-500')}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center p-10 text-gray-500 dark:text-gray-400">
              {!loading && (
                <>
                  <p className="text-lg font-medium mb-2 dark:text-gray-300">No players found matching your criteria.</p>
                  <p className="text-sm text-center">Try adjusting your search or filters, or check that there are players available for this position.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to render stat dots
const renderStatDots = (value: number, colorClass: string) => {
  const normalizedValue = Math.min(5, Math.max(0, Math.floor(value)));
  
  return (
    <div className="flex">
      {Array(5).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i < normalizedValue ? colorClass : 'bg-gray-300 dark:bg-gray-600'}`} 
        />
      ))}
    </div>
  );
};

export default PlayerSelectionModal;
