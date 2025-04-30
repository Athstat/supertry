import React from 'react';

interface PositionCardProps {
  position: any;
  selected: boolean;
  onPress: () => void;
  onRemove?: (positionId: string) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({ position, selected, onPress, onRemove }) => {
  const hasPlayer = position.player !== undefined;
  
  return (
    <div 
      onClick={() => hasPlayer ? null : onPress()}
      className={`
        bg-white dark:bg-dark-800 rounded-lg shadow-md p-4 cursor-pointer transition
        hover:shadow-lg transform hover:-translate-y-1 
        ${selected ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}
        ${hasPlayer ? 'bg-gray-50 dark:bg-dark-750' : ''}
      `}
    >
      <div className="flex flex-col items-center">
        {position.player ? (
          <>
            <div className="relative w-full flex flex-col items-center mb-1">
              <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                {position.player.image_url ? (
                  <img 
                    src={position.player.image_url} 
                    alt={position.player.name}
                    className="w-14 h-14 rounded-full object-cover" 
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {position.player.name.charAt(0)}
                  </span>
                )}
              </div>
            </div>
            <h3 className="font-bold text-sm mb-1 dark:text-white">{position.name}</h3>
            <p className="text-xs text-center font-medium mb-1 dark:text-gray-300">{position.player.name}</p>
            <div className="flex justify-between w-full text-xs mb-3">
              <span className="text-gray-500 dark:text-gray-400">{position.player.team}</span>
              <span className="font-bold dark:text-gray-200">{position.player.price}</span>
            </div>
            
            {/* Mobile-friendly remove button */}
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(position.id);
                }}
                className="w-full py-1.5 px-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center"
                aria-label="Remove player"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            )}
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
              <span className="text-2xl text-gray-500 dark:text-gray-300">+</span>
            </div>
            <h3 className="font-bold text-sm mb-1 dark:text-white">{position.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Add {position.name}</p>
            <span className="mt-2 text-xs py-1 px-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
              Click to add
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default PositionCard;
