import React from "react";
import { TeamCreationPositionSlot } from "../../types/position";
import { Award } from "lucide-react";

interface PositionCardProps {
  position: TeamCreationPositionSlot;
  selected: boolean;
  onPress: () => void;
  onRemove?: (positionId: string) => void;
  captainId?: string | null;
  setCaptainId?: (id: string | null) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  selected,
  onPress,
  onRemove,
  captainId,
  setCaptainId,
}) => {
  const hasPlayer = position.player !== undefined;
  const isSuperSub = position.isSpecial;
  const isCaptain = hasPlayer && captainId === position.player?.tracking_id;

  // Debug log for component render
  React.useEffect(() => {
    if (hasPlayer) {
      console.log("PositionCard rendered with player:", {
        playerName: position.player?.player_name,
        playerId: position.player?.tracking_id,
        hasCaptainSetter: !!setCaptainId,
        isCaptain,
        currentCaptainId: captainId
      });
    }
  }, [hasPlayer, position.player, setCaptainId, isCaptain, captainId]);

  const handleCaptainClick = (e: React.MouseEvent) => {
    console.log("Captain button clicked - START");
    e.preventDefault();
    e.stopPropagation();
    console.log("Captain icon clicked!", { 
      hasPlayer, 
      playerInfo: position.player,
      currentCaptainId: captainId 
    });
    
    if (!hasPlayer || !setCaptainId) {
      console.log("Cannot set captain: ", {
        hasPlayer,
        hasCaptainSetter: !!setCaptainId
      });
      return;
    }
    
    if (captainId === position.player?.tracking_id) {
      console.log("Removing captain status");
      setCaptainId(null);
    } else {
      console.log("Setting new captain:", position.player?.player_name, position.player?.tracking_id);
      setCaptainId(position.player?.tracking_id || null);
    }
    console.log("Captain button clicked - END");
  };

  return (
    <div
      onClick={() => (hasPlayer ? null : onPress())}
      className={`
        bg-white dark:bg-dark-800 rounded-lg shadow-md p-4 cursor-pointer transition
        hover:shadow-lg transform hover:-translate-y-1 
        ${selected ? "ring-2 ring-green-500 dark:ring-green-400" : ""}
        ${hasPlayer ? "bg-gray-50 dark:bg-dark-750" : ""}
        ${isCaptain ? "border-2 border-yellow-400" : ""}
      `}
    >
      <div className="flex flex-col items-center">
        {position.player ? (
          <>
            <div className="relative w-full flex flex-col items-center mb-1">
              {hasPlayer && setCaptainId && (
                <button
                  onClick={handleCaptainClick}
                  className="absolute top-0 right-0 z-10 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Set as captain"
                  aria-label={isCaptain ? "Remove as captain" : "Set as captain"}
                >
                  <Award 
                    className={`w-6 h-6 transition-colors ${
                      isCaptain ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-500"
                    }`} 
                  />
                </button>
              )}
              <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                {position.player.image_url ? (
                  <img
                    src={position.player.image_url}
                    alt={position.player.player_name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {position.player.player_name?.charAt(0) ?? ""}
                  </span>
                )}
              </div>
            </div>
            <h3
              className={`font-bold text-sm mb-1 dark:text-white ${
                isSuperSub ? "text-orange-600 dark:text-orange-400" : ""
              }`}
            >
              {position.name}
            </h3>
            <p className="text-xs text-center font-medium mb-1 dark:text-gray-300">
              {position.player.player_name}
            </p>
            
            <div className="flex justify-between w-full text-xs mb-3">
              <span className="text-gray-500 dark:text-gray-400">
                {position.player.team_name}
              </span>
              <span className="font-bold dark:text-gray-200 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.94 7.13a1 1 0 011.95-.26c.112.84.234 1.677.357 2.514.234-.705.469-1.412.704-2.119a1 1 0 011.857.737 1 1 0 01.027.063c.234.705.469 1.412.704 2.119.121-.84.242-1.678.351-2.516a1 1 0 011.954.262c-.16 1.192-.32 2.383-.48 3.575 0 .004-.003.005-.005.006l-.008.032-.006.025-.008.028-.008.03-.01.03a1 1 0 01-1.092.698.986.986 0 01-.599-.28l-.01-.008a.997.997 0 01-.29-.423c-.272-.818-.543-1.635-.815-2.453-.272.818-.544 1.635-.816 2.453a1 1 0 01-1.953-.331c-.156-1.167-.312-2.334-.468-3.502a1 1 0 01.744-1.114z" />
                </svg>
                {position.player.price}
              </span>
            </div>

                        
            {/* Captain button as separate control */}
            {hasPlayer && setCaptainId && (
              <button
                onClick={handleCaptainClick}
                className={`text-xs py-1.5 px-2 rounded mb-2 flex items-center justify-center w-full ${
                  isCaptain 
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                }`}
              >
                <Award className={`w-3.5 h-3.5 mr-1.5 ${isCaptain ? "fill-yellow-400" : ""}`} />
                {isCaptain ? "Captain" : "Make Captain"}
              </button>
            )}
            
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove
              </button>
            )}
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
              <span className="text-2xl text-gray-500 dark:text-gray-300">
                +
              </span>
            </div>
            <h3
              className={`font-bold text-sm mb-1 dark:text-white ${
                isSuperSub ? "text-orange-600 dark:text-orange-400" : ""
              }`}
            >
              {position.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add {position.name}
              {isSuperSub && (
                <span className="block text-orange-500 font-semibold mt-0.5">
                  Any Position
                </span>
              )}
            </p>
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
