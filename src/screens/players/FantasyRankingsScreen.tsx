import React from "react";
import FantasyRankingsLeaderBoard from "../../components/rankings/RankingsLeaderBoard";
import UserRankingCard from "../../components/rankings/UserRankingCard";

export function FantasyRankingsScreen() {
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Top Section */}
      <UserRankingCard />

      {/* Leaderboard */}
      <FantasyRankingsLeaderBoard />
    </main>
  );
}
