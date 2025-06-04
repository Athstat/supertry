import React from 'react';

interface ModalHeaderProps {
  player: any;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ player, onClose }) => {
  return (
    <div className="relative">
      {/* Background image with overlay */}
      <div className="h-80 w-full relative overflow-hidden rounded-t-lg">
        <img 
          src={player.image_url || 'https://via.placeholder.com/400'} 
          alt={player.player_name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 dark:from-slate-900 via-slate-900/20 to-transparent"></div>
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
    </div>
  );
};

export default ModalHeader;
