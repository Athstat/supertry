import React, { useState } from 'react';
import ModalHeader from './profile-modal-components/ModalHeader';
import PlayerStats from './profile-modal-components/PlayerStats';
import PlayerInfo from './profile-modal-components/PlayerInfo';
import TabsNavigation from './profile-modal-components/TabsNavigation';
import TabContent from './profile-modal-components/TabContent';
import usePlayerStats from './profile-modal-components/usePlayerStats';
import PlayerStatsContextInfo from './profile-modal-components/PlayerStatsContextInfo';

interface PlayerProfileModalProps {
  player: any;
  isOpen: boolean;
  onClose: () => void;
  roundId?: string;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ 
  player, 
  isOpen, 
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<number>(1); // Default to Stats tab (index 1)
  const { playerStats, isLoading, error } = usePlayerStats(player, isOpen);
  
  const tabs = ['Overview', 'Stats', 'Power Ranking', 'PR Chart'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center ">
      <div className="bg-white dark:bg-dark-800 w-full max-w-2xl mx-auto my-4 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Modal header with player image and close button */}
        <ModalHeader player={player} onClose={onClose} />
        
        {/* Stats Summary */}
        <PlayerStats player={player} />
        
        {/* Player Name and Position */}
        <PlayerInfo player={player} />
        
        {/* Tabs Navigation */}
        <TabsNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className='p-4' >
          <PlayerStatsContextInfo />
        </div>

        {/* Tab Content - scrollable */}
        <div className="flex-1 ">
          <TabContent 
            activeTab={activeTab}
            player={player}
            playerStats={playerStats}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;
