import React from "react";
import StarRating from "../StarRating";

interface StatsTabProps {
  player: any;
  playerStats: any;
  isLoading: boolean;
  error: string;
}

export const StatsTab: React.FC<StatsTabProps> = ({
  player,
  playerStats,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading detailed statistics...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="text-red-500 dark:text-red-400 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Player Ratings */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Player Ratings
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {player.ball_carrying !== null &&
            player.ball_carrying !== undefined && (
              <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <StarRating rating={player.ball_carrying} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Ball Carrying
                </div>
              </div>
            )}

          {player.tackling !== null && player.tackling !== undefined && (
            <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <StarRating rating={player.tackling} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Tackling
              </div>
            </div>
          )}

          {player.points_kicking !== null &&
            player.points_kicking !== undefined && (
              <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <StarRating rating={player.points_kicking} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Points Kicking
                </div>
              </div>
            )}

          {player.infield_kicking !== null &&
            player.infield_kicking !== undefined && (
              <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex flex-col items-center justify-center">
                  <StarRating rating={player.infield_kicking} />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Infield Kicking
                </div>
              </div>
            )}

          {player.strength !== null && player.strength !== undefined && (
            <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <StarRating rating={player.strength} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Strength
              </div>
            </div>
          )}

          {player.playmaking !== null && player.playmaking !== undefined && (
            <div className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
              <div className="flex flex-col items-center justify-center">
                <StarRating rating={player.playmaking} />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Playmaking
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed statistics sections */}
      {playerStats && <StatsCategories playerStats={playerStats} />}
    </div>
  );
};

interface StatsCategoriesProps {
  playerStats: any;
}

const StatsCategories: React.FC<StatsCategoriesProps> = ({ playerStats }) => {
  return (
    <>
      {/* General Stats */}
      {playerStats.categorizedStats.general.length > 0 && (
        <StatsCategory
          title="Season Performance"
          stats={playerStats.categorizedStats.general}
        />
      )}

      {/* Attack Stats */}
      {playerStats.categorizedStats.attack.length > 0 && (
        <StatsCategory
          title="Attack"
          stats={playerStats.categorizedStats.attack}
        />
      )}

      {/* Defense Stats */}
      {playerStats.categorizedStats.defense.length > 0 && (
        <StatsCategory
          title="Defense"
          stats={playerStats.categorizedStats.defense}
        />
      )}

      {/* Set Piece Stats */}
      {playerStats.categorizedStats.setpiece.length > 0 && (
        <StatsCategory
          title="Set Piece"
          stats={playerStats.categorizedStats.setpiece}
        />
      )}

      {/* Discipline Stats */}
      {playerStats.categorizedStats.discipline.length > 0 && (
        <StatsCategory
          title="Discipline"
          stats={playerStats.categorizedStats.discipline}
        />
      )}
    </>
  );
};

interface StatsCategoryProps {
  title: string;
  stats: any[];
}

const StatsCategory: React.FC<StatsCategoryProps> = ({ title, stats }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat: any) => (
          <div
            key={stat.action}
            className="text-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg"
          >
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {stat.displayValue ?? "N/A"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsTab;
