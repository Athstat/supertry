import { useState} from "react";
import {
  Trophy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { rankingsData } from "../data/rankings";
import React from "react";
import useSWR from "swr";
import { userRankingsService } from "../services/userRankingsService";
import { LoadingState } from "../components/ui/LoadingState";
import { authService } from "../services/authService";
import { useAuthUser } from "../hooks/useAuthUser";
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

interface Division {
  id: number;
  name: string;
  players: Player[];
}

export function RankingsScreen() {
  const [timeUntilReset, setTimeUntilReset] = useState("6d 23h 59m");
  const [currentDivision, setCurrentDivision] = useState(rankingsData[0]);

  const getRankChangeIcon = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUp className="w-4 h-4 text-green-500" />;
    }
    if (current > previous) {
      return <ArrowDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const isInPromotionZone = (rank: number) => rank <= 5;
  const isInDemotionZone = (rank: number) => rank >= 11;

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
