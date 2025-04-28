import React, { useState, useEffect } from 'react';
import { fetchPlayerDetails, findPlayerInRoster } from '../../services/playerApi';

interface PlayerProfileModalProps {
  player: any;
  isOpen: boolean;
  onClose: () => void;
  roundId?: string;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ 
  player, 
  isOpen, 
  onClose,
  roundId
}) => {
  const [activeTab, setActiveTab] = useState<number>(1); // Default to Stats tab (index 1)
  const [detailedPlayerData, setDetailedPlayerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Fetch detailed player data
  useEffect(() => {
    const fetchDetailedData = async () => {
      if (
        player.incrowed_team_id && 
        player.incrowed_competition_id && 
        player.incrowed_season_id
      ) {
        setIsLoading(true);
        try {
          const response = await fetchPlayerDetails(
            player.incrowed_team_id,
            player.incrowed_competition_id,
            player.incrowed_season_id
          );
          
          if (response && response.data && Array.isArray(response.data)) {
            // Find the specific player in the roster
            const matchedPlayer = findPlayerInRoster(
              response.data, 
              player.player_name
            );
            
            if (matchedPlayer) {
              console.log('Found player in roster:', matchedPlayer);
              setDetailedPlayerData(matchedPlayer);
            } else {
              console.log('Player not found in roster data');
            }
          }
        } catch (err) {
          console.error('Error fetching detailed player data:', err);
          setError('Failed to load detailed player statistics');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (isOpen && player) {
      fetchDetailedData();
    }
  }, [isOpen, player]);
  
  // Format date of birth
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) {
      return 'Unknown';
    }
  };
  
  const tabs = ['Overview', 'Stats', 'Power Ranking', 'PR Chart'];

  // Render stat dots (similar to what we have in other components)
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

  // Function to render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-500 dark:text-gray-400">Name</div>
              <div className="font-medium text-gray-700 dark:text-gray-300">{player.player_name}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Team</div>
              <div className="font-medium text-gray-700 dark:text-gray-300">{player.team_name}</div>
              
              <div className="text-gray-500 dark:text-gray-400">Date of Birth</div>
              <div className="font-medium text-gray-700 dark:text-gray-300">{formatDate(player.date_of_birth)}</div>
              
              {player.height && (
                <>
                  <div className="text-gray-500 dark:text-gray-400">Height</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {player.height} cm ({Math.floor(player.height / 30.48)}'{Math.round((player.height / 2.54) % 12)}")
                  </div>
                </>
              )}
              
              {player.weight && (
                <>
                  <div className="text-gray-500 dark:text-gray-400">Weight</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {player.weight} kg ({Math.round(player.weight * 2.20462)} lbs)
                  </div>
                </>
              )}
              
              {player.birth_country && (
                <>
                  <div className="text-gray-500 dark:text-gray-400">Country of Birth</div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{player.birth_country}</div>
                </>
              )}
            </div>
          </div>
        );
        
      case 1: // Stats
        if (isLoading) {
          return (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading detailed statistics...</span>
            </div>
          );
        }
        
        if (error) {
          return (
            <div className="flex justify-center items-center p-6">
              <div className="text-red-500 dark:text-red-400 text-center">{error}</div>
            </div>
          );
        }
        
        return (
          <div className="p-4 space-y-6">
            {/* Player Ratings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Player Ratings</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {player.ball_carrying !== null && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{player.ball_carrying}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Ball Carrying</div>
                  </div>
                )}
                
                {player.tackling !== null && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{player.tackling}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tackling</div>
                  </div>
                )}
                
                {player.points_kicking !== null && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{player.points_kicking}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Points Kicking</div>
                  </div>
                )}
                
                {player.infield_kicking !== null && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{player.infield_kicking}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Infield Kicking</div>
                  </div>
                )}
                
                {player.strength !== null && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{player.strength}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Strength</div>
                  </div>
                )}
                
                {player.playmaking !== null && (
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{player.playmaking}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Playmaking</div>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed statistics from API if available */}
            {detailedPlayerData && detailedPlayerData.stats && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Season Performance</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {detailedPlayerData.stats.tries !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.tries}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tries</div>
                      </div>
                    )}
                    
                    {detailedPlayerData.stats.points !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.points}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                      </div>
                    )}
                    
                    {detailedPlayerData.stats.appearances !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.appearances}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Appearances</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Attack</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {detailedPlayerData.stats.carries !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.carries}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Carries</div>
                      </div>
                    )}
                    
                    {detailedPlayerData.stats.metres !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.metres}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Metres Gained</div>
                      </div>
                    )}
                    
                    {detailedPlayerData.stats.cleanBreaks !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.cleanBreaks}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Clean Breaks</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Defense</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {detailedPlayerData.stats.tackles !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.tackles}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tackles</div>
                      </div>
                    )}
                    
                    {detailedPlayerData.stats.missedTackles !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{detailedPlayerData.stats.missedTackles}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Missed Tackles</div>
                      </div>
                    )}
                    
                    {detailedPlayerData.stats.tackleSuccess !== null && (
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{Math.round(detailedPlayerData.stats.tackleSuccess * 100)}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tackle Success</div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        );
        
      case 2: // Power Ranking
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-5xl font-bold text-green-600 dark:text-green-500 mb-4">
              {player.power_rank_rating?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Overall Power Ranking
            </div>
          </div>
        );
        
      case 3: // PR Chart
        return (
          <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
            PR Chart coming soon
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center overflow-y-auto">
      <div className="bg-white dark:bg-dark-800 w-full max-w-2xl mx-auto my-4 rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="relative">
          {/* Background image with overlay */}
          <div className="h-80 w-full relative overflow-hidden rounded-t-lg">
            <img 
              src={player.image_url || 'https://via.placeholder.com/400'} 
              alt={player.player_name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* No header title */}
        </div>
        
        {/* Stats Summary */}
        <div className="flex justify-between px-4 py-3 -mt-10 relative z-10">
          <div className="bg-white dark:bg-dark-700 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
            <div className="text-lg font-bold text-gray-800 dark:text-white">{player.price}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
          </div>
          
          <div className="bg-white dark:bg-dark-700 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
            <div className="text-lg font-bold text-gray-800 dark:text-white">{player.power_rank_rating?.toFixed(1) || 'N/A'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Power Ranking</div>
          </div>
          
          <div className="bg-white dark:bg-dark-700 flex-1 mx-1 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
            {player.team_logo ? (
              <img src={player.team_logo} alt={player.team_name} className="h-6 w-6 object-contain mb-1" />
            ) : (
              <div className="text-lg font-bold text-gray-800 dark:text-white">—</div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">Team</div>
          </div>
        </div>
        
        {/* Player Name and Position */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{player.player_name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{player.position}</p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`
                  flex-1 py-3 px-4 text-sm font-medium text-center border-b-2 relative
                  ${activeTab === index
                    ? 'text-green-600 dark:text-green-500 border-green-600 dark:border-green-500'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'}
                `}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
