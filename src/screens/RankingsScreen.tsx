import { useState} from "react";
import {
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { rankingsData } from "../data/rankings";
import React from "react";
import UserRankingCard from "../components/rankings/UserRankingCard";
import UserRankingsLeaderBoard from "../components/rankings/RankingsLeaderBoard";

interface Player {
  id: string;
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  points: number;
  isCurrentUser?: boolean;
}


export function RankingsScreen() {
  
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
