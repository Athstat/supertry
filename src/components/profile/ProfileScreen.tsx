export function ProfileScreen() {
  const userStats = {
    totalPoints: 2456,
    currentRank: 42,
    bestRank: 12,
    bestSeason: "2023/24",
    favoriteTeam: "Crusaders",
    gamesPlayed: 156,
    currentDivision: 1,
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-850">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Header remains the same */}

        {/* Stats Grid - Updated */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
            <div className="text-sm text-gray-600 dark:text-white">
              Total Points
            </div>
            <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
              {Math.floor(userStats.totalPoints)}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
            <div className="text-sm text-gray-600 dark:text-white">
              Current Rank
            </div>
            <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
              #{userStats.currentRank}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
            <div className="text-sm text-gray-600 dark:text-white">
              Best Rank
            </div>
            <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
              #{userStats.bestRank}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-800/40 rounded-xl p-4">
            <div className="text-sm text-gray-600 dark:text-white">
              Division
            </div>
            <div className="text-xl font-bold text-primary-700 dark:text-primary-500">
              {userStats.currentDivision}
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
      </div>
    </main>
  );
}
