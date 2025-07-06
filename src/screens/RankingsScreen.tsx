import React from "react";
import UserRankingCard from "../components/rankings/UserRankingCard";
import UserRankingsLeaderBoard from "../components/rankings/RankingsLeaderBoard";

export function FantasyRankingsScreen() {
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Top Section */}
      <UserRankingCard />

      {/* Leaderboard */}
      <UserRankingsLeaderBoard />
    </main>
  );
}
