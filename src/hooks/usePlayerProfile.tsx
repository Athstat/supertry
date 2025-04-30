import React, { useState, useContext, createContext } from 'react';
import { PlayerProfileModal } from '../components/player/PlayerProfileModal';

interface PlayerProfileContextType {
  showPlayerProfile: (player: any, options?: { roundId?: string }) => void;
  hidePlayerProfile: () => void;
}

// Create a context for the player profile
const PlayerProfileContext = createContext<PlayerProfileContextType | undefined>(undefined);

// Provider component that wraps the application
export const PlayerProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [roundId, setRoundId] = useState<string | undefined>(undefined);

  // Function to show player profile
  const showPlayerProfile = (player: any, options?: { roundId?: string }) => {
    setCurrentPlayer(player);
    setRoundId(options?.roundId);
    setIsOpen(true);
  };

  // Function to hide player profile
  const hidePlayerProfile = () => {
    setIsOpen(false);
  };

  return (
    <PlayerProfileContext.Provider value={{ showPlayerProfile, hidePlayerProfile }}>
      {children}
      {currentPlayer && (
        <PlayerProfileModal
          player={currentPlayer}
          isOpen={isOpen}
          onClose={hidePlayerProfile}
          roundId={roundId}
        />
      )}
    </PlayerProfileContext.Provider>
  );
};

// Custom hook to use the player profile context
export const usePlayerProfile = () => {
  const context = useContext(PlayerProfileContext);
  
  if (context === undefined) {
    throw new Error('usePlayerProfile must be used within a PlayerProfileProvider');
  }
  
  return context;
};
